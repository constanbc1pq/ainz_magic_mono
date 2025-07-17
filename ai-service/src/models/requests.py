"""
API请求和响应模型定义
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum

class ProcessingOptions(BaseModel):
    """处理选项"""
    use_prompt_guidance: bool = Field(default=True, description="是否使用提示词引导")
    prompt_weight: float = Field(default=0.5, ge=0.0, le=1.0, description="提示词影响权重")
    input_pc_num: int = Field(default=8192, description="输入点云数量")
    apply_marching_cubes: bool = Field(default=False, description="是否应用Marching Cubes")
    octree_depth: int = Field(default=7, description="八叉树深度")
    hier_order: bool = Field(default=False, description="是否使用层次顺序")

class ProcessingRequest(BaseModel):
    """处理请求"""
    file_path: str = Field(..., description="3D模型文件路径")
    user_prompt: Optional[str] = Field(None, description="用户提示词")
    processing_options: ProcessingOptions = Field(default_factory=ProcessingOptions)

class ProcessingStatus(str, Enum):
    """处理状态枚举"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class SkeletonData(BaseModel):
    """骨骼数据"""
    joints: List[List[float]] = Field(..., description="关节坐标")
    bones: List[List[int]] = Field(..., description="骨骼连接")
    joint_names: Optional[List[str]] = Field(None, description="关节名称")
    root_index: Optional[int] = Field(None, description="根关节索引")

class ProcessingResult(BaseModel):
    """处理结果"""
    skeleton_data: Optional[SkeletonData] = None
    joint_count: Optional[int] = Field(None, description="关节数量")
    bone_count: Optional[int] = Field(None, description="骨骼数量")
    processing_time: Optional[float] = Field(None, description="处理时间(秒)")
    user_prompt: Optional[str] = Field(None, description="用户提示词")
    prompt_influence_score: Optional[float] = Field(None, description="提示词影响分数")
    result_file_path: Optional[str] = Field(None, description="结果文件路径")
    error_message: Optional[str] = Field(None, description="错误信息")

class ProcessingResponse(BaseModel):
    """处理响应"""
    status: ProcessingStatus = Field(..., description="处理状态")
    message: str = Field(..., description="响应消息")
    task_id: Optional[str] = Field(None, description="任务ID")
    result: Optional[ProcessingResult] = Field(None, description="处理结果")

class PromptTemplate(BaseModel):
    """提示词模板"""
    id: str = Field(..., description="模板ID")
    category: str = Field(..., description="模板分类")
    template: str = Field(..., description="模板内容")
    description: Optional[str] = Field(None, description="模板描述")
    variables: Optional[List[str]] = Field(None, description="模板变量")

class FileUploadResponse(BaseModel):
    """文件上传响应"""
    message: str = Field(..., description="响应消息")
    file_path: str = Field(..., description="文件路径")
    file_size: int = Field(..., description="文件大小")
    file_type: str = Field(..., description="文件类型")