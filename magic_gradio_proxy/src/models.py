"""Data models for Magic Gradio Proxy"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class ProcessRequest(BaseModel):
    """Request model for 3D model processing (streaming mode)"""
    model_config = {"protected_namespaces": ()}
    
    file_name: str = Field(..., description="Name of the 3D model file")
    file_content: str = Field(..., description="Base64 encoded file content")
    text_prompt: str = Field(..., description="Text prompt for articulation")
    confidence: Optional[float] = Field(default=0.8, description="Confidence threshold for processing")
    preview: Optional[bool] = Field(default=True, description="Generate preview visualization")
    extra_params: Optional[Dict[str, Any]] = Field(default={}, description="Additional parameters")


class ProcessResponse(BaseModel):
    """Response model for 3D model processing"""
    success: bool = Field(..., description="Whether processing was successful")
    result_data: Optional[Dict[str, Any]] = Field(default=None, description="Processing results")
    file_contents: Optional[Dict[str, str]] = Field(default=None, description="Base64 encoded file contents")
    file_names: Optional[Dict[str, str]] = Field(default=None, description="Suggested file names")
    error_message: Optional[str] = Field(default=None, description="Error message if failed")
    processing_time: Optional[float] = Field(default=None, description="Processing time in seconds")
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())


class UploadRequest(BaseModel):
    """Request model for file upload"""
    file_name: str = Field(..., description="Name of the file")
    file_content: str = Field(..., description="Base64 encoded file content")
    file_type: Optional[str] = Field(default="obj", description="File type/extension")


class UploadResponse(BaseModel):
    """Response model for file upload"""
    success: bool = Field(..., description="Whether upload was successful")
    file_path: Optional[str] = Field(default=None, description="Path to uploaded file on server")
    file_id: Optional[str] = Field(default=None, description="Unique identifier for the file")
    error_message: Optional[str] = Field(default=None, description="Error message if failed")


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str = Field(..., description="Service health status")
    connected_to_space: bool = Field(..., description="Connection status to HF Space")
    space_name: str = Field(..., description="Connected HF Space name")
    uptime: float = Field(..., description="Service uptime in seconds")
    last_request_time: Optional[float] = Field(default=None, description="Timestamp of last request")


class DownloadRequest(BaseModel):
    """Request model for downloading results"""
    result_id: str = Field(..., description="ID of the processing result")
    file_format: str = Field(default="json", description="Desired output format")


class DownloadResponse(BaseModel):
    """Response model for download"""
    success: bool = Field(..., description="Whether download preparation was successful")
    file_content: Optional[str] = Field(default=None, description="Base64 encoded file content")
    file_name: Optional[str] = Field(default=None, description="Suggested file name")
    mime_type: Optional[str] = Field(default=None, description="MIME type of the file")
    error_message: Optional[str] = Field(default=None, description="Error message if failed")


class ImageTo3DRequest(BaseModel):
    """Request model for image to 3D model conversion"""
    image_name: str = Field(..., description="Name of the image file")
    image_content: str = Field(..., description="Base64 encoded image content")
    seed: Optional[int] = Field(default=0, description="Random seed for generation")
    ss_guidance_strength: Optional[float] = Field(default=7.5, description="SS guidance strength")
    ss_sampling_steps: Optional[int] = Field(default=12, description="SS sampling steps")
    slat_guidance_strength: Optional[float] = Field(default=3.0, description="SLAT guidance strength")
    slat_sampling_steps: Optional[int] = Field(default=12, description="SLAT sampling steps")
    mesh_simplify: Optional[float] = Field(default=0.95, description="Mesh simplification factor")
    texture_size: Optional[int] = Field(default=1024, description="Texture size")


class ImageTo3DResponse(BaseModel):
    """Response model for image to 3D model conversion"""
    success: bool = Field(..., description="Whether processing was successful")
    files: Optional[Dict[str, str]] = Field(default=None, description="Generated files (base64 encoded)")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Processing metadata")
    error_message: Optional[str] = Field(default=None, description="Error message if failed")
    processing_time: Optional[float] = Field(default=None, description="Processing time in seconds")
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())


class MultiSpaceHealthResponse(BaseModel):
    """Health check response for multi-space setup"""
    status: str = Field(..., description="Overall service status")
    spaces: Dict[str, Dict[str, Any]] = Field(..., description="Status of each space")
    uptime: float = Field(..., description="Service uptime in seconds")