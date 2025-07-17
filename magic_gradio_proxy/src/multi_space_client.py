"""Multi-Space client manager for handling both TRELLIS and MagicArticulate

流式传输设计理念 (Streaming File Transfer Design):
==========================================

核心原则：Magic Gradio Proxy 作为纯粹的数据传输管道，不在本地存储任何文件

文件流处理流程：
1. 上传流程：Backend → base64编码 → Proxy → 临时文件(仅供gradio_client) → HF Space
2. 下载流程：HF Space → 临时文件 → 立即读取+base64编码 → 立即删除 → Backend

详细流程：
- Image to 3D Model: 图片base64 → TRELLIS Space → GLB模型base64 + 预览视频base64
- 3D Model to Skeleton: 模型base64 → MagicArticulate Space → OBJ/TXT/ZIP文件base64

临时文件策略：
- 仅在gradio_client API需要时创建临时文件
- 文件创建后立即调用HF Space API
- 处理完成后立即删除临时文件
- 所有结果文件立即读取转换为base64并删除源文件

与测试脚本的区别：
- 正式流程：Backend发送base64 → Proxy流式处理 → Backend接收base64并保存
- 测试脚本：直接读取本地文件 → 上传测试 → 下载到本地文件
- 两者都使用handle_file()函数确保与HF Space的兼容性
- 正式流程创建临时文件仅供handle_file()使用，立即删除
"""

import base64
import tempfile
from pathlib import Path
from typing import Dict, Any, Optional
import asyncio
from gradio_client import Client, handle_file
import logging

from .config import settings
from .file_logger import file_logger


class MultiSpaceClient:
    """Manages connections to multiple HuggingFace Spaces"""
    
    def __init__(self):
        self.magic_client: Optional[Client] = None
        self.trellis_client: Optional[Client] = None
        self._magic_lock = asyncio.Lock()
        self._trellis_lock = asyncio.Lock()
    
    async def connect_magic(self) -> Client:
        """Connect to MagicArticulate Space"""
        async with self._magic_lock:
            if self.magic_client is None:
                file_logger.info(f"Connecting to MagicArticulate Space: {settings.hf_space}")
                try:
                    self.magic_client = Client(
                        settings.hf_space,
                        hf_token=settings.hf_token if settings.hf_token else None
                    )
                    file_logger.info("Successfully connected to MagicArticulate Space")
                except Exception as e:
                    file_logger.error(f"Failed to connect to MagicArticulate Space: {e}")
                    raise
            return self.magic_client
    
    async def connect_trellis(self) -> Client:
        """Connect to TRELLIS Space"""
        async with self._trellis_lock:
            if self.trellis_client is None:
                file_logger.info(f"Connecting to TRELLIS Space: {settings.trellis_space}")
                try:
                    # Use TRELLIS token if available, otherwise fallback to main HF token
                    token = settings.trellis_hf_token or settings.hf_token
                    self.trellis_client = Client(
                        settings.trellis_space,
                        hf_token=token if token else None
                    )
                    file_logger.info("Successfully connected to TRELLIS Space")
                    
                    # Connection successful - API endpoints available but not logged to reduce output
                    file_logger.info("TRELLIS Space connected and ready for processing")
                        
                except Exception as e:
                    file_logger.error(f"Failed to connect to TRELLIS Space: {e}")
                    raise
            return self.trellis_client
    
    async def process_image_to_3d(
        self, 
        image_content_base64: str, 
        image_name: str,
        seed: int = 0,
        ss_guidance_strength: float = 7.5,
        ss_sampling_steps: int = 12,
        slat_guidance_strength: float = 3.0,
        slat_sampling_steps: int = 12,
        mesh_simplify: float = 0.95,
        texture_size: int = 1024
    ) -> Dict[str, Any]:
        """Process image to generate 3D model using TRELLIS"""
        
        file_logger.info(f"🎨 Starting image to 3D processing for '{image_name}'")
        file_logger.info(f"📋 Parameters: seed={seed}, guidance={ss_guidance_strength}, steps={ss_sampling_steps}")
        
        client = await self.connect_trellis()
        
        # Decode base64 content
        file_logger.info(f"📥 Decoding base64 image content (size: {len(image_content_base64)} characters)")
        image_content = base64.b64decode(image_content_base64)
        file_logger.info(f"📄 Decoded image size: {len(image_content)} bytes")
        
        # Create temporary file for gradio_client (immediate cleanup)
        # Handle cases where image_name might not have an extension or might be a stream
        suffix = Path(image_name).suffix if image_name else '.png'
        if not suffix:
            suffix = '.png'  # Default to PNG for stream images
        
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_file:
            tmp_file.write(image_content)
            tmp_file_path = tmp_file.name
        
        file_logger.info(f"📁 Created temporary file for gradio_client: {tmp_file_path}")
        
        try:
            file_logger.info(f"🚀 Processing image {image_name} through TRELLIS Space")
            
            # Use the correct API call sequence
            # Start session
            file_logger.info("📋 Step 1: Starting TRELLIS session...")
            session_result = client.predict(api_name="/start_session")
            file_logger.info(f"✅ Session started successfully: {session_result}")
            
            # Preprocess image (this may not be strictly necessary but follows the workflow)
            file_logger.info("📋 Step 2: Preprocessing image...")
            try:
                preprocessed = client.predict(
                    image=handle_file(tmp_file_path),  # Use handle_file for compatibility
                    api_name="/preprocess_image"
                )
                file_logger.info(f"✅ Image preprocessed successfully: {preprocessed}")
            except Exception as e:
                file_logger.warning(f"⚠️ Preprocess image failed, continuing without preprocessing: {e}")
            
            # Generate and extract GLB using handle_file for compatibility
            file_logger.info("📋 Step 3: Generating 3D model...")
            file_logger.info(f"🔧 Using parameters: mesh_simplify={mesh_simplify}, texture_size={texture_size}")
            
            result = client.predict(
                image=handle_file(tmp_file_path),  # Use handle_file for compatibility
                multiimages=[],  # Single image mode
                seed=seed,
                ss_guidance_strength=ss_guidance_strength,
                ss_sampling_steps=ss_sampling_steps,
                slat_guidance_strength=slat_guidance_strength,
                slat_sampling_steps=slat_sampling_steps,
                multiimage_algo="stochastic",
                mesh_simplify=mesh_simplify,
                texture_size=texture_size,
                api_name="/generate_and_extract_glb"
            )
            
            file_logger.info(f"✅ TRELLIS processing completed. Result type: {type(result)}")
            
            # Result is a tuple: (video_output, glb_model, download_glb)
            video_path, glb_path, download_path = result
            file_logger.info(f"📁 Generated files: video={video_path}, glb={glb_path}, download={download_path}")
            
            # Read generated files
            output_files = {}
            
            # Read GLB file
            if glb_path and Path(glb_path).exists():
                glb_size = Path(glb_path).stat().st_size
                file_logger.info(f"📦 Reading GLB file: {glb_path} (size: {glb_size} bytes)")
                with open(glb_path, 'rb') as f:
                    output_files['glb'] = base64.b64encode(f.read()).decode('utf-8')
                file_logger.info(f"✅ GLB file encoded to base64 (size: {len(output_files['glb'])} characters)")
            else:
                file_logger.warning(f"⚠️ GLB file not found or empty: {glb_path}")
            
            # Read video preview if available
            if video_path and isinstance(video_path, dict) and 'video' in video_path:
                video_file = video_path['video']
                if Path(video_file).exists():
                    video_size = Path(video_file).stat().st_size
                    file_logger.info(f"🎬 Reading preview video: {video_file} (size: {video_size} bytes)")
                    with open(video_file, 'rb') as f:
                        output_files['preview_video'] = base64.b64encode(f.read()).decode('utf-8')
                    file_logger.info(f"✅ Video file encoded to base64 (size: {len(output_files['preview_video'])} characters)")
                else:
                    file_logger.warning(f"⚠️ Video file not found: {video_file}")
            else:
                file_logger.warning(f"⚠️ Video path invalid or not dict: {video_path}")
            
            file_logger.info(f"🎉 Successfully processed image to 3D model. Files generated: {list(output_files.keys())}")
            
            return {
                'status': 'success',
                'files': output_files,
                'metadata': {
                    'seed': seed,
                    'mesh_simplify': mesh_simplify,
                    'texture_size': texture_size
                }
            }
            
        except Exception as e:
            file_logger.error(f"❌ Error processing image to 3D: {str(e)}")
            file_logger.error(f"🔍 Exception type: {type(e).__name__}")
            return {
                'status': 'error',
                'error': str(e)
            }
        finally:
            # Clean up temporary file immediately
            try:
                Path(tmp_file_path).unlink()
                file_logger.info(f"🧹 Cleaned up temporary file: {tmp_file_path}")
            except Exception as cleanup_error:
                file_logger.warning(f"⚠️ Failed to cleanup temporary file: {cleanup_error}")
    
    async def process_model_to_skeleton(
        self,
        model_content_base64: str,
        model_name: str,
        text_prompt: str,
        seed: int = 42,
        confidence: float = 0.8,
        preview: bool = True
    ) -> Dict[str, Any]:
        """Process 3D model to generate skeleton using MagicArticulate"""
        
        client = await self.connect_magic()
        
        # Decode base64 content
        model_content = base64.b64decode(model_content_base64)
        
        # Create temporary file for gradio_client (immediate cleanup)
        suffix = Path(model_name).suffix
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_file:
            tmp_file.write(model_content)
            tmp_file_path = tmp_file.name
        
        try:
            file_logger.info(f"Processing model {model_name} through MagicArticulate")
            
            # Call the MagicArticulate API
            # Using fn_index=5 to match the working test script
            result = client.predict(
                handle_file(tmp_file_path),  # Use handle_file for compatibility
                text_prompt,                  # prompt parameter 
                confidence,                   # confidence parameter
                preview,                      # preview parameter
                fn_index=5
            )
            
            # Process result based on MagicArticulate /predict API documentation
            # Result is a tuple with 9 elements: [0]status, [1]preview, [2]obj_file, [3]txt_file, [4]zip_file, [5]html, [6]markdown, [7]error1, [8]error2
            output_files = {}
            
            file_logger.info(f"MagicArticulate result type: {type(result)}, length: {len(result) if isinstance(result, (list, tuple)) else 'N/A'}")
            
            if isinstance(result, (list, tuple)) and len(result) >= 9:
                status_text = result[0]
                skeleton_data_json = result[1]
                obj_file_path = result[2]
                txt_file_path = result[3]
                zip_file_path = result[4]
                visualization_html = result[5]
                markdown = result[6]
                error_info = result[7]
                error_info_2 = result[8]
                
                file_logger.info(f"MagicArticulate processing status: {status_text}")
                file_logger.info(f"Files received: obj={obj_file_path}, txt={txt_file_path}, zip={zip_file_path}")
                file_logger.info(f"Error info 1: {error_info}")
                file_logger.info(f"Error info 2: {error_info_2}")
                
                # Check if error_info_2 is just a visibility update (not an actual error)
                is_error_2_real = error_info_2 and not (isinstance(error_info_2, dict) and error_info_2.get('__type__') == 'update')
                
                # Check for errors
                if error_info or is_error_2_real:
                    error_message = error_info or error_info_2
                    file_logger.error(f"MagicArticulate reported error: {error_message}")
                    return {
                        'status': 'error',
                        'error': str(error_message)
                    }
                
                # Read OBJ file
                if obj_file_path and Path(obj_file_path).exists():
                    file_logger.info(f"Reading OBJ file: {obj_file_path}")
                    with open(obj_file_path, 'rb') as f:
                        output_files['obj'] = base64.b64encode(f.read()).decode('utf-8')
                
                # Read TXT file
                if txt_file_path and Path(txt_file_path).exists():
                    file_logger.info(f"Reading TXT file: {txt_file_path}")
                    with open(txt_file_path, 'rb') as f:
                        output_files['txt'] = base64.b64encode(f.read()).decode('utf-8')
                
                # Read ZIP file
                if zip_file_path and Path(zip_file_path).exists():
                    file_logger.info(f"Reading ZIP file: {zip_file_path}")
                    with open(zip_file_path, 'rb') as f:
                        output_files['zip'] = base64.b64encode(f.read()).decode('utf-8')
                
                # Process skeleton data JSON
                if skeleton_data_json and skeleton_data_json.strip():
                    try:
                        # Skeleton data JSON from result[1]
                        output_files['json'] = base64.b64encode(skeleton_data_json.encode('utf-8')).decode('utf-8')
                        file_logger.info(f"Successfully processed skeleton data JSON")
                    except Exception as e:
                        file_logger.warning(f"Could not process skeleton data JSON: {e}")
            
            file_logger.info(f"Successfully processed model to skeleton. Files generated: {list(output_files.keys())}")
            
            return {
                'status': 'success',
                'files': output_files,
                'metadata': {
                    'text_prompt': text_prompt,
                    'seed': seed,
                    'confidence': confidence
                }
            }
            
        except Exception as e:
            file_logger.error(f"Error processing model to skeleton: {e}")
            return {
                'status': 'error',
                'error': str(e)
            }
        finally:
            # Clean up temporary file immediately
            try:
                Path(tmp_file_path).unlink()
                file_logger.info(f"🧹 Cleaned up temporary file: {tmp_file_path}")
            except Exception as cleanup_error:
                file_logger.warning(f"⚠️ Failed to cleanup temporary file: {cleanup_error}")
    
    async def reconnect_all(self):
        """Reconnect to all spaces"""
        self.magic_client = None
        self.trellis_client = None
        file_logger.info("Disconnected from all spaces, will reconnect on next request")
    
    async def health_check(self) -> Dict[str, Any]:
        """Check health status of all space connections"""
        status = {
            'magic_articulate': {
                'connected': self.magic_client is not None,
                'space': settings.hf_space
            },
            'trellis': {
                'connected': self.trellis_client is not None,
                'space': settings.trellis_space
            }
        }
        
        # Try to connect to check actual availability
        try:
            await self.connect_magic()
            status['magic_articulate']['available'] = True
        except:
            status['magic_articulate']['available'] = False
        
        try:
            await self.connect_trellis()
            status['trellis']['available'] = True
        except:
            status['trellis']['available'] = False
        
        return status


# Global client instance
multi_space_client = MultiSpaceClient()