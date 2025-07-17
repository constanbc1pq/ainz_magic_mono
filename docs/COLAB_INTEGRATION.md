# 🚀 ArticulateHub + Google Colab GPU 集成指南

## 概述

本指南帮助你使用 Google Colab 的免费 GPU 来运行 MagicArticulate 模型，而不需要本地 GPU。

## 架构说明

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   前端 (React)  │  HTTP   │  后端 (NestJS)   │  HTTP   │  Colab GPU API   │
│   localhost:3000│ ──────> │  localhost:3001  │ ──────> │  ngrok tunnel    │
└─────────────────┘         └──────────────────┘         └──────────────────┘
                                     ↓                              ↓
                                 本地文件系统                  MagicArticulate
                                                                 (GPU处理)
```

## 快速开始

### 步骤 1: 准备 Colab 环境

1. 打开新的 [Google Colab](https://colab.research.google.com/)
2. 设置 GPU 运行时：
   ```
   运行时 → 更改运行时类型 → 硬件加速器: GPU
   ```

### 步骤 2: 在 Colab 中运行 API 服务器

在 Colab 的代码单元格中运行：

```python
# 安装依赖
!pip install fastapi uvicorn pyngrok nest-asyncio python-multipart torch

# 下载并运行服务器代码
!wget https://raw.githubusercontent.com/your-repo/articulate-hub/main/colab_simple_server.py
!python colab_simple_server.py
```

或者直接复制 `colab_simple_server.py` 的内容到 Colab 并运行。

### 步骤 3: 获取公共 URL

运行后会看到：
```
🚀 MagicArticulate API Server is running!
📡 Public URL: https://xxxx-xxxx-xxxx.ngrok.io
🔧 配置你的本地 backend:
AI_SERVICE_URL=https://xxxx-xxxx-xxxx.ngrok.io
```

### 步骤 4: 配置本地后端

#### 方法 1: 使用环境变量（推荐）

```bash
# 停止现有服务
docker compose -f docker-compose.dev.yml down

# 设置环境变量并启动
export AI_SERVICE_URL="https://xxxx-xxxx-xxxx.ngrok.io"
docker compose -f docker-compose.dev.yml up backend -d
```

#### 方法 2: 修改 docker-compose.dev.yml

```yaml
backend:
  environment:
    - AI_SERVICE_URL=https://xxxx-xxxx-xxxx.ngrok.io
```

### 步骤 5: 测试连接

```bash
# 使用测试脚本
./scripts/test-colab-api.sh https://xxxx-xxxx-xxxx.ngrok.io

# 或手动测试
curl https://xxxx-xxxx-xxxx.ngrok.io/status
```

## 集成 MagicArticulate

### 在 Colab 中添加 MagicArticulate

1. 克隆 MagicArticulate 仓库：
   ```python
   !git clone https://github.com/your-username/MagicArticulate.git
   %cd MagicArticulate
   !pip install -r requirements.txt
   ```

2. 修改 `colab_simple_server.py` 中的处理函数：
   ```python
   # 导入 MagicArticulate
   from magicarticulate import MagicArticulate
   
   # 初始化模型（在服务器启动时）
   model = MagicArticulate(device='cuda')
   
   # 在 process_model 函数中
   output_path = os.path.join(RESULTS_DIR, f"{model_id}_articulated.obj")
   result = model.process(
       input_path=input_path,
       output_path=output_path,
       prompt=user_prompt,
       template=template_id,
       weight=prompt_weight
   )
   ```

## 生产环境建议

### 1. 使用持久化 URL

免费 ngrok URL 每次重启都会改变。考虑：
- 注册 ngrok 账号获取固定子域名
- 使用其他隧道服务（如 localtunnel, cloudflared）
- 部署到云服务器（AWS, GCP, Azure）

### 2. 添加认证

在 `colab_simple_server.py` 中添加 API 密钥验证：

```python
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token != os.environ.get("API_TOKEN", "your-secret-token"):
        raise HTTPException(status_code=401, detail="Invalid token")

# 在每个端点添加依赖
@app.post("/process", dependencies=[Depends(verify_token)])
async def process_model(...):
    ...
```

### 3. 优化文件传输

对于大文件，考虑：
- 使用对象存储（S3, GCS）
- 实现分块上传
- 压缩传输数据

### 4. 监控和日志

添加日志记录：
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 在处理函数中
logger.info(f"Processing model {model_id} with prompt: {user_prompt}")
```

## 常见问题

### Q: Colab 会话断开怎么办？
A: 
- 保持浏览器标签页打开
- 定期与 notebook 交互
- 使用 Colab Pro 获得更长会话时间

### Q: 处理速度慢？
A: 
- 检查是否真的在使用 GPU（运行 `!nvidia-smi`）
- 优化模型大小（减少顶点数）
- 使用批处理模式

### Q: ngrok 连接限制？
A: 
- 免费版限制：40 请求/分钟
- 注册账号可提高限制
- 考虑使用付费计划

### Q: 如何保存处理结果？
A: 
- 挂载 Google Drive
- 使用云存储服务
- 定期下载到本地

## 示例代码

### 完整的 Colab Notebook

```python
# Cell 1: 安装依赖
!pip install fastapi uvicorn pyngrok nest-asyncio python-multipart
!pip install torch torchvision  # 如果需要

# Cell 2: 挂载 Google Drive（可选）
from google.colab import drive
drive.mount('/content/drive')

# Cell 3: 运行 API 服务器
# [复制 colab_simple_server.py 的内容]

# Cell 4: 保持服务器运行
# 服务器会一直运行直到你停止它
```

### 本地测试客户端

```typescript
// 测试 Colab API 连接
async function testColabAPI() {
  const response = await fetch(`${process.env.AI_SERVICE_URL}/status`);
  const data = await response.json();
  console.log('Colab API Status:', data);
}
```

## 下一步

1. **优化模型处理**：实现批处理和缓存
2. **改进错误处理**：添加重试机制
3. **扩展功能**：支持更多文件格式和处理选项
4. **部署到云端**：将 API 服务器部署到持久化环境

---

如有问题，请查看 [GitHub Issues](https://github.com/your-repo/articulate-hub/issues) 或联系维护者。