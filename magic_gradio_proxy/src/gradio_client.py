"""Gradio client wrapper for Magic Articulate Space - Streaming Mode

流式传输设计理念 (Streaming File Transfer Design):
==========================================

核心原则：Magic Gradio Proxy 作为纯粹的数据传输管道，不在本地存储任何文件

MagicArticulate处理流程：
1. 上传流程：Backend → base64编码 → Proxy → 临时文件(仅供gradio_client) → MagicArticulate Space
2. 下载流程：MagicArticulate Space → 临时文件 → 立即读取+base64编码 → 立即删除 → Backend

详细流程：
- 3D Model to Skeleton: 模型base64 → MagicArticulate Space → OBJ/TXT/ZIP文件base64

临时文件策略：
- 仅在gradio_client API需要时创建临时文件
- 文件创建后立即调用MagicArticulate Space API
- 处理完成后立即删除临时文件
- 所有结果文件立即读取转换为base64并删除源文件

与测试脚本的区别：
- 正式流程：Backend发送base64 → Proxy流式处理 → Backend接收base64并保存
- 测试脚本：直接读取本地文件 → 上传测试 → 下载到本地文件
- 测试脚本使用handle_file()函数是因为直接处理本地文件路径
- 正式流程使用直接文件路径是因为临时文件已经创建好了
"""

from gradio_client import Client
try:
    from gradio_client.data_classes import FileData
except ImportError:
    # Fallback for older versions
    from gradio_client import FileData
from typing import Optional, Dict, Any, Tuple
import base64
import tempfile
import os
import time
import json
from pathlib import Path
import io

from .config import settings
from .file_logger import file_logger


