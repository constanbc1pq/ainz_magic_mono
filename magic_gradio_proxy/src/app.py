"""FastAPI application for Magic Gradio Proxy"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import time
import os
from typing import Dict, Any

from .config import settings
from .models import (
    ProcessRequest, ProcessResponse,
    UploadRequest, UploadResponse,
    HealthResponse,
    ImageTo3DRequest, ImageTo3DResponse,
    MultiSpaceHealthResponse
)
from .gradio_client import gradio_client
from .multi_space_client import multi_space_client
from .file_logger import file_logger


# Track service start time
SERVICE_START_TIME = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    file_logger.info("Starting Magic Gradio Proxy service")
    
    # Connect to Gradio Space
    if gradio_client.connect():
        file_logger.info("Successfully connected to Gradio Space on startup")
    else:
        file_logger.warning("Failed to connect to Gradio Space on startup")
    
    yield
    
    # Shutdown
    file_logger.info("Shutting down Magic Gradio Proxy service")
    gradio_client.disconnect()


# Create FastAPI app
app = FastAPI(
    title="Magic Gradio Proxy",
    description="Backend service for interacting with Magic Articulate HF Space",
    version="1.0.0",
    lifespan=lifespan
)


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# IP whitelist middleware
@app.middleware("http")
async def ip_whitelist_middleware(request: Request, call_next):
    """Only allow requests from whitelisted IPs"""
    if settings.enable_ip_whitelist:
        client_ip = request.client.host
        
        if client_ip not in settings.allowed_ips_list:
            file_logger.warning(f"Blocked request from unauthorized IP: {client_ip}")
            raise HTTPException(status_code=403, detail="Access denied")
    
    response = await call_next(request)
    return response


@app.get("/", response_model=Dict[str, Any])
async def root():
    """Root endpoint with service information"""
    return {
        "service": "Magic Gradio Proxy",
        "version": "1.0.0",
        "status": "running",
        "connected_to_space": gradio_client.is_connected,
        "space_name": settings.hf_space,
        "endpoints": {
            "health": "/health",
            "process": "/process",
            "upload": "/upload",
            "reconnect": "/reconnect"
        }
    }


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    uptime = time.time() - SERVICE_START_TIME
    
    return HealthResponse(
        status="healthy" if gradio_client.is_connected else "degraded",
        connected_to_space=gradio_client.is_connected,
        space_name=settings.hf_space,
        uptime=uptime,
        last_request_time=gradio_client.last_request_time
    )


@app.post("/upload", response_model=UploadResponse)
async def upload_model(request: UploadRequest):
    """Upload a 3D model file (streaming mode - no temp storage)"""
    try:
        file_logger.info(f"Received upload request for file: {request.file_name}")
        
        # 流式模式：不保存临时文件，直接返回文件信息
        # 验证base64内容格式
        try:
            import base64
            base64.b64decode(request.file_content)
        except Exception as e:
            return UploadResponse(
                success=False,
                error_message=f"Invalid base64 content: {str(e)}"
            )
        
        # Generate a unique file ID
        file_id = f"upload_{int(time.time())}_{request.file_name}"
        
        file_logger.info(f"Upload validated successfully: {file_id}")
        
        return UploadResponse(
            success=True,
            file_path=None,  # 流式模式不返回文件路径
            file_id=file_id
        )
            
    except Exception as e:
        error_msg = f"Upload failed: {str(e)}"
        file_logger.error(error_msg)
        return UploadResponse(
            success=False,
            error_message=error_msg
        )


@app.post("/process", response_model=ProcessResponse)
async def process_model(request: ProcessRequest):
    """Process a 3D model through the AI (streaming mode)"""
    try:
        file_logger.info(f"Processing model: {request.file_name}")
        
        # 流式模式：直接使用base64内容处理
        result = gradio_client.process_model_from_base64(
            request.file_name,
            request.file_content,
            request.text_prompt,
            confidence=request.confidence,
            preview=request.preview
        )
        
        if result.get("success", False):
            return ProcessResponse(
                success=True,
                result_data=result.get("result_data"),
                file_contents=result.get("file_contents"),
                file_names=result.get("file_names"),
                processing_time=result.get("processing_time")
            )
        else:
            return ProcessResponse(
                success=False,
                error_message=result.get("error", "Unknown error")
            )
            
    except Exception as e:
        error_msg = f"Processing failed: {str(e)}"
        file_logger.error(error_msg)
        return ProcessResponse(
            success=False,
            error_message=error_msg
        )


# 移除download端点 - 流式模式下文件内容直接在process响应中返回


@app.post("/reconnect")
async def reconnect_to_space():
    """Force reconnection to Gradio Space"""
    try:
        file_logger.info("Forcing reconnection to Gradio Space")
        
        # Disconnect first
        gradio_client.disconnect()
        
        # Reconnect
        success = gradio_client.connect()
        
        return {
            "success": success,
            "connected": gradio_client.is_connected,
            "message": "Reconnected successfully" if success else "Reconnection failed"
        }
        
    except Exception as e:
        error_msg = f"Reconnection failed: {str(e)}"
        file_logger.error(error_msg)
        return {
            "success": False,
            "connected": False,
            "message": error_msg
        }


@app.post("/image-to-3d", response_model=ImageTo3DResponse)
async def image_to_3d(request: ImageTo3DRequest):
    """Convert image to 3D model using TRELLIS"""
    start_time = time.time()
    
    try:
        file_logger.info(f"Processing image to 3D: {request.image_name}")
        
        result = await multi_space_client.process_image_to_3d(
            image_content_base64=request.image_content,
            image_name=request.image_name,
            seed=request.seed,
            ss_guidance_strength=request.ss_guidance_strength,
            ss_sampling_steps=request.ss_sampling_steps,
            slat_guidance_strength=request.slat_guidance_strength,
            slat_sampling_steps=request.slat_sampling_steps,
            mesh_simplify=request.mesh_simplify,
            texture_size=request.texture_size
        )
        
        processing_time = time.time() - start_time
        
        if result.get("status") == "success":
            return ImageTo3DResponse(
                success=True,
                files=result.get("files", {}),
                metadata=result.get("metadata", {}),
                processing_time=processing_time
            )
        else:
            return ImageTo3DResponse(
                success=False,
                error_message=result.get("error", "Unknown error"),
                processing_time=processing_time
            )
            
    except Exception as e:
        error_msg = f"Image to 3D processing failed: {str(e)}"
        file_logger.error(error_msg)
        return ImageTo3DResponse(
            success=False,
            error_message=error_msg,
            processing_time=time.time() - start_time
        )


@app.post("/model-to-skeleton", response_model=ProcessResponse)
async def model_to_skeleton(request: ProcessRequest):
    """Convert 3D model to skeleton using MagicArticulate"""
    start_time = time.time()
    
    try:
        file_logger.info(f"Processing model to skeleton: {request.file_name}")
        
        result = await multi_space_client.process_model_to_skeleton(
            model_content_base64=request.file_content,
            model_name=request.file_name,
            text_prompt=request.text_prompt,
            confidence=request.confidence,
            preview=request.preview
        )
        
        processing_time = time.time() - start_time
        
        if result.get("status") == "success":
            return ProcessResponse(
                success=True,
                result_data=result.get("metadata", {}),
                file_contents=result.get("files", {}),
                file_names={
                    key: f"{request.file_name}_{key}"
                    for key in result.get("files", {}).keys()
                },
                processing_time=processing_time
            )
        else:
            return ProcessResponse(
                success=False,
                error_message=result.get("error", "Unknown error"),
                processing_time=processing_time
            )
            
    except Exception as e:
        error_msg = f"Model to skeleton processing failed: {str(e)}"
        file_logger.error(error_msg)
        return ProcessResponse(
            success=False,
            error_message=error_msg,
            processing_time=time.time() - start_time
        )


@app.get("/health-multi", response_model=MultiSpaceHealthResponse)
async def health_check_multi():
    """Multi-space health check"""
    try:
        uptime = time.time() - SERVICE_START_TIME
        
        # Check status of all spaces
        spaces_status = await multi_space_client.health_check()
        
        # Determine overall status
        all_available = all(
            space.get("available", False) 
            for space in spaces_status.values()
        )
        
        overall_status = "healthy" if all_available else "degraded"
        
        return MultiSpaceHealthResponse(
            status=overall_status,
            spaces=spaces_status,
            uptime=uptime
        )
        
    except Exception as e:
        file_logger.error(f"Multi-space health check failed: {e}")
        return MultiSpaceHealthResponse(
            status="unhealthy",
            spaces={},
            uptime=time.time() - SERVICE_START_TIME
        )


@app.post("/reconnect-all")
async def reconnect_all_spaces():
    """Reconnect to all spaces"""
    try:
        file_logger.info("Reconnecting to all spaces")
        
        # Disconnect from all spaces
        await multi_space_client.reconnect_all()
        
        # Check health after reconnection
        health_status = await multi_space_client.health_check()
        
        return {
            "success": True,
            "message": "Reconnected to all spaces",
            "spaces": health_status
        }
        
    except Exception as e:
        error_msg = f"Reconnection to all spaces failed: {str(e)}"
        file_logger.error(error_msg)
        return {
            "success": False,
            "message": error_msg
        }