"""
ArticulateHub AI Service
基于MagicArticulate的增强版3D模型骨骼生成服务
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
import logging
from pathlib import Path

from services.articulation_service import ArticulationService
from services.text_processor import TextProcessor
from models.requests import ProcessingRequest, ProcessingResponse

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 创建FastAPI应用
app = FastAPI(
    title="ArticulateHub AI Service",
    description="AI-powered 3D model articulation service with text guidance",
    version="1.0.0"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 开发环境允许所有源
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化服务
articulation_service = ArticulationService()
text_processor = TextProcessor()

# 创建必要的目录
UPLOAD_DIR = Path("/app/uploads")
RESULTS_DIR = Path("/app/results")
UPLOAD_DIR.mkdir(exist_ok=True)
RESULTS_DIR.mkdir(exist_ok=True)

@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化"""
    logger.info("🚀 ArticulateHub AI Service starting up...")
    await articulation_service.initialize()
    logger.info("✅ AI Service ready!")

@app.get("/")
async def root():
    """健康检查接口"""
    return {
        "message": "ArticulateHub AI Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """详细的健康检查"""
    return {
        "status": "healthy",
        "services": {
            "magicarticulate": await articulation_service.health_check(),
            "text_processor": text_processor.health_check()
        }
    }

@app.post("/process", response_model=ProcessingResponse)
async def process_model(
    background_tasks: BackgroundTasks,
    request: ProcessingRequest
):
    """
    处理3D模型生成骨骼
    支持文本提示词引导
    """
    try:
        # 验证文件是否存在
        if not os.path.exists(request.file_path):
            raise HTTPException(status_code=404, detail="Model file not found")
        
        # 异步处理任务
        background_tasks.add_task(
            process_model_task,
            request.file_path,
            request.user_prompt,
            request.processing_options
        )
        
        return ProcessingResponse(
            status="accepted",
            message="Processing started",
            task_id=f"task_{hash(request.file_path)}"
        )
        
    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_model_task(
    file_path: str, 
    user_prompt: Optional[str], 
    options: dict
):
    """后台处理任务"""
    try:
        result = await articulation_service.process_model_with_prompt(
            file_path=file_path,
            user_prompt=user_prompt,
            **options
        )
        
        # 这里可以添加结果存储逻辑
        logger.info(f"Processing completed for {file_path}")
        return result
        
    except Exception as e:
        logger.error(f"Background task error: {str(e)}")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """上传3D模型文件"""
    try:
        # 验证文件类型
        allowed_extensions = {".obj", ".ply", ".stl", ".glb", ".fbx"}
        file_extension = Path(file.filename).suffix.lower()
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type: {file_extension}"
            )
        
        # 保存文件
        file_path = UPLOAD_DIR / file.filename
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "message": "File uploaded successfully",
            "file_path": str(file_path),
            "file_size": len(content),
            "file_type": file_extension
        }
        
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/prompt-templates")
async def get_prompt_templates():
    """获取提示词模板"""
    return text_processor.get_templates()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )