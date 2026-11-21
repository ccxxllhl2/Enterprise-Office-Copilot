#!/usr/bin/env bash
# 启动全部服务（nohup 后台运行，不安装依赖、不构建）
# 用法：chmod +x start.sh && ./start.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

mkdir -p logs

# 检查端口是否已被占用（避免重复启动）
port_busy() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -t -i:"$1" >/dev/null 2>&1
    else
        ss -tlnp 2>/dev/null | grep -q ":$1 "
    fi
}

for p in 8080 3000 80; do
    if port_busy "$p"; then
        echo "[错误] 端口 $p 已被占用，请先执行 ./stop.sh 释放端口" >&2
        exit 1
    fi
done

echo "========== 启动服务 =========="

# 从 .env 导出 DEEPSEEK_API_KEY 给 agent-service
if [ -f .env ]; then
    export DEEPSEEK_API_KEY="$(grep '^DEEPSEEK_API=' .env | cut -d= -f2-)"
fi

# 后端 (8080)
nohup .venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8080 \
    --app-dir backend > logs/backend.log 2>&1 &
echo $! > logs/backend.pid
echo "后端已启动 (PID $(cat logs/backend.pid), 端口 8080)"

# Agent 服务 (3000)
nohup npm start --prefix agent-service > logs/agent.log 2>&1 &
echo $! > logs/agent.pid
echo "Agent 服务已启动 (PID $(cat logs/agent.pid), 端口 3000)"

# 前端 (80)
nohup npm run preview --prefix frontend -- --port 80 --host 0.0.0.0 > logs/frontend.log 2>&1 &
echo $! > logs/frontend.pid
echo "前端已启动 (PID $(cat logs/frontend.pid), 端口 80)"

sleep 3
echo ""
echo "========== 启动完成 =========="
echo "前端:    http://<服务器IP>"
echo "后端:    http://<服务器IP>:8080/api/health"
echo "Agent:   http://<服务器IP>:3000/api/health"
echo ""
echo "日志:    tail -f logs/backend.log  logs/agent.log  logs/frontend.log"
echo "停止:    ./stop.sh"
echo "状态:    ./status.sh"
