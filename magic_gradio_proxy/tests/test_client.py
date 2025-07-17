"""Basic test for Magic Gradio Proxy connection"""

import requests
import json
import base64
from pathlib import Path


def test_health():
    """Test health endpoint"""
    response = requests.get("http://localhost:5719/health")
    print(f"Health check status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_upload_and_process():
    """Test file upload and processing"""
    # Create a simple test OBJ file
    test_obj_content = """# Simple cube
v -0.5 -0.5 -0.5
v -0.5 -0.5 0.5
v -0.5 0.5 -0.5
v -0.5 0.5 0.5
v 0.5 -0.5 -0.5
v 0.5 -0.5 0.5
v 0.5 0.5 -0.5
v 0.5 0.5 0.5

f 1 2 4 3
f 5 6 8 7
f 1 5 7 3
f 2 6 8 4
f 1 2 6 5
f 3 4 8 7
"""
    
    # Encode to base64
    file_content_base64 = base64.b64encode(test_obj_content.encode()).decode()
    
    # Test upload
    upload_data = {
        "file_name": "test_cube.obj",
        "file_content": file_content_base64,
        "file_type": "obj"
    }
    
    print("\n1. Testing file upload...")
    response = requests.post("http://localhost:5719/upload", json=upload_data)
    print(f"Upload status: {response.status_code}")
    upload_result = response.json()
    print(f"Upload response: {json.dumps(upload_result, indent=2)}")
    
    if not upload_result.get("success"):
        print("Upload failed!")
        return False
    
    # Test processing
    file_path = upload_result.get("file_path")
    process_data = {
        "model_file_path": file_path,
        "text_prompt": "humanoid skeleton for animation",
        "seed": 42
    }
    
    print("\n2. Testing model processing...")
    response = requests.post("http://localhost:5719/process", json=process_data)
    print(f"Process status: {response.status_code}")
    process_result = response.json()
    print(f"Process response: {json.dumps(process_result, indent=2)}")
    
    return process_result.get("success", False)


def main():
    """Run all tests"""
    print("Testing Magic Gradio Proxy...")
    print("=" * 50)
    
    # Test health check
    if test_health():
        print("\n✅ Health check passed")
    else:
        print("\n❌ Health check failed")
        return
    
    # Test upload and process
    if test_upload_and_process():
        print("\n✅ Upload and process test passed")
    else:
        print("\n❌ Upload and process test failed")
    
    print("\n" + "=" * 50)
    print("Testing complete!")


if __name__ == "__main__":
    main()