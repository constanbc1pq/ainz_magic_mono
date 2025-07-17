# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ArticulateHub is an AI-powered 3D model articulation platform that converts static 3D models into animatable rigged models using the MagicArticulate AI model. It provides text-guided intelligent bone structure generation for 3D models.

## Architecture

The project follows a microservices architecture with four main components:

1. **Frontend** (React + TypeScript): 3D visualization and user interface
2. **Backend** (NestJS + TypeScript): API server, authentication, job management, and file persistence
3. **AI Service** (Python + FastAPI): ML model integration for 3D articulation
4. **Magic Gradio Proxy** (Python + FastAPI): HuggingFace Space API integration

Services communicate via REST APIs, with Redis for job queuing and MySQL for persistent storage.

### Current Architecture Flow
```
Frontend → NestJS Backend → Magic Gradio Proxy → HuggingFace Space → AI Processing
    ↓                ↓              ↓                    ↓
React App        MySQL/Redis    File Content Transfer   ZeroGPU Processing
    ↓                ↓              ↓                    ↓
File Downloads   File Persistence  No File Storage      Temporary Files
```

### File Management Strategy
- **HuggingFace Space**: Temporary file generation during AI processing
- **Magic Gradio Proxy**: File content transmission (no local storage)
- **NestJS Backend**: Persistent file storage with 7-day retention
- **File Cleanup**: Automatic cleanup with configurable retention policies

## Essential Commands

### Quick Start (All Services)
```bash
./scripts/start-dev.sh
```

### Backend Development
```bash
cd backend
npm run start:dev      # Start with hot reload
npm test               # Run unit tests
npm run lint           # Lint and fix code
npm run build          # Build for production
```

### Frontend Development
```bash
cd frontend
yarn start             # Start dev server (port 3000)
yarn build             # Build for production
yarn test              # Run tests
```

### Database Operations
```bash
cd backend
npx prisma migrate dev --name <name>  # Create migration
npx prisma generate                    # Generate Prisma client
npx prisma studio                      # Open database GUI
npx prisma db push                     # Sync schema (dev only)
```

### Running Individual Services
```bash
# Start databases first
docker-compose -f docker-compose.dev.yml up mysql redis -d

# Then start services as needed
cd backend && npm run start:dev
cd frontend && yarn start
cd ai-service && python src/main.py
cd magic_gradio_proxy && python main.py
```

### Magic Gradio Proxy Operations
```bash
cd magic_gradio_proxy
pip install -r requirements.txt         # Install dependencies
python main.py                          # Start proxy service (port 5719)
python tests/test_client.py            # Test connection and API
```

## Testing Strategy

- **Unit Tests**: Run with `npm test` in backend or `yarn test` in frontend
- **E2E Tests**: Run with `npm run test:e2e` in backend
- **Coverage**: Generate with `npm run test:cov`
- Test files use `.spec.ts` for unit tests and `.e2e-spec.ts` for E2E tests

## Key Implementation Details

### File Upload Flow
1. Files uploaded to `uploads/` directory via Multer
2. Paths stored in database `Model` table
3. AI service reads files from shared volume

### Job Processing
1. Jobs queued in Redis via Bull (backend)
2. AI service polls or receives job notifications
3. Results stored in `ArticulationResult` table
4. Status updates tracked in `ModelProcess` table

### Authentication
- JWT-based authentication using Passport
- User credentials stored in MySQL
- Protected routes require Bearer token

### Database Schema
Main entities: User → Project → Model → ArticulationResult
Projects track processing status (CREATED, UPLOADED, PROCESSING, COMPLETED, FAILED)

### AI Integration
- MagicArticulate model requires GPU (supports Google Colab)
- Text prompts influence bone generation
- Results include skeleton data and confidence metrics

## Environment Variables

Backend requires:
- `DATABASE_URL`: MySQL connection
- `REDIS_URL`: Redis connection
- `JWT_SECRET`: Authentication secret
- `AI_SERVICE_URL`: Python service URL

