# ArticulateHub

AI-powered 3D Model Articulation Platform

## 项目简介
ArticulateHub是一个基于AI的3D模型骨骼生成平台，能够将静态3D模型转换为可动画的骨骼绑定模型。

## 技术栈
- **前端**: React.js + Three.js + TypeScript
- **后端**: NestJS + MySQL + Redis + TypeScript  
- **AI服务**: Python + PyTorch + MagicArticulate
- **部署**: Docker + Docker Compose

## 项目结构
```
articulate-hub/
├── frontend/          # React前端应用
├── backend/           # NestJS后端API
├── ai-service/        # Python AI服务
├── shared/            # 共享类型定义
└── docs/             # 项目文档
```

## 环境准备

### 1. MagicArticulate部署
MagicArticulate是核心的AI模型，需要先准备好：

```bash
# 1. 克隆MagicArticulate到项目父目录
cd ..
git clone https://github.com/your-repo/MagicArticulate.git

# 2. 安装MagicArticulate依赖
cd MagicArticulate
pip install -r requirements.txt

# 3. 下载预训练模型（如果需要）
python download.py

# 确保目录结构如下：
# /your-workspace/
#   ├── articulate-hub/
#   └── MagicArticulate/
```

### 2. 数据库初始化

#### 使用Docker Compose（推荐）
Docker Compose会自动创建数据库，但需要初始化表结构：

```bash
# 1. 启动MySQL服务
docker-compose -f docker-compose.dev.yml up mysql -d

# 2. 等待MySQL完全启动（约30秒）
sleep 30

# 3. 运行Prisma迁移
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate

# 4. （可选）添加种子数据
npx prisma db seed
```

#### 手动数据库设置
如果需要使用现有MySQL数据库：

```bash
# 1. 创建数据库
mysql -u root -p
CREATE DATABASE articulate_hub;
CREATE USER 'articulate_user'@'localhost' IDENTIFIED BY 'articulate_password';
GRANT ALL PRIVILEGES ON articulate_hub.* TO 'articulate_user'@'localhost';
FLUSH PRIVILEGES;

# 2. 配置环境变量
cd backend
cp .env.example .env
# 编辑.env文件，设置DATABASE_URL

# 3. 运行迁移
npm install
npx prisma migrate deploy
npx prisma generate
```

## 快速开始

### 开发环境启动

#### 方式一：Docker Compose一键启动（推荐）
```bash
# 确保MagicArticulate已准备好
# 启动所有服务
docker-compose -f docker-compose.dev.yml up

# 首次启动后，在新终端运行数据库迁移
cd backend
npx prisma migrate dev
```

#### 方式二：分别启动各服务
```bash
# 1. 启动数据库和Redis
docker-compose -f docker-compose.dev.yml up mysql redis -d

# 2. 启动后端服务
cd backend
npm install
npx prisma migrate dev  # 首次运行
npm run start:dev

# 3. 启动AI服务
cd ../ai-service
pip install -r requirements.txt
export MAGICARTICULATE_PATH=../../MagicArticulate
python src/main.py

# 4. 启动前端服务
cd ../frontend
npm install
npm run dev
```

### 生产环境部署
```bash
# 1. 准备环境变量
cp .env.example .env.production
# 编辑.env.production设置生产环境配置

# 2. 构建并启动
docker-compose -f docker-compose.prod.yml up -d

# 3. 运行数据库迁移
docker-compose exec backend npx prisma migrate deploy
```

## 分布式部署与GPU配置

### 架构说明
ArticulateHub采用微服务架构，各服务可以独立部署：
- **前端服务**: 静态网页，可部署在CDN或普通Web服务器
- **后端服务**: API服务，需要连接数据库，可部署在普通服务器
- **AI服务**: 计算密集型服务，建议部署在GPU服务器
- **数据层**: MySQL和Redis，可使用云数据库服务

### GPU配置要求
AI服务对GPU的要求：
- **最低配置**: NVIDIA GPU with 6GB+ VRAM (如 GTX 1060, RTX 2060)
- **推荐配置**: NVIDIA GPU with 12GB+ VRAM (如 RTX 3060, RTX 4070)
- **CUDA版本**: 11.8或更高
- **驱动版本**: 470.0或更高

### 分布式部署方案

#### 方案一：本地无GPU环境
如果本地服务器没有GPU，可以采用以下部署策略：

