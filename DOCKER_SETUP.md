# 🐳 ArticulateHub Docker 配置指南

## 🚀 快速启动

### 1. 启动数据库服务
```bash
# 启动MySQL和Redis
docker compose up -d

# 等待MySQL完全启动（约30秒）
docker compose logs -f mysql
```

### 2. 设置数据库
```bash
# 运行自动化设置脚本
./scripts/setup-database.sh

# 或者手动运行
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 3. 启动Backend服务
```bash
cd backend
npm run start:dev
```

## 🔧 配置详情

### MySQL配置
- **端口**: 3306
- **数据库**: articulate_hub
- **用户**: articulate_user
- **密码**: articulate_pass
- **Root密码**: articulate123

### Redis配置
- **端口**: 6379
- **用途**: 任务队列和缓存

### 自动化功能
- ✅ **用户权限自动配置** - 解决Prisma迁移权限问题
- ✅ **数据库自动创建** - 无需手动创建
- ✅ **健康检查** - 确保服务正常运行
- ✅ **数据持久化** - 使用Docker volumes

## 🛠️ 故障排除

### 权限问题
如果遇到Prisma迁移权限问题：
```bash
# 手动授权（已在init.sql中自动化）
docker exec articulate-mysql mysql -u root -particulate123 -e "GRANT ALL PRIVILEGES ON *.* TO 'articulate_user'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
```

### 清理和重置
```bash
# 完全清理和重新开始
docker compose down -v
docker compose up -d
./scripts/setup-database.sh
```

### 查看日志
```bash
# MySQL日志
docker compose logs mysql

# Redis日志
docker compose logs redis

# 所有服务日志
docker compose logs -f
```

## 🔄 更新和维护

### 更新数据库Schema
```bash
cd backend
npx prisma migrate dev --name "your_migration_name"
```

### 备份数据库
```bash
docker exec articulate-mysql mysqldump -u root -particulate123 articulate_hub > backup.sql
```

### 恢复数据库
```bash
docker exec -i articulate-mysql mysql -u root -particulate123 articulate_hub < backup.sql
```

## 🎯 生产部署注意事项

1. **更改默认密码** - 修改 `.env` 文件中的数据库密码
2. **启用SSL** - 配置MySQL SSL连接
3. **资源限制** - 添加容器资源限制
4. **监控** - 添加健康检查和监控
5. **备份策略** - 设置定期备份