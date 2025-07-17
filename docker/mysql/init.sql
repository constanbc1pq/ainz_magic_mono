-- ArticulateHub MySQL初始化脚本
-- 自动解决Prisma迁移权限问题

-- 确保articulate_user有足够的权限进行Prisma迁移
-- 包括创建shadow database的权限
GRANT ALL PRIVILEGES ON *.* TO 'articulate_user'@'%' WITH GRANT OPTION;

-- 刷新权限
FLUSH PRIVILEGES;

-- 创建一些有用的调试信息
SELECT 'ArticulateHub MySQL initialized successfully' AS status;
SELECT USER() AS current_user;
SELECT DATABASE() AS current_database;