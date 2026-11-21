#!/usr/bin/env bash
# 停止所有服务
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

for svc in backend agent frontend; do
    if [ -f "logs/$svc.pid" ]; then
        PID=$(cat "logs/$svc.pid")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
            echo "已停止 $svc (PID $PID)"
        fi
        rm -f "logs/$svc.pid"
    fi
done

# 兜底：按端口清理
for port in 80 3000 8080; do
    PIDS=$(lsof -t -i:$port 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
        kill $PIDS 2>/dev/null || true
        echo "已清理端口 $port"
    fi
done

echo "全部服务已停止"
