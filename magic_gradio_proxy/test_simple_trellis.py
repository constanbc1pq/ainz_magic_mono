#!/usr/bin/env python3
"""Simple test script to test TRELLIS Space API step by step"""

import sys
import os
import tempfile
from pathlib import Path

# Add src to Python path
sys.path.append('src')

from src.config import settings
from gradio_client import Client, handle_file

def test_basic_trellis():
    """Test basic TRELLIS functionality step by step"""
    
    # Check if pop.png exists
    image_path = Path("pop.png")
    if not image_path.exists():
        print(f"❌ Image file not found: {image_path}")
        return False
    
    print(f"✅ Found image file: {image_path}")
    print(f"📁 Image size: {image_path.stat().st_size} bytes")
    
    # Connect to TRELLIS
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
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp_file:
        with open(image_path, 'rb') as f:
            tmp_file.write(f.read())
        tmp_file_path = tmp_file.name
    
    try:
        # Test 1: Just start session
        print("\n🔍 Test 1: Starting session...")
        try:
            session_result = client.predict(api_name="/start_session")
            print(f"✅ Session started: {session_result}")
        except Exception as e:
            print(f"❌ Session start failed: {e}")
            return False
        
        # Test 2: Try preprocess image with handle_file
        print("\n🔍 Test 2: Preprocessing image with handle_file...")
        try:
            preprocessed = client.predict(
                image=handle_file(tmp_file_path),
                api_name="/preprocess_image"
            )
            print(f"✅ Image preprocessed: {preprocessed}")
        except Exception as e:
            print(f"❌ Image preprocessing failed: {e}")
            print("    This might be expected, continuing...")
        
        # Test 3: Try get_seed
        print("\n🔍 Test 3: Getting seed...")
        try:
            seed_result = client.predict(
                randomize_seed=False,
                seed=42,
                api_name="/get_seed"
            )
            print(f"✅ Seed generated: {seed_result}")
        except Exception as e:
            print(f"❌ Seed generation failed: {e}")
        
        # Test 4: Try with handle_file (CORRECT API USAGE)
        print("\n🔍 Test 4: Direct generation with handle_file...")
        try:
            result = client.predict(
                image=handle_file(tmp_file_path),
                multiimages=[],
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
            
        # Test 5: Try with minimal parameters using handle_file
        print("\n🔍 Test 5: Minimal parameters with handle_file...")
        try:
            # Start fresh session
            client.predict(api_name="/start_session")
            
            # Try with minimal parameters but correct handle_file
            result = client.predict(
                image=handle_file(tmp_file_path),
                api_name="/generate_and_extract_glb"
            )
            print(f"✅ Minimal parameters successful: {result}")
            return True
        except Exception as e:
            print(f"❌ Minimal parameters failed: {e}")
            
        # Test 6: Try with different seed approach
        print("\n🔍 Test 6: Using get_seed first...")
        try:
            # Get seed properly
            seed_result = client.predict(
                randomize_seed=True,
                seed=0,
                api_name="/get_seed"
            )
            print(f"    Got seed: {seed_result}")
            
            # Use the generated seed
            result = client.predict(
                image=tmp_file_path,
                multiimages=[],
                seed=seed_result,
                ss_guidance_strength=7.5,
                ss_sampling_steps=12,
                slat_guidance_strength=3.0,
                slat_sampling_steps=12,
                multiimage_algo="stochastic",
                mesh_simplify=0.95,
                texture_size=1024,
                api_name="/generate_and_extract_glb"
            )
            print(f"✅ With proper seed successful: {result}")
            return True
        except Exception as e:
            print(f"❌ With proper seed failed: {e}")
            
        # Test 7: Try calling lambda functions first
        print("\n🔍 Test 7: Calling lambda functions first...")
        try:
            # Try calling lambda functions
            client.predict(api_name="/lambda")
            client.predict(api_name="/lambda_1")
            
            # Then try generation
            result = client.predict(
                image=tmp_file_path,
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
            print(f"✅ Lambda approach successful: {result}")
            return True
        except Exception as e:
            print(f"❌ Lambda approach failed: {e}")
            
    finally:
        # Clean up
        try:
            Path(tmp_file_path).unlink()
        except:
            pass
    
    return False

def main():
    print("🚀 Starting simple TRELLIS Space test...")
    print(f"🔧 Using TRELLIS Space: {settings.trellis_space}")
    
    success = test_basic_trellis()
    
    if success:
        print("\n🎉 Test passed!")
    else:
        print("\n💥 Test failed!")
        print("\n💡 Possible issues:")
        print("  1. TRELLIS Space might be overloaded or down")
        print("  2. Image format/size might be incompatible")
        print("  3. API parameters might be incorrect")
        print("  4. Authentication issues")

if __name__ == "__main__":
    main()