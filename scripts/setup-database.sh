#!/bin/bash

# ArticulateHub数据库设置脚本
# 自动处理数据库迁移和权限问题

echo "🚀 Setting up ArticulateHub database..."

# 等待MySQL完全启动
echo "⏳ Waiting for MySQL to be ready..."
until docker exec articulate-mysql mysqladmin ping -h localhost --silent; do
    echo "   MySQL is not ready yet, waiting..."
    sleep 2
done

echo "✅ MySQL is ready!"

# 运行Prisma迁移
echo "🔄 Running Prisma migrations..."
cd ../backend
npx prisma migrate deploy

# 生成Prisma客户端
echo "🔄 Generating Prisma client..."
npx prisma generate

echo "✅ Database setup completed!"
echo "🎯 You can now start the backend service with: npm run start:dev"