class GradioClientManager:
    def __init__(self):
        self.client: Optional[Client] = None
        self.space_name = settings.hf_space
        self.hf_token = settings.hf_token
        self.is_connected = False
        self.last_request_time: Optional[float] = None
        
        # 流式模式：不再使用临时文件存储
        
    def connect(self) -> bool:
        """Connect to HuggingFace Gradio Space"""
        try:
            file_logger.info(f"Attempting to connect to space: {self.space_name}")
            
            # Create client with authentication if token is provided
            if self.hf_token:
                self.client = Client(
                    self.space_name,
                    hf_token=self.hf_token
                )
            else:
                self.client = Client(self.space_name)
            
            self.is_connected = True
            file_logger.info("Successfully connected to Gradio Space")
            return True
            
        except Exception as e:
            self.is_connected = False
            file_logger.error(f"Failed to connect to Gradio Space: {str(e)}")
            return False
    
    def ensure_connected(self) -> bool:
        """Ensure connection is established"""
        if not self.is_connected or not self.client:
            return self.connect()
        return True
    
    def process_model_from_base64(self, file_name: str, file_content_base64: str, text_prompt: str, seed: int = 42, confidence: float = 0.8, preview: bool = True) -> Dict[str, Any]:
        """Process 3D model through Gradio Space using base64 content (no temp files)"""
        if not self.ensure_connected():
            return {
                "success": False,
                "error": "Failed to connect to Gradio Space"
            }
        
        try:
            start_time = time.time()
            self.last_request_time = start_time
            
            file_logger.info("Processing model from base64", {
                "file_name": file_name,
                "prompt": text_prompt,
                "confidence": confidence,
                "preview": preview
            })
            
            # Decode base64 content to bytes
            try:
                file_content = base64.b64decode(file_content_base64)
            except Exception as e:
                return {
                    "success": False,
                    "error": f"Invalid base64 content: {str(e)}"
                }
            
            # Create temporary file in memory for gradio_client
            # This is the minimal temp file needed for gradio_client API
            with tempfile.NamedTemporaryFile(suffix=Path(file_name).suffix, delete=False) as tmp_file:
                tmp_file.write(file_content)
                tmp_file_path = tmp_file.name
            
            try:
                # Call the Gradio Space with correct parameters
                result = self.client.predict(
                    tmp_file_path,    # Direct file path
                    text_prompt,                   # Text prompt
                    confidence,                    # Confidence threshold
                    preview,                       # Generate preview
                    fn_index=5  # Use fn_index instead of api_name for better compatibility
                )
                
                processing_time = time.time() - start_time
                
                # Parse the result and return file contents as base64
                parsed_result = self._parse_gradio_result_streaming(result)
                parsed_result["processing_time"] = processing_time
                
                file_logger.info("Model processed successfully", {
                    "processing_time": processing_time,
                    "result_keys": list(parsed_result.keys()) if isinstance(parsed_result, dict) else None
                })
                
                return parsed_result
                
            finally:
                # Clean up the temporary file immediately
                try:
                    os.unlink(tmp_file_path)
                except:
                    pass  # Ignore cleanup errors
            
        except Exception as e:
            error_msg = f"Error processing model: {str(e)}"
            file_logger.error(error_msg)
            return {
                "success": False,
                "error": error_msg
            }
    
    # 移除upload_model_base64方法 - 改为直接在process_model_from_base64中处理
    
    def _parse_gradio_result_streaming(self, result: Any) -> Dict[str, Any]:
        """Parse result from Magic Articulate Space and stream file contents as base64"""
        try:
            # Magic Articulate Space returns tuple of 9 elements:
            # [0] status_text, [1] skeleton_data_json, [2] obj_file, [3] txt_file, 
            # [4] zip_file, [5] visualization_html, [6] markdown, [7] error_info, [8] error_info_2
            
            if isinstance(result, (list, tuple)) and len(result) >= 9:
                status_text = result[0]
                skeleton_data_json = result[1]
                obj_file = result[2]
                txt_file = result[3]
                zip_file = result[4]
                visualization_html = result[5]
                markdown = result[6]
                error_info = result[7]
                error_info_2 = result[8]
                
                # Check if processing was successful
                # error_info_2 might be a visibility update, not a real error
                is_error_2_real = error_info_2 and not (isinstance(error_info_2, dict) and error_info_2.get('__type__') == 'update')
                
                if error_info or is_error_2_real:
                    return {
                        "success": False,
                        "error": error_info or error_info_2
                    }
                
                # Stream file contents as base64 (no local storage)
                file_contents = {}
                file_names = {}
                current_timestamp = int(time.time())
                
                # Read files and convert to base64 immediately, then clean up
                if obj_file and os.path.exists(obj_file):
                    try:
                        with open(obj_file, 'rb') as f:
                            file_contents["obj"] = base64.b64encode(f.read()).decode('utf-8')
                            file_names["obj"] = f"skeleton_{current_timestamp}.obj"
                        # Clean up immediately
                        try:
                            os.unlink(obj_file)
                        except:
                            pass
                    except Exception as e:
                        file_logger.error(f"Failed to read OBJ file: {e}")
                
                if txt_file and os.path.exists(txt_file):
                    try:
                        with open(txt_file, 'rb') as f:
                            file_contents["txt"] = base64.b64encode(f.read()).decode('utf-8')
                            file_names["txt"] = f"skeleton_{current_timestamp}.txt"
                        # Clean up immediately
                        try:
                            os.unlink(txt_file)
                        except:
                            pass
                    except Exception as e:
                        file_logger.error(f"Failed to read TXT file: {e}")
                        
                if zip_file and os.path.exists(zip_file):
                    try:
                        with open(zip_file, 'rb') as f:
                            file_contents["zip"] = base64.b64encode(f.read()).decode('utf-8')
                            file_names["zip"] = f"skeleton_{current_timestamp}.zip"
                        # Clean up immediately
                        try:
                            os.unlink(zip_file)
                        except:
                            pass
                    except Exception as e:
                        file_logger.error(f"Failed to read ZIP file: {e}")
                
                return {
                    "success": True,
                    "result_data": {
                        "status": status_text,
                        "skeleton_data": skeleton_data_json,
                        "visualization": visualization_html,
                        "markdown": markdown
                    },
                    "file_contents": file_contents,
                    "file_names": file_names
                }
            
            # Fallback for other formats
            elif isinstance(result, dict):
                return {
                    "success": True,
                    "result_data": result
                }
            elif isinstance(result, str):
                return {
                    "success": True,
                    "result_data": {"output": result}
                }
            else:
                return {
                    "success": True,
                    "result_data": {"raw_output": str(result)}
                }
                
        except Exception as e:
            file_logger.error(f"Failed to parse Gradio result: {str(e)}")
            return {
                "success": False,
                "error": f"Failed to parse result: {str(e)}"
            }
    
    # Removed download_result_file method - files are now read directly in _parse_gradio_result
    
    # 移除cleanup_temp_files方法 - 流式模式不需要临时文件管理
    
    def disconnect(self):
        """Disconnect from Gradio Space"""
        self.client = None
        self.is_connected = False
        file_logger.info("Disconnected from Gradio Space")


# Create global client instance
gradio_client = GradioClientManager()