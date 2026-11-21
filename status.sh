#!/usr/bin/env bash
# 查看服务运行状态
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "========== 服务状态 =========="

for svc in backend agent frontend; do
    if [ -f "logs/$svc.pid" ]; then
        PID=$(cat "logs/$svc.pid")
        if kill -0 "$PID" 2>/dev/null; then
            echo "$svc  运行中 (PID $PID)"
        else
            echo "$svc  已停止 (PID 文件存在但进程不存在)"
        fi
    else
        echo "$svc  未启动"
    fi
done

echo ""
echo "========== 端口监听 =========="
if command -v ss >/dev/null 2>&1; then
    ss -tlnp | grep -E ':(80|3000|8080) ' || echo "无监听端口"
else
    netstat -tlnp | grep -E ':(80|3000|8080) ' || echo "无监听端口"
fi

echo ""
echo "========== 健康检查 =========="
check_url() {
    if command -v curl >/dev/null 2>&1; then
        code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$1" 2>/dev/null || echo "000")
        echo "$2 -> HTTP $code"
    else
        echo "$2 -> (未安装 curl)"
    fi
}
check_url "http://localhost:8080/api/health" "后端 8080"
check_url "http://localhost:3000/api/health" "Agent 3000"
check_url "http://localhost:80" "前端 80"
