# 使用 Google Colab GPU 运行 MagicArticulate

本指南将帮助你在 Google Colab 上设置 MagicArticulate API 服务器，并从本地 ArticulateHub 后端连接到它。

## 优势

- **免费使用 GPU**：Google Colab 提供免费的 GPU（包括 T4，有时甚至是 A100）
- **无需本地 GPU**：适合没有高性能 GPU 的开发者
- **快速部署**：几分钟内即可启动服务

## 设置步骤

### 1. 在 Google Colab 中运行 API 服务器

1. 打开 [Google Colab](https://colab.research.google.com/)
2. 上传 `MagicArticulate_Colab_Server.ipynb` 文件或创建新的 notebook
3. 确保选择 GPU 运行时：
   - 点击菜单：运行时 → 更改运行时类型
   - 硬件加速器选择：GPU
   - GPU 类型：T4（免费）或 A100（需要 Colab Pro）

4. 运行 notebook 中的所有单元格

### 2. 获取公共 URL

运行最后一个单元格后，你会看到类似这样的输出：

```
==================================================
🚀 API Server is running!
Public URL: https://xxxx-xx-xxx-xxx-xxx.ngrok.io
请将这个 URL 配置到你的本地 backend 的环境变量中:
AI_SERVICE_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok.io
==================================================
```

### 3. 配置本地后端

在本地的 ArticulateHub 项目中：

#### 方法一：使用环境变量（推荐）

```bash
# 在 docker-compose.dev.yml 中已经配置了 AI_SERVICE_URL
# 直接修改 backend 服务的环境变量
docker-compose -f docker-compose.dev.yml down
export COLAB_URL="https://xxxx-xx-xxx-xxx-xxx.ngrok.io"
docker-compose -f docker-compose.dev.yml up backend -d
```

#### 方法二：修改 .env 文件

创建或编辑 `backend/.env` 文件：

```env
AI_SERVICE_URL=https://xxxx-xx-xxx-xxx-xxx.ngrok.io
```

### 4. 测试连接

```bash
# 测试 API 是否可访问
curl https://xxxx-xx-xxx-xxx-xxx.ngrok.io/status
```

应该返回：
```json
{
  "status": "running",
  "gpu_available": true,
  "gpu_name": "Tesla T4"
}
```

## 注意事项

1. **会话时长**：
   - 免费 Colab 会话最长 12 小时
   - 闲置 90 分钟后会断开连接
   - 建议在处理任务时保持 Colab 页面打开

2. **Ngrok 限制**：
   - 免费 ngrok 有连接数和带宽限制
   - 如需更稳定的连接，考虑注册 ngrok 账号获取 authtoken

3. **文件大小**：
   - 上传大文件时可能需要更长时间
   - 建议优化 3D 模型文件大小

4. **安全性**：
   - ngrok URL 是公开的，任何人都可以访问
   - 生产环境建议添加认证机制

## 故障排除

### 问题：连接超时
- 检查 Colab 会话是否仍在运行
- 确认 ngrok URL 是否正确
- 尝试重启 Colab 中的服务器

### 问题：GPU 不可用
- 确认已选择 GPU 运行时
- 检查 GPU 配额是否用完
- 尝试在不同时间使用（避开高峰期）

### 问题：处理失败
- 查看 Colab 控制台的错误日志
- 确认 MagicArticulate 已正确安装
- 检查模型文件格式是否支持

## 集成 MagicArticulate

在 Colab notebook 中，你需要：

1. 克隆 MagicArticulate 仓库
2. 安装所需依赖
3. 修改 API 服务器代码以调用实际的 MagicArticulate 方法

示例代码：

```python
# 在处理函数中调用 MagicArticulate
from magicarticulate import MagicArticulate

# 初始化模型
magic = MagicArticulate(device='cuda')

# 处理3D模型
result = magic.articulate(
    mesh_path=input_path,
    output_path=output_path,
    prompt=user_prompt,
    template=template_id,
    weight=prompt_weight
)
```

## 性能优化建议

1. **批处理**：如果有多个模型，考虑批量处理
2. **缓存**：缓存处理结果，避免重复计算
3. **模型优化**：预处理3D模型，减少顶点数
4. **使用 Colab Pro**：获得更好的 GPU 和更长的会话时间