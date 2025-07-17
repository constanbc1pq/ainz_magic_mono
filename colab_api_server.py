"""
Google Colab API Server for MagicArticulate
在 Colab 中运行这个脚本来暴露 MagicArticulate 模型
"""

# 安装依赖
# !pip install fastapi uvicorn pyngrok nest-asyncio

import os
import sys
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import nest_asyncio
from pyngrok import ngrok
import shutil
from pathlib import Path
import tempfile
import asyncio

# 允许在 Jupyter 环境中运行 asyncio
nest_asyncio.apply()

# 添加 MagicArticulate 到 Python 路径
sys.path.append('/content/MagicArticulate')  # 根据你的实际路径调整

# 导入 MagicArticulate
from magicarticulate import MagicArticulate

# 创建 FastAPI 应用
app = FastAPI(title="MagicArticulate API Server")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 MagicArticulate
magic_articulate = None

class ProcessRequest(BaseModel):
    model_id: str
    user_prompt: str
    template_id: str
    prompt_weight: float

class ProcessResponse(BaseModel):
    result_path: str
    result_filename: str
    message: str

@app.on_event("startup")
async def startup_event():
    global magic_articulate
    print("Initializing MagicArticulate...")
    try:
        magic_articulate = MagicArticulate()
        print("MagicArticulate initialized successfully!")
    except Exception as e:
        print(f"Failed to initialize MagicArticulate: {e}")

@app.get("/")
async def root():
    return {"message": "MagicArticulate API Server is running"}

@app.post("/upload_and_process")
async def upload_and_process(
    file: UploadFile = File(...),
    model_id: str = "",
    user_prompt: str = "",
    template_id: str = "",
    prompt_weight: float = 0.5
):
    """
    上传模型文件并处理
    """
    if not magic_articulate:
        raise HTTPException(status_code=500, detail="MagicArticulate not initialized")
    
    # 创建临时目录
    temp_dir = tempfile.mkdtemp()
    try:
        # 保存上传的文件
        input_path = os.path.join(temp_dir, file.filename)
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # 准备输出路径
        output_filename = f"{model_id}_articulated.obj"
        output_path = os.path.join(temp_dir, output_filename)
        
        # 处理模型
        print(f"Processing model: {file.filename}")
        print(f"User prompt: {user_prompt}")
        print(f"Template: {template_id}, Weight: {prompt_weight}")
        
        # 调用 MagicArticulate
        # 注意：这里需要根据实际的 MagicArticulate API 调整
        result = magic_articulate.process(
            input_path=input_path,
            output_path=output_path,
            prompt=user_prompt,
            template=template_id,
            weight=prompt_weight
        )
        
        # 将结果文件移动到持久化位置
        results_dir = "/content/results"
        os.makedirs(results_dir, exist_ok=True)
        final_path = os.path.join(results_dir, output_filename)
        shutil.move(output_path, final_path)
        
        return ProcessResponse(
            result_path=final_path,
            result_filename=output_filename,
            message="Model processed successfully"
        )
        
    except Exception as e:
        print(f"Error processing model: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 清理临时文件
        shutil.rmtree(temp_dir, ignore_errors=True)

@app.get("/download/{filename}")
async def download_result(filename: str):
    """
    下载处理结果
    """
    file_path = f"/content/results/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(file_path, filename=filename)

@app.get("/status")
async def get_status():
    """
    获取服务器状态
    """
    return {
        "status": "running",
        "magic_articulate_loaded": magic_articulate is not None,
        "gpu_available": torch.cuda.is_available() if 'torch' in sys.modules else False
    }

# 启动服务器的函数
def start_server():
    # 设置 ngrok
    ngrok_tunnel = ngrok.connect(8000)
    print(f"Public URL: {ngrok_tunnel.public_url}")
    print(f"将这个 URL 配置到你的本地 backend 中: {ngrok_tunnel.public_url}")
    
    # 启动 FastAPI
    uvicorn.run(app, host="0.0.0.0", port=8000)

# 在 Colab 中运行：
# start_server()