#!/usr/bin/env bash
# Ubuntu 直接部署脚本（无需 Docker，全部使用国内软件源）
# 用法：chmod +x deploy.sh && sudo ./deploy.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "========== [1/6] 检测 Python 与 Node =========="

# Python >= 3.10
if ! command -v python3 >/dev/null 2>&1; then
    echo "未检测到 python3，请先安装: sudo apt install -y python3 python3-venv python3-pip"
    exit 1
fi
PY_VER=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Python 版本: $PY_VER"

# Node >= 22.19（Pi Agent 要求）
NEED_NODE=0
if ! command -v node >/dev/null 2>&1; then
    NEED_NODE=1
else
    NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
    if [ "$NODE_MAJOR" -lt 22 ]; then NEED_NODE=1; fi
fi

if [ "$NEED_NODE" = "1" ]; then
    echo "安装 Node.js 22（npmmirror 国内源）..."
    NODE_VERSION=v22.14.0
    NODE_DIST="https://registry.npmmirror.com/-/binary/node/$NODE_VERSION/node-$NODE_VERSION-linux-x64.tar.xz"
    curl -fsSL "$NODE_DIST" -o /tmp/node.tar.xz
    tar -xJf /tmp/node.tar.xz -C /usr/local --strip-components=1
    rm -f /tmp/node.tar.xz
fi
echo "Node 版本: $(node -v)"

echo "========== [2/6] 创建 Python 虚拟环境 =========="
if [ ! -d .venv ]; then
    python3 -m venv .venv
fi
# 用清华源安装后端依赖
.venv/bin/pip install -r backend/requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple

echo "========== [3/6] 安装前端依赖（npmmirror）=========="
npm config set registry https://registry.npmmirror.com
(cd frontend && npm install)
npm config set registry https://registry.npmmirror.com
(cd agent-service && npm install)

echo "========== [4/6] 构建前端 =========="
(cd frontend && npm run build)

echo "========== [5/6] 配置环境变量 =========="
if [ ! -f .env ]; then
    echo "警告: 未找到 .env，请先创建并填入 DEEPSEEK_API 等配置"
else
    # 导出 DEEPSEEK_API_KEY 给 agent-service
    export DEEPSEEK_API_KEY="$(grep '^DEEPSEEK_API=' .env | cut -d= -f2-)"
fi

echo "========== [6/6] 启动服务 =========="
mkdir -p logs

# 后端 (8080)
nohup .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8080 \
    --app-dir backend > logs/backend.log 2>&1 &
echo $! > logs/backend.pid

# Agent 服务 (3000)
nohup npm start --prefix agent-service > logs/agent.log 2>&1 &
echo $! > logs/agent.pid

# 前端 (80)
nohup npm run preview --prefix frontend -- --port 80 --host 0.0.0.0 > logs/frontend.log 2>&1 &
echo $! > logs/frontend.pid

sleep 3
echo ""
echo "========== 部署完成 =========="
echo "前端:    http://<服务器IP>"
echo "后端:    http://<服务器IP>:8080/api/health"
echo "Agent:   http://<服务器IP>:3000/api/health"
echo ""
echo "日志:    logs/backend.log  logs/agent.log  logs/frontend.log"
echo "停止:    ./stop.sh"