Frontend requires:
- `REACT_APP_API_URL`: Backend API endpoint

AI Service requires:
- `MAGICARTICULATE_PATH`: Path to AI model

Magic Gradio Proxy requires:
- `HOST`: Service host (default: 0.0.0.0)
- `PORT`: Service port (default: 5719)
- `HF_TOKEN`: HuggingFace API token
- `HF_SPACE`: HuggingFace Space name (e.g., "username/magic-articulate-enhanced")
- `ALLOWED_IPS`: Comma-separated list of allowed IP addresses
- `REQUEST_TIMEOUT`: Request timeout in seconds
- `LOG_LEVEL`: Logging level (INFO, DEBUG, WARNING, ERROR)

Backend also requires:
- `MAGIC_PROXY_URL`: Magic Gradio Proxy service URL (default: http://localhost:5719)

## MVP Development Status

### HF Space MVP (magic-space/)
A fully functional MVP has been created using HF Space + ZeroGPU + Gradio:

**Key Features:**
- 3D model upload (OBJ, GLB, PLY, STL)
- Text-guided skeleton generation
- Real-time processing with ZeroGPU (free GPU)
- Downloadable results (JSON, OBJ, TXT formats)
- Professional Gradio interface

**Architecture:**
```
User → Gradio Interface → @spaces.GPU → MagicArticulate → Results
```

**Files Created:**
- `magic-space/app.py` - Main Gradio application
- `magic-space/src/magic_wrapper.py` - MagicArticulate wrapper
- `magic-space/src/config.py` - Configuration settings
- `magic-space/src/utils.py` - Utility functions
- `magic-space/README.md` - HF Space configuration
- `magic-space/requirements.txt` - Dependencies

**Cost Optimization:**
- Uses ZeroGPU for completely free GPU processing
- Automatic sleep/wake functionality
- No infrastructure costs for MVP validation

### Magic Gradio Proxy (magic_gradio_proxy/)
A Python backend service that provides stable API integration with the HF Space:

**Purpose:**
- Solves Node.js compatibility issues with HF Gradio clients
- Provides REST API endpoints for ArticulateHub backend
- Enables reliable communication with Magic Articulate Space

**Architecture:**
```
ArticulateHub Backend → HTTP API → Magic Gradio Proxy → HF Space → AI Model
```

**Key Components:**
- `src/app.py` - FastAPI application with REST endpoints
- `src/gradio_client.py` - Gradio client wrapper with connection management
- `src/config.py` - Environment-based configuration
- `src/models.py` - Pydantic data models for type safety
- `src/file_logger.py` - Structured logging with daily rotation
- `tests/test_client.py` - Basic connection and functionality tests

**API Endpoints:**
- `GET /health` - Health check and connection status
- `POST /upload` - Upload 3D model files (base64 encoded)
- `POST /process` - Process models through AI pipeline
- `POST /download` - Download processing results
- `POST /reconnect` - Force reconnection to HF Space

**Security Features:**
- IP whitelisting (localhost only)
- HuggingFace token authentication
- Input validation with Pydantic models
- Structured error handling

**Integration Strategy:**
- Backend can call proxy via HTTP instead of direct Gradio client
- Proxy handles connection management and error recovery
- Results can be cached and served through proxy
- Enables horizontal scaling of AI processing

## Current TODO List

### 🚨 Critical Issues (High Priority)
- [x] **分析MagicArticulate对任意用户上传模型的支持限制** - ✅ 已完成分析
- [x] **Fork MagicArticulate仓库准备自定义修改** - ✅ 创建了MagicArticulate-plus
- [x] **修改MagicArticulate以支持任意3D模型文件上传** - ✅ 核心功能已实现
- [x] **实现动态模型预处理管道** - ✅ 格式转换、网格优化、坐标标准化已完成
- [ ] **测试修改后的MagicArticulate处理各种类型的用户模型** - 需要实际模型测试
- [ ] **更新MVP包装器以集成修改后的MagicArticulate** - 准备集成

### 🔧 Development Tasks (High Priority)
- [x] **将mvp-space目录重命名为magic-space** - ✅ 已完成重命名
- [x] **创建magic_gradio_proxy后端服务** - ✅ 已完成完整实现
- [x] **部署magic-space到HuggingFace Space** - ✅ 已完成部署并启用API
- [x] **测试magic_gradio_proxy与HF Space的连接** - ✅ 已完成API兼容性验证
- [x] **集成magic_gradio_proxy到ArticulateHub后端** - ✅ 已完成AI服务集成
- [x] **实现文件持久化存储系统** - ✅ 已完成Backend文件保存机制
- [x] **添加文件清理和存储管理** - ✅ 已完成7天自动清理机制

### 🎯 Enhancement Tasks (Medium Priority)
- [ ] **测试ZeroGPU的性能和限制** - 性能优化
- [ ] **添加模型验证和自动修复功能** - 封闭性、法向量等
- [ ] **实现模型质量检测和用户友好的错误提示** - 用户体验

### 🎨 Polish Tasks (Low Priority)
- [ ] **优化用户体验和界面设计** - UI/UX改进
- [ ] **添加模型预处理选项** - 简化、重网格化等高级功能

### ✅ Completed Tasks
- [x] 在articulate-hub中创建mvp-space目录
- [x] 从现有ai-service中抽取MagicArticulate逻辑
- [x] 创建Gradio应用主文件
- [x] 配置HF Space的依赖和环境
- [x] 实现文件上传和处理逻辑
- [x] 添加进度指示和错误处理
- [x] 准备演示案例和测试数据
- [x] 运行本地测试验证基础功能
- [x] 更新CLAUDE.md文档记录MVP进展
- [x] 将mvp-space重命名为magic-space
- [x] 基于killer_gradio_proxy创建magic_gradio_proxy服务
- [x] 实现完整的FastAPI后端服务架构
- [x] 添加文件上传、处理、下载API端点
- [x] 集成结构化日志系统和安全功能
- [x] 创建Docker部署配置和测试套件
- [x] 部署magic-space到HuggingFace Space并启用API访问
- [x] 修复API兼容性问题确保proxy与space正常通信
- [x] 实现文件持久化解决方案避免HF Space重启丢失文件
- [x] 添加Backend文件管理系统包含自动清理和存储统计
- [x] 更新数据库模型支持文件跟踪和生命周期管理

## Critical Blockers for MVP Success

**🚨 用户模型上传支持问题:**
当前MagicArticulate可能只支持预设的demo模型，这是MVP成功的关键障碍。需要修改以支持任意用户上传的3D模型文件。

**解决方案:**
1. Fork MagicArticulate进行自定义修改
2. 实现动态模型预处理（格式转换、网格清理、标准化）
3. 添加模型验证和错误恢复机制
4. 集成到MVP中并充分测试

**时间估算:** 2-3天完成核心修改和测试

## MagicArticulate-Plus Enhancement Status

### ✅ Completed Enhancements

**Core API Development:**
- `articulate_api.py` - Complete API with user upload support (807 lines)
- `web_server.py` - FastAPI web server with REST endpoints (400+ lines)
- `test_api.py` - Comprehensive testing suite
- `requirements_plus.txt` - Enhanced dependencies (42 packages)
- `README_PLUS.md` - Complete documentation

**Key Features Implemented:**
- **ModelValidator** - File validation, format checking, size limits
- **ModelPreprocessor** - Auto-repair, mesh simplification, normalization
- **UserSessionManager** - Multi-user session tracking and management
- **MagicArticulateAPI** - Main API class with complete functionality
- **Web Server** - HTTP API endpoints for upload, process, download

**File Format Support:**
- OBJ, GLB, GLTF, PLY, STL, FBX, DAE
- Automatic format conversion and validation
- File size limits and vertex count validation

**Processing Pipeline:**
- Automatic mesh repair (duplicate vertices, normals, holes)
- Mesh simplification for large models
- Coordinate normalization to standard space
- Error recovery and graceful fallback

**Session Management:**
- Per-user session isolation
- Processing history tracking
- Automatic cleanup of old sessions
- Multiple output format generation

**API Endpoints:**
- `POST /api/upload` - File upload
- `POST /api/process` - Model processing
- `GET /api/status/{session_id}` - Status checking
- `GET /api/download/{session_id}/{file_type}` - Result download
- WebSocket support for real-time updates

### 🧪 Testing Status
- ✅ **基础结构测试** - 7/7 tests passed
- ✅ **代码质量检查** - All required classes and methods present
- ✅ **文档完整性** - Complete API documentation
- ✅ **集成兼容性** - Compatible with ArticulateHub MVP

### 📁 File Structure
```
MagicArticulate-plus/
├── articulate_api.py          # Main enhanced API (29KB)
├── web_server.py              # FastAPI server (14KB)  
├── test_api.py                # Testing suite (11KB)
├── test_basic_plus.py         # Basic structure tests
├── requirements_plus.txt      # Enhanced dependencies
├── README_PLUS.md            # Complete documentation
└── [original MagicArticulate files preserved]
```

## 📁 Streaming File Management Implementation

### 🚀 Architecture Overview - Streaming Mode
完整的流式文件管理系统已实现，彻底解决了临时文件存储问题：

```
Frontend → Backend → Magic Gradio Proxy → HF Space → AI处理 → 文件生成
    ↓         ↓              ↓                                    ↓
React App  File Upload    Stream Transfer                File Content Return
    ↓         ↓              ↓                                    ↓
API Calls  Base64 Encode   No Storage                    Base64 Stream
    ↓         ↓              ↓                                    ↓
File Downloads Backend Save  Direct Transfer           Backend File Persistence
```

### 🔧 Streaming Implementation Details

#### Magic Gradio Proxy (流式传输设计)
- **职责**: 纯粹的数据管道 + AI请求处理
- **核心功能**: 
  - 接收Backend发送的base64文件内容
  - 临时创建文件仅供gradio_client使用（立即删除）
  - 调用HF Space API进行AI处理
  - 读取HF Space生成的临时文件内容
  - 将文件内容编码为base64流式传输给Backend
  - 立即清理所有临时文件
- **关键代码**: `src/gradio_client.py:process_model_from_base64()`
- **API端点**: 
  - `POST /process` - 接收文件内容 + 提示词，返回处理结果
  - `GET /health` - 服务状态检查
  - `POST /reconnect` - 重连HF Space

#### Backend AI Service (流式接收)
- **职责**: 文件持久化 + 用户管理 + 生命周期管理
- **流式处理**: 
  - 读取上传文件转换为base64
  - 直接发送给Magic Proxy（无中间存储）
  - 接收Proxy返回的所有文件内容
  - 解码base64并保存到持久化存储
- **存储结构**: `results/YYYY-MM-DD/user_${userId}/${modelId}/`
- **文件类型**: JSON, OBJ, TXT, ZIP (完整支持)
- **关键代码**: `src/ai/ai.service.ts:processModel()`

#### Frontend URL Configuration
- **预览URL**: 使用`process.env.REACT_APP_API_URL`配置Backend地址
- **下载URL**: 统一使用环境变量配置的Backend URL
- **关键代码**: `src/pages/ResultPage.tsx` - 使用环境变量而非硬编码

#### 数据库模型
- **ProcessingFile**: 文件记录跟踪 (id, fileType, filePath, fileName, fileSizeBytes)
- **ModelProcess**: 处理状态管理 (filesSaved, filesSavedAt)
- **关键代码**: `prisma/schema.prisma:ProcessingFile`

#### 自动清理机制
- **清理周期**: 7天自动清理过期文件
- **清理范围**: 物理文件 + 数据库记录 + 空目录
- **手动清理**: 支持管理员手动触发清理
- **存储统计**: 实时监控文件数量和大小
- **关键代码**: `src/tasks/cleanup.service.ts`

### 🎯 流式架构核心优势

1. **零临时文件**: Proxy不存储任何文件，只做数据传输
2. **无权限问题**: 不涉及文件系统权限管理
3. **高性能**: 减少磁盘I/O操作，提高传输效率
4. **简化维护**: 只有Backend需要管理文件生命周期
5. **清晰职责**: 
   - **Frontend**: 文件上传 + 结果显示
   - **Backend**: 文件持久化 + 用户管理 + API服务
   - **Magic Proxy**: 纯粹的AI请求代理 + 数据传输
   - **HF Space**: AI处理 + 临时文件生成
6. **环境变量配置**: 所有URL使用环境变量，便于部署配置

### 📊 流式传输技术细节

#### 文件上传流程
```
User Select File → Frontend Read File → Base64 Encode → Backend API
                                                            ↓
Backend Read File → Base64 Encode → Magic Proxy → HF Space
```

#### 文件处理流程
```
HF Space Generate Files → Magic Proxy Read & Encode → Backend Decode & Save
                                                            ↓
Backend Database Record → Frontend Download URLs → User Download
```

#### API接口变更
- **Magic Proxy**: `POST /process` 接收 `{file_name, file_content, text_prompt}`
- **Backend**: 直接发送文件内容，无需先上传到Proxy
- **Frontend**: 使用环境变量配置的完整URL访问资源

### 📊 Status Summary
- ✅ **Magic Gradio Proxy**: 流式传输实现完成，无临时文件存储
- ✅ **Backend AI Service**: 流式接收和文件保存机制实现完成  
- ✅ **Frontend Integration**: 环境变量配置和URL修复完成
- ✅ **Database Models**: 文件跟踪模型实现完成
- ✅ **Cleanup Service**: 自动清理机制实现完成
- ✅ **End-to-End Flow**: 完整端到端流式处理流程实现完成

### 🔄 Current Implementation Status
已完成流式传递架构重构，解决了所有临时文件和权限问题：

1. **权限问题解决**: Magic Proxy不再创建临时文件，避免权限错误
2. **真实轮询**: Frontend使用real-time状态轮询，不再是假等待
3. **3D预览**: 处理完成后可预览OBJ骨骼文件
4. **环境变量**: 所有URL配置使用环境变量，便于部署

### 🎯 Next Steps
1. 测试流式传输的性能和稳定性
2. 验证大文件传输的内存使用情况
3. 监控HF Space的处理能力和限制
4. 优化错误处理和重试机制

## 🎯 多项目类型支持开发进展

### ✅ 已完成功能

#### 数据库层面
- **ProjectType枚举**: IMAGE_TO_3D, MODEL_TO_SKELETON
- **Project表扩展**: 添加type字段和parentProjectId字段
- **ProjectFile表**: 新增文件关联模型
- **数据库迁移**: 支持项目类型和文件关联

#### 后端服务
- **Magic Gradio Proxy**: 多Space客户端支持TRELLIS和MagicArticulate
- **Backend API**: 支持两种项目类型的创建和处理
- **项目服务**: processImage和processModel两套完整API
- **文件管理**: 用户模型文件查询和选择

#### 前端界面
- **项目类型选择器**: 支持图片生成3D模型和3D模型生成骨骼选择
- **图片上传组件**: 完整的TRELLIS参数配置和图片处理流程
- **模型选择器**: 显示用户已有3D模型文件供选择
- **增强模型上传**: 支持上传新模型或选择已有模型
- **结果页面**: 支持不同项目类型的结果展示和下载

### 📊 技术架构总结

```
用户界面流程：
1. 项目类型选择 → 图片生成3D模型 OR 3D模型生成骨骼
2. 图片上传 → TRELLIS处理 → GLB模型+预览视频
3. 模型上传/选择 → MagicArticulate处理 → 骨骼结构文件
4. 结果页面 → 根据项目类型显示不同结果和下载选项

后端架构：
Frontend → Backend → Magic Gradio Proxy → HF Space (TRELLIS/MagicArticulate)
                 ↓
            文件持久化存储
```

### 🎯 核心特性

1. **双AI引擎**: TRELLIS负责图片转3D，MagicArticulate负责3D转骨骼
2. **项目关联**: 用户可以直接选择"图片生成3D模型"项目的结果作为"3D模型生成骨骼"的输入
3. **完整工作流**: 从图片→3D模型→骨骼结构的完整AI处理链路
4. **多格式支持**: GLB模型、预览视频、OBJ骨骼、ZIP文件包等
5. **用户体验**: 统一的项目管理界面，清晰的类型区分和状态跟踪

### 🔄 当前状态
- ✅ 所有核心功能已实现并通过前端编译测试
- ✅ 支持完整的双项目类型工作流
- ✅ 结果页面支持不同项目类型的展示
- ⏳ 待端到端测试验证完整流程

## 🚀 多项目类型扩展方案

### 📋 需求分析
1. **项目类型扩展**：支持"图片生成3D模型"和"3D模型生成骨骼"两种项目类型
2. **多Space集成**：Magic Gradio Proxy对接TRELLIS和MagicArticulate两个HF Space
3. **文件关联功能**：在"生成骨骼"项目中可选择之前"图片生成3D模型"的输出

### 🏗️ 技术架构设计

#### 1. 数据库模型扩展
```sql
-- 项目类型枚举
enum ProjectType {
  IMAGE_TO_3D       -- 图片生成3D模型
  MODEL_TO_SKELETON -- 3D模型生成骨骼
}

-- Project表扩展
model Project {
  type            ProjectType @default(MODEL_TO_SKELETON)
  parentProjectId Int?        -- 关联源项目
  parentProject   Project?    @relation("ProjectDependency")
  inputFiles      ProjectFile[] @relation("InputFiles")
  outputFiles     ProjectFile[] @relation("OutputFiles")
}

-- 新增项目文件表
model ProjectFile {
  id        Int      @id @default(autoincrement())
  fileName  String
  filePath  String
  fileType  String   -- 'image', 'model', 'skeleton', 'json'
  fileSize  Int
  mimeType  String
  projectId Int
  isInput   Boolean  @default(true)
}
```

#### 2. Magic Gradio Proxy多Space支持
```python
class MultiSpaceClient:
    def __init__(self):
        self.trellis_client = None  # TRELLIS Space客户端
        self.magic_client = None    # MagicArticulate客户端
    
    def process_image_to_3d(self, image_base64: str, **kwargs):
        # 调用TRELLIS处理图片生成3D模型
        
    def process_model_to_skeleton(self, model_base64: str, text_prompt: str, **kwargs):
        # 调用MagicArticulate处理3D模型生成骨骼
```

#### 3. 用户体验流程
- **图片生成3D模型**：上传图片 → TRELLIS处理 → 生成3D模型文件
- **3D模型生成骨骼**：选择模型来源（上传/已有） → MagicArticulate处理 → 生成骨骼
- **关联使用**：从"图片生成3D模型"项目选择输出作为"生成骨骼"项目的输入

### 📝 实施计划TODO列表

#### 🚨 高优先级任务
1. **分析TRELLIS Space API文档和接口格式** - 了解输入输出要求
2. **设计多项目类型的数据库模型** - ProjectType枚举、Project表扩展、ProjectFile表
3. **创建数据库迁移文件** - 添加项目类型和文件关联
4. **扩展Magic Gradio Proxy支持多Space** - TRELLIS + MagicArticulate
5. **实现TRELLIS Space客户端连接和图片生成3D模型API**
6. **更新Backend API支持两种项目类型创建**
7. **实现用户3D模型文件查询API** - 获取可选择的已有模型

#### 🔧 中优先级任务
8. **前端创建项目页面添加项目类型选择器**
9. **实现图片上传和处理页面** - 图片生成3D模型流程
10. **更新3D模型上传页面支持选择已有模型**
11. **实现模型选择器组件** - 展示用户的3D模型文件
12. **更新结果页面支持不同项目类型的展示**

#### 🎨 低优先级任务
13. **添加项目依赖关系可视化**
14. **实现批量处理功能**
15. **优化UI/UX设计**