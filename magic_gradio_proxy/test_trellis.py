#!/usr/bin/env python3
"""Test script to directly test TRELLIS Space API with pop.png"""

import sys
import os
import base64
import asyncio
from pathlib import Path
import tempfile

# Add src to Python path
sys.path.append('src')

# Direct imports from modules
from src.config import settings
from src.file_logger import file_logger
from gradio_client import Client

def test_trellis_image_processing():
    """Test TRELLIS Space image processing with pop.png"""
    
    # Check if pop.png exists
    image_path = Path("pop.png")
    if not image_path.exists():
        print(f"❌ Image file not found: {image_path}")
        return False
    
    print(f"✅ Found image file: {image_path}")
    print(f"📁 Image size: {image_path.stat().st_size} bytes")
    
    # Test TRELLIS connection
    print("\n🔗 Testing TRELLIS Space connection...")
    try:
        # Use TRELLIS token if available, otherwise fallback to main HF token
        token = settings.trellis_hf_token or settings.hf_token
        client = Client(
            settings.trellis_space,
            hf_token=token if token else None
        )
        print("✅ Successfully connected to TRELLIS Space")
        
        # Check API endpoints
        try:
            endpoints = client.view_api()
            print(f"\n📋 Available TRELLIS API endpoints:")
            for ep in endpoints['named_endpoints']:
                print(f"  - {ep['api_name']}: {ep.get('description', 'No description')}")
        except Exception as e:
            print(f"⚠️ Could not retrieve API info: {e}")
            
    except Exception as e:
        print(f"❌ Failed to connect to TRELLIS Space: {e}")
        return False
    
    # Test image processing
    print(f"\n🎨 Testing image processing...")
    try:
        # Create temporary file for the image
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
            with open(image_path, 'rb') as f:
                tmp_file.write(f.read())
            tmp_file_path = tmp_file.name
        
        print(f"📄 Temporary file created: {tmp_file_path}")
        
        # Try different API endpoints
        print("\n🔍 Testing different API endpoints...")
        
        # Test 1: Try direct image_to_3d API
        try:
            print("  Testing /image_to_3d endpoint...")
            result = client.predict(
                image=tmp_file_path,
                seed=42,
                ss_guidance_strength=7.5,
                ss_sampling_steps=12,
                slat_guidance_strength=3.0,
                slat_sampling_steps=12,
                mesh_simplify=0.95,
                texture_size=1024,
                api_name="/image_to_3d"
            )
            print(f"✅ Direct API call successful: {result}")
            return True
        except Exception as e:
            print(f"❌ Direct API call failed: {e}")
        
        # Test 2: Try step-by-step API calls
        try:
            print("  Testing step-by-step API calls...")
            
            # Start session
            session_result = client.predict(api_name="/start_session")
            print(f"    Session started: {session_result}")
            
            # Skip preprocessing and go directly to generation
            print("    Skipping preprocessing, going directly to generation...")
            
            # Generate and extract GLB directly
            result = client.predict(
                image=tmp_file_path,
                multiimages=[],  # Single image mode
                seed=42,
                ss_guidance_strength=7.5,
                ss_sampling_steps=12,
                slat_guidance_strength=3.0,
                slat_sampling_steps=12,
                multiimage_algo="stochastic",
                mesh_simplify=0.95,
                texture_size=1024,
                api_name="/generate_and_extract_glb"
            )
            print(f"✅ Direct generation successful: {result}")
            print(f"    Result type: {type(result)}")
            if isinstance(result, (list, tuple)):
                print(f"    Result length: {len(result)}")
                for i, item in enumerate(result):
                    print(f"    Result[{i}]: {type(item)} - {item}")
            return True
            
        except Exception as e:
            print(f"❌ Direct generation failed: {e}")
            
        # Test 3: Try with preprocessing
        try:
            print("  Testing with preprocessing...")
            
            # Start session again
            session_result = client.predict(api_name="/start_session")
            print(f"    Session started: {session_result}")
            
            # Preprocess image
            preprocessed = client.predict(
                image=tmp_file_path,
                api_name="/preprocess_image"
            )
            print(f"    Image preprocessed: {preprocessed}")
            
            # Generate and extract GLB
            result = client.predict(
                image=tmp_file_path,
                multiimages=[],  # Single image mode
                seed=42,
                ss_guidance_strength=7.5,
                ss_sampling_steps=12,
                slat_guidance_strength=3.0,
                slat_sampling_steps=12,
                multiimage_algo="stochastic",
                mesh_simplify=0.95,
                texture_size=1024,
                api_name="/generate_and_extract_glb"
            )
            print(f"✅ With preprocessing successful: {result}")
            return True
            
        except Exception as e:
            print(f"❌ With preprocessing failed: {e}")
            
    except Exception as e:
        print(f"❌ Error during image processing: {e}")
        return False
    finally:
        # Clean up temporary file
        try:
            if 'tmp_file_path' in locals():
                Path(tmp_file_path).unlink()
        except:
            pass
    
    return False

def main():
    """Main test function"""
    print("🚀 Starting TRELLIS Space test...")
    print(f"🔧 Using TRELLIS Space: {settings.trellis_space}")
    print(f"🔑 Using HF Token: {settings.trellis_hf_token[:10]}..." if settings.trellis_hf_token else "🔑 No TRELLIS token, using main HF token")
    
    success = test_trellis_image_processing()
    
    if success:
        print("\n🎉 All tests passed!")
    else:
        print("\n💥 Tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()