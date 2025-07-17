"""
简化版 Colab API 服务器
直接复制粘贴到 Colab 单元格中运行
"""

# !pip install fastapi uvicorn pyngrok nest-asyncio python-multipart

import os
import shutil
import tempfile
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uvicorn
import nest_asyncio
from pyngrok import ngrok

# 允许在 Jupyter 环境中运行 asyncio
nest_asyncio.apply()

# 创建 FastAPI 应用
app = FastAPI(title="MagicArticulate Colab API")

# 配置 CORS - 允许所有来源
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 创建结果目录
UPLOAD_DIR = "/content/uploads"
RESULTS_DIR = "/content/results"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

@app.get("/")
async def root():
    return {
        "message": "MagicArticulate API Server is running!",
        "endpoints": {
            "process": "POST /process",
            "download": "GET /download/{filename}",
            "status": "GET /status"
        }
    }

@app.post("/process")
async def process_model(
    file: UploadFile = File(...),
    model_id: str = Form(...),
    user_prompt: str = Form(...),
    template_id: str = Form(...),
    prompt_weight: float = Form(...)
):
    """
    处理上传的3D模型
    """
    try:
        # 保存上传的文件
        input_filename = f"{model_id}_{file.filename}"
        input_path = os.path.join(UPLOAD_DIR, input_filename)
        
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"File saved: {input_path}")
        print(f"Processing with prompt: {user_prompt}")
        print(f"Template: {template_id}, Weight: {prompt_weight}")
        
        # TODO: 在这里调用 MagicArticulate
        # 示例代码：
        # from magicarticulate import process_model
        # output_path = os.path.join(RESULTS_DIR, f"{model_id}_articulated.obj")
        # process_model(input_path, output_path, user_prompt, template_id, prompt_weight)
        
        # 临时：直接复制文件作为结果（实际使用时替换为 MagicArticulate 处理）
        output_filename = f"{model_id}_articulated.obj"
        output_path = os.path.join(RESULTS_DIR, output_filename)
        shutil.copy(input_path, output_path)
        
        return {
            "result_path": output_path,
            "result_filename": output_filename,
            "message": "Model processed successfully"
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_result(filename: str):
    """
    下载处理结果
    """
    file_path = os.path.join(RESULTS_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

@app.get("/status")
async def get_status():
    """
    获取服务器状态
    """
    import torch
    return {
        "status": "running",
        "gpu_available": torch.cuda.is_available(),
        "gpu_name": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        "upload_dir": UPLOAD_DIR,
        "results_dir": RESULTS_DIR
    }

# 启动服务器
if __name__ == "__main__":
    # 设置 ngrok
    public_url = ngrok.connect(8000)
    print("\n" + "="*60)
    print("🚀 MagicArticulate API Server is running!")
    print(f"📡 Public URL: {public_url}")
    print("\n🔧 配置你的本地 backend:")
    print(f"AI_SERVICE_URL={public_url}")
    print("="*60 + "\n")
    
    # 运行服务器
    uvicorn.run(app, host="0.0.0.0", port=8000)