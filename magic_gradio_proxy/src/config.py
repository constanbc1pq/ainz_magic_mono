"""Configuration management for Magic Gradio Proxy"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
import os


class Settings(BaseSettings):
    # Service configuration
    service_host: str = Field(default="0.0.0.0", env="SERVICE_HOST", description="Service host")
    service_port: int = Field(default=5719, env="SERVICE_PORT", description="Service port")
    environment: str = Field(default="development", env="ENVIRONMENT", description="Environment")
    
    # HuggingFace configuration - MagicArticulate
    hf_token: str = Field(default="", env="HF_TOKEN", description="HuggingFace API token")
    hf_space: str = Field(
        default="nomad2082/magic-plus-1",
        env="HF_SPACE",
        description="HuggingFace Space name for MagicArticulate"
    )
    
    # HuggingFace configuration - TRELLIS
    trellis_hf_token: str = Field(default="", env="TRELLIS_HF_TOKEN", description="TRELLIS HuggingFace API token")
    trellis_space: str = Field(
        default="trellis-community/TRELLIS",
        env="TRELLIS_SPACE",
        description="HuggingFace Space name for TRELLIS"
    )
    
    # Backend integration
    backend_url: str = Field(default="http://localhost:5720", env="BACKEND_URL", description="Backend URL")
    backend_api_key: str = Field(default="", env="BACKEND_API_KEY", description="Backend API key")
    
    # CORS configuration
    allowed_origins: str = Field(
        default="http://localhost:3000,http://localhost:3001,http://localhost:5720",
        env="ALLOWED_ORIGINS",
        description="Allowed origins for CORS"
    )
    
    # Security settings
    allowed_ips: str = Field(
        default="127.0.0.1,::1,localhost",
        env="ALLOWED_IPS",
        description="Comma-separated list of allowed IP addresses"
    )
    enable_ip_whitelist: bool = Field(default=True, env="ENABLE_IP_WHITELIST", description="Enable IP whitelist")
    
    # File processing configuration
    temp_dir: str = Field(default="/tmp/magic_proxy", env="TEMP_DIR", description="Temporary directory")
    max_file_size: int = Field(default=104857600, env="MAX_FILE_SIZE", description="Maximum file size")
    supported_3d_formats: str = Field(
        default="obj,fbx,glb,gltf,ply,stl",
        env="SUPPORTED_3D_FORMATS",
        description="Supported 3D file formats"
    )
    supported_image_formats: str = Field(
        default="jpg,jpeg,png,webp",
        env="SUPPORTED_IMAGE_FORMATS",
        description="Supported image file formats"
    )
    
    # Request configuration
    request_timeout: int = Field(default=300, env="REQUEST_TIMEOUT", description="Request timeout in seconds")
    connection_timeout: int = Field(default=30, env="CONNECTION_TIMEOUT", description="Connection timeout")
    max_retries: int = Field(default=3, env="MAX_RETRIES", description="Maximum retries")
    
    # Logging settings
    log_level: str = Field(default="INFO", env="LOG_LEVEL", description="Logging level")
    log_file: str = Field(default="logs/magic_proxy.log", env="LOG_FILE", description="Log file path")
    enable_file_logging: bool = Field(default=True, env="ENABLE_FILE_LOGGING", description="Enable file logging")
    
    # Performance configuration
    worker_threads: int = Field(default=4, env="WORKER_THREADS", description="Worker threads")
    max_concurrent_requests: int = Field(default=10, env="MAX_CONCURRENT_REQUESTS", description="Max concurrent requests")
    
    # Security configuration
    enable_request_logging: bool = Field(default=True, env="ENABLE_REQUEST_LOGGING", description="Enable request logging")
    
    # Helper properties to convert comma-separated strings to lists
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(',')]
    
    @property
    def allowed_ips_list(self) -> List[str]:
        return [ip.strip() for ip in self.allowed_ips.split(',')]
    
    @property
    def supported_3d_formats_list(self) -> List[str]:
        return [fmt.strip() for fmt in self.supported_3d_formats.split(',')]
    
    @property
    def supported_image_formats_list(self) -> List[str]:
        return [fmt.strip() for fmt in self.supported_image_formats.split(',')]
    
    @property
    def supported_formats_list(self) -> List[str]:
        """All supported formats (3D + image)"""
        return self.supported_3d_formats_list + self.supported_image_formats_list
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Create global settings instance
settings = Settings()

# Ensure log directory exists
log_dir = os.path.dirname(settings.log_file)
if log_dir:
    os.makedirs(log_dir, exist_ok=True)