```bash
# 1. 本地只启动不需要GPU的服务
docker-compose -f docker-compose.dev.yml up mysql redis backend frontend -d

# 2. 修改后端配置，指向远程AI服务
# 编辑 backend/.env 文件
AI_SERVICE_URL=http://gpu-server.example.com:8000

# 3. 在GPU服务器上单独部署AI服务
# 在GPU服务器上执行
docker run -d \
  --name articulate-ai \
  --gpus all \
  -p 8000:8000 \
  -v /path/to/MagicArticulate:/app/magicarticulate \
  articulate-ai-service:latest
```

#### 方案二：混合云部署
将不同服务部署在最适合的环境：

1. **前端部署到CDN**
```bash
# 构建前端
cd frontend
npm run build
# 将build目录内容上传到CDN或静态托管服务
```

2. **后端部署到云服务器**
```bash
# 使用云服务商的容器服务
# 如AWS ECS, Google Cloud Run等
```

3. **AI服务部署到GPU云实例**
```bash
# 使用GPU云服务
# 如AWS EC2 GPU实例, Google Cloud GPU VM等
```

4. **数据库使用托管服务**
```yaml
# 使用云数据库服务
# 如AWS RDS, Google Cloud SQL等
```

#### 方案三：开发环境CPU模式
如果只是开发测试，可以修改AI服务以CPU模式运行：

```bash
# 1. 修改 docker-compose.dev.yml，注释掉GPU配置
# ai-service:
#   deploy:
#     resources:
#       reservations:
#         devices:
#           - driver: nvidia
#             count: 1
#             capabilities: [gpu]

# 2. 修改AI服务代码使用CPU
# 在 ai-service/src/config.py 中设置
DEVICE = "cpu"  # 而不是 "cuda"

# 3. 启动服务（会较慢但可以运行）
docker-compose -f docker-compose.dev.yml up
```

### 服务间通信配置

当服务分布式部署时，需要正确配置服务间通信：

1. **后端环境变量配置**
```bash
# backend/.env
DATABASE_URL=mysql://user:pass@db-server:3306/articulate_hub
REDIS_URL=redis://redis-server:6379
AI_SERVICE_URL=http://ai-server:8000
```

2. **前端环境变量配置**
```bash
# frontend/.env
REACT_APP_API_URL=http://api.yourdomain.com:3001
```

3. **CORS配置**
确保后端允许前端域名的跨域请求：
```typescript
// backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
});
```

### 性能优化建议

1. **AI服务优化**
   - 使用模型量化减少显存占用
   - 实现批处理提高吞吐量
   - 使用缓存避免重复计算

2. **网络优化**
   - 使用CDN加速静态资源
   - 启用HTTP/2和压缩
   - 实现API响应缓存

3. **扩展性考虑**
   - AI服务可水平扩展，使用负载均衡
   - 使用消息队列处理异步任务
   - 实现服务健康检查和自动恢复

## 功能特性
- 🎯 文本引导的智能骨骼生成
- 🎨 实时3D模型预览
- 🎭 动画演示和预设
- 📁 多格式模型支持
- 🚀 高性能处理引擎

## 服务端口说明
- 前端: http://localhost:3000
- 后端API: http://localhost:3001
- AI服务: http://localhost:8000
- MySQL: localhost:3306
- Redis: localhost:6379

## 故障排查

### 常见问题

#### 1. MagicArticulate相关错误
```bash
# 错误：ModuleNotFoundError: No module named 'magicarticulate'
# 解决：确保MagicArticulate路径正确
export MAGICARTICULATE_PATH=/path/to/MagicArticulate
export PYTHONPATH=$MAGICARTICULATE_PATH:$PYTHONPATH

# 错误：CUDA out of memory
# 解决：减小批处理大小或使用CPU模式
```

#### 2. 数据库连接问题
```bash
# 错误：Can't connect to MySQL server
# 解决：确保MySQL服务已启动
docker-compose ps  # 检查服务状态
docker-compose logs mysql  # 查看MySQL日志

# 错误：Prisma migration failed
# 解决：检查数据库权限和连接字符串
npx prisma db push --force-reset  # 强制重置（仅开发环境）
```

#### 3. 权限问题
```bash
# 错误：Permission denied for uploads directory
# 解决：创建必要的目录并设置权限
mkdir -p uploads results logs
chmod 755 uploads results logs
```

## 开发指南

### 数据库模型修改
```bash
# 1. 修改schema.prisma文件
# 2. 生成迁移
npx prisma migrate dev --name describe_your_changes
# 3. 更新客户端
npx prisma generate
```

### API测试
```bash
# 后端API文档
http://localhost:3001/api/docs

# AI服务API文档
http://localhost:8000/docs
```

## 开发路线图
- [x] Phase 1: 核心功能MVP
- [ ] Phase 2: 增强功能
- [ ] Phase 3: 产品化

## 许可证
MIT License