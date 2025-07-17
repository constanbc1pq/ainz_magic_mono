#!/bin/bash

# ArticulateHub开发环境启动脚本

echo "🚀 Starting ArticulateHub Development Environment..."

# 检查Docker是否运行
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# 检查docker-compose是否存在
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

# 创建必要的目录
echo "📁 Creating necessary directories..."
mkdir -p uploads results logs

# 创建MagicArticulate软链接
if [ ! -L "../MagicArticulate" ]; then
    echo "🔗 Creating symbolic link to MagicArticulate..."
    ln -sf ../../MagicArticulate ./MagicArticulate
fi

# 设置环境变量
export COMPOSE_PROJECT_NAME=articulate-hub
export NODE_ENV=development

# 启动服务
echo "🐳 Starting Docker services..."
docker-compose -f docker-compose.dev.yml up --build

echo "✅ Development environment started!"
echo ""
echo "🌐 Services running at:"
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:3001"
echo "  AI Service: http://localhost:8000"
echo ""
echo "📊 Database:"
echo "  MySQL:     localhost:3306"
echo "  Redis:     localhost:6379"