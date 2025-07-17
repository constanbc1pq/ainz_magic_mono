#!/bin/bash

# 测试 Colab API 服务器连接的脚本

echo "🔍 测试 Colab API 服务器连接"
echo "================================"

# 从命令行参数获取 URL，或使用默认值
API_URL=${1:-"http://localhost:8000"}

echo "📡 API URL: $API_URL"
echo ""

# 测试根路径
echo "1️⃣ 测试根路径..."
curl -s "$API_URL/" | jq .
echo ""

# 测试状态端点
echo "2️⃣ 测试状态端点..."
curl -s "$API_URL/status" | jq .
echo ""

# 测试文件上传（使用一个测试文件）
echo "3️⃣ 创建测试文件..."
cat > test_model.obj << EOF
# Simple cube OBJ file
v 0.0 0.0 0.0
v 1.0 0.0 0.0
v 1.0 1.0 0.0
v 0.0 1.0 0.0
v 0.0 0.0 1.0
v 1.0 0.0 1.0
v 1.0 1.0 1.0
v 0.0 1.0 1.0

f 1 2 3 4
f 5 6 7 8
f 1 2 6 5
f 2 3 7 6
f 3 4 8 7
f 4 1 5 8
EOF

echo "4️⃣ 测试文件上传..."
curl -X POST "$API_URL/process" \
  -F "file=@test_model.obj" \
  -F "model_id=test_123" \
  -F "user_prompt=humanoid character" \
  -F "template_id=humanoid_basic" \
  -F "prompt_weight=0.5" \
  | jq .

echo ""
echo "✅ 测试完成！"

# 清理测试文件
rm -f test_model.obj