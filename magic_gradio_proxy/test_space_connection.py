#!/usr/bin/env python3
"""
Test script for Magic Gradio Proxy connection to HF Space
Tests with ironman_mesh.obj file
"""

import os
import sys
import json
import base64
import time
from pathlib import Path

# Import external gradio_client directly
from gradio_client import Client
from gradio_client.data_classes import FileData

# Load settings from .env file
from dotenv import load_dotenv
load_dotenv()

# Settings from environment variables
class Settings:
    hf_space = os.getenv("HF_SPACE", "nomad2082/magic-plus-1")
    hf_token = os.getenv("HF_TOKEN")
    service_port = int(os.getenv("SERVICE_PORT", "5719"))

settings = Settings()

def test_space_connection():
    """Test connection to HF Space with ironman_mesh.obj"""
    
    print("🧪 Testing Magic Gradio Proxy Space Connection")
    print(f"📍 HF Space: {settings.hf_space}")
    print(f"🔑 HF Token: {'✅ Set' if settings.hf_token else '❌ Not set'}")
    print("-" * 50)
    
    # Check if test file exists
    test_file = Path("ironman_mesh.obj")
    if not test_file.exists():
        print(f"❌ Test file not found: {test_file}")
        print("Please ensure ironman_mesh.obj is in the project root directory")
        return False
    
    print(f"✅ Test file found: {test_file}")
    
    # Test 1: Connect to HF Space
    print("\n🔗 Test 1: Connecting to HF Space...")
    
    # 先不捕获异常，让错误完全暴露
    client = Client(settings.hf_space, hf_token=settings.hf_token if settings.hf_token else None)
    print("✅ Successfully connected to HF Space")
    
    # Check available endpoints  
    try:
        endpoints = client.endpoints
        print(f"Available endpoints: {list(endpoints.keys())}")
        # Print endpoint details for debugging
        for endpoint_name, endpoint_info in endpoints.items():
            print(f"  {endpoint_name}: {endpoint_info}")
    except Exception as e:
        print(f"⚠️ Cannot get endpoints: {e}")
        return False
    
    # Test 2: Process model directly
    print("\n🤖 Test 2: Processing model through AI...")
    try:
        # Try different file upload methods
        print("Attempting file upload with different methods...")
        
        # Method 1: Direct file path string
        try:
            print("Method 1: Direct file path")
            result = client.predict(
                str(test_file),  # Direct file path
                "Iron Man armor, mechanical joints with articulated limbs",
                0.8,
                True,
                fn_index=5
            )
            print("✅ Method 1 worked!")
        except Exception as e:
            print(f"❌ Method 1 failed: {e}")
            
            # Method 2: FileData wrapper
            try:
                print("Method 2: FileData wrapper")
                result = client.predict(
                    FileData(path=str(test_file)),
                    "Iron Man armor, mechanical joints with articulated limbs", 
                    0.8,
                    True,
                    fn_index=5
                )
                print("✅ Method 2 worked!")
            except Exception as e2:
                print(f"❌ Method 2 failed: {e2}")
                
                # Method 3: Using handle_file if available
                try:
                    print("Method 3: handle_file method")
                    from gradio_client import handle_file
                    result = client.predict(
                        handle_file(str(test_file)),
                        "Iron Man armor, mechanical joints with articulated limbs",
                        0.8,
                        True,
                        fn_index=5
                    )
                    print("✅ Method 3 worked!")
                except Exception as e3:
                    print(f"❌ Method 3 failed: {e3}")
                    raise Exception("All upload methods failed")
        
        print(f"📊 Result type: {type(result)}")
        print(f"📊 Result length: {len(result) if hasattr(result, '__len__') else 'N/A'}")
        
        # Parse result according to Magic Articulate format
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
            
            print(f"\n📋 Status: {status_text}")
            print(f"❌ Error 1: {error_info}")
            print(f"❌ Error 2: {error_info_2}")
            
            # Check if error_info_2 is just a visibility update (not an actual error)
            is_error_2_real = error_info_2 and not (isinstance(error_info_2, dict) and error_info_2.get('__type__') == 'update')
            
            if not error_info and not is_error_2_real:
                print("✅ Processing successful!")
                print(f"📄 Has OBJ file: {'✅' if obj_file and os.path.exists(obj_file) else '❌'}")
                print(f"📄 Has TXT file: {'✅' if txt_file and os.path.exists(txt_file) else '❌'}")
                print(f"📄 Has ZIP file: {'✅' if zip_file and os.path.exists(zip_file) else '❌'}")
                print(f"📊 Has skeleton data: {'✅' if skeleton_data_json else '❌'}")
            else:
                print("❌ Processing failed with errors")
                return False
        else:
            print("⚠️  Unexpected result format")
            print(f"Raw result: {result}")
            return False
        
    except Exception as e:
        print(f"❌ Processing error: {e}")
        return False
    
    print("\n✅ All tests passed! Space connection is working correctly.")
    return True

def test_proxy_health():
    """Test proxy health endpoint"""
    print("\n🏥 Testing Proxy Health...")
    
    import requests
    
    try:
        response = requests.get(f"http://localhost:{settings.service_port}/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Proxy health check passed:")
            print(f"  Status: {health_data.get('status')}")
            print(f"  Connected to space: {health_data.get('connected_to_space')}")
            print(f"  Space name: {health_data.get('space_name')}")
            print(f"  Uptime: {health_data.get('uptime', 0):.2f}s")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Magic Gradio Proxy Test Suite")
    print("=" * 50)
    
    # Skip proxy health check, test space connection directly
    print("⚠️  Skipping proxy health check, testing HF Space directly...")
    
    # Test space connection
    if test_space_connection():
        print("\n🎉 All tests completed successfully!")
        sys.exit(0)
    else:
        print("\n❌ Tests failed. Please check the logs above.")
        sys.exit(1)