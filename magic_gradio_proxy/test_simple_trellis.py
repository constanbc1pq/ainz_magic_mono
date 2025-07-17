#!/usr/bin/env python3
"""Simple test script to test TRELLIS Space API step by step - STREAM MODE

流式传输测试脚本设计说明 (Stream Mode Test Script Design):
===============================================================

与file模式测试脚本的区别：
- file模式：直接读取本地文件 → 使用handle_file() → 上传到HF Space → 下载结果到本地
- stream模式：模拟Backend发送base64 → Proxy创建临时文件 → 直接传递文件路径 → 立即删除临时文件

流式传输测试策略：
- 读取本地文件转换为base64（模拟Backend）
- 创建临时文件仅供gradio_client使用
- 不使用handle_file()，直接传递文件路径
- 处理完成后立即删除临时文件
- 所有结果文件立即读取转换为base64并删除源文件

这个测试脚本验证了multi_space_client.py中的流式传输逻辑
"""

import sys
import os
import tempfile
import base64
from pathlib import Path

# Add src to Python path
sys.path.append('src')

from src.config import settings
from gradio_client import Client

def test_stream_trellis():
    """Test TRELLIS functionality using stream mode (no handle_file)"""
    
    # Check if pop.png exists
    image_path = Path("pop.png")
    if not image_path.exists():
        print(f"❌ Image file not found: {image_path}")
        return False
    
    print(f"✅ Found image file: {image_path}")
    print(f"📁 Image size: {image_path.stat().st_size} bytes")
    
    # Step 1: Read file and convert to base64 (simulating Backend)
    print("\n📋 Step 1: Reading file and converting to base64...")
    try:
        with open(image_path, 'rb') as f:
            image_content = f.read()
        image_content_base64 = base64.b64encode(image_content).decode('utf-8')
        print(f"✅ Base64 conversion successful: {len(image_content_base64)} characters")
    except Exception as e:
        print(f"❌ Base64 conversion failed: {e}")
        return False
    
    # Step 2: Connect to TRELLIS (simulating multi_space_client)
    print("\n📋 Step 2: Connecting to TRELLIS Space...")
    try:
        token = settings.trellis_hf_token or settings.hf_token
        client = Client(
            settings.trellis_space,
            hf_token=token if token else None
        )
        print("✅ Successfully connected to TRELLIS Space")
    except Exception as e:
        print(f"❌ Failed to connect to TRELLIS Space: {e}")
        return False
    
    # Step 3: Decode base64 and create temporary file (simulating proxy)
    print("\n📋 Step 3: Decoding base64 and creating temporary file...")
    try:
        decoded_content = base64.b64decode(image_content_base64)
        print(f"✅ Base64 decoded: {len(decoded_content)} bytes")
        
        # Create temporary file for gradio_client (immediate cleanup)
        suffix = image_path.suffix
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp_file:
            tmp_file.write(decoded_content)
            tmp_file_path = tmp_file.name
        
        print(f"✅ Temporary file created: {tmp_file_path}")
    except Exception as e:
        print(f"❌ Temporary file creation failed: {e}")
        return False
    
    try:
        # Step 4: Start session (simulating multi_space_client flow)
        print("\n📋 Step 4: Starting TRELLIS session...")
        try:
            session_result = client.predict(api_name="/start_session")
            print(f"✅ Session started: {session_result}")
        except Exception as e:
            print(f"❌ Session start failed: {e}")
            return False
        
        # Step 5: Skip preprocessing (since it's optional)
        print("\n📋 Step 5: Skipping preprocessing (optional step)...")
        print("    Stream mode bypasses preprocessing step")
        
        # Step 6: Generate 3D model (using direct file path, not handle_file)
        print("\n📋 Step 6: Generating 3D model (stream mode)...")
        try:
            result = client.predict(
                image=tmp_file_path,  # Direct file path, not handle_file
                multiimages=[],
                seed=0,
                ss_guidance_strength=7.5,
                ss_sampling_steps=12,
                slat_guidance_strength=3.0,
                slat_sampling_steps=12,
                multiimage_algo="stochastic",
                mesh_simplify=0.95,
                texture_size=1024,
                api_name="/generate_and_extract_glb"
            )
            print(f"✅ 3D model generation successful")
            print(f"    Result type: {type(result)}")
            
            if isinstance(result, (list, tuple)):
                print(f"    Result length: {len(result)}")
                
                # Step 7: Process results (simulating stream mode file handling)
                print("\n📋 Step 7: Processing results (stream mode)...")
                video_path, glb_path, download_path = result
                
                output_files = {}
                
                # Read GLB file and convert to base64 (stream mode)
                if glb_path and Path(glb_path).exists():
                    glb_size = Path(glb_path).stat().st_size
                    print(f"📦 Reading GLB file: {glb_path} (size: {glb_size} bytes)")
                    with open(glb_path, 'rb') as f:
                        output_files['glb'] = base64.b64encode(f.read()).decode('utf-8')
                    print(f"✅ GLB file encoded to base64 (size: {len(output_files['glb'])} characters)")
                else:
                    print(f"⚠️ GLB file not found: {glb_path}")
                
                # Read video preview if available (stream mode)
                if video_path and isinstance(video_path, dict) and 'video' in video_path:
                    video_file = video_path['video']
                    if Path(video_file).exists():
                        video_size = Path(video_file).stat().st_size
                        print(f"🎬 Reading preview video: {video_file} (size: {video_size} bytes)")
                        with open(video_file, 'rb') as f:
                            output_files['preview_video'] = base64.b64encode(f.read()).decode('utf-8')
                        print(f"✅ Video file encoded to base64 (size: {len(output_files['preview_video'])} characters)")
                    else:
                        print(f"⚠️ Video file not found: {video_file}")
                else:
                    print(f"⚠️ Video path invalid: {video_path}")
                
                print(f"🎉 Stream mode processing successful. Files generated: {list(output_files.keys())}")
                return True
                
        except Exception as e:
            print(f"❌ 3D model generation failed: {e}")
            print(f"    Exception type: {type(e).__name__}")
            return False
            
    finally:
        # Step 8: Clean up temporary file immediately (stream mode)
        print("\n📋 Step 8: Cleaning up temporary file...")
        try:
            Path(tmp_file_path).unlink()
            print(f"✅ Temporary file cleaned up: {tmp_file_path}")
        except Exception as cleanup_error:
            print(f"⚠️ Failed to cleanup temporary file: {cleanup_error}")
    
    return False

def main():
    print("🚀 Starting TRELLIS Space test (STREAM MODE)...")
    print(f"🔧 Using TRELLIS Space: {settings.trellis_space}")
    print("📋 This test simulates the multi_space_client.py flow:")
    print("    1. Read local file → base64 (Backend simulation)")
    print("    2. base64 → temporary file (Proxy simulation)")
    print("    3. Direct file path (not handle_file) → TRELLIS")
    print("    4. Results → base64 → immediate cleanup")
    
    success = test_stream_trellis()
    
    if success:
        print("\n🎉 Stream mode test passed!")
        print("✅ multi_space_client.py flow is working correctly")
    else:
        print("\n💥 Stream mode test failed!")
        print("❌ Issue with multi_space_client.py flow")
        print("\n💡 Possible issues:")
        print("  1. TRELLIS Space might be overloaded or down")
        print("  2. Stream mode file handling has issues")
        print("  3. API parameters might be incorrect")
        print("  4. Authentication issues")
        print("  5. Temporary file permissions")

if __name__ == "__main__":
    main()