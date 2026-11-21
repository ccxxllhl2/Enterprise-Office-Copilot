# 后端：FastAPI + SQLite + 邮件拉取(需 node + outlook-mail CLI)
FROM python:3.14-slim

WORKDIR /app

# 安装 Node.js 22（用于 outlook-mail CLI 拉取邮件）
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# 安装 Python 依赖
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 安装 outlook-mail-mcp（用于邮件拉取）
COPY package.json ./
RUN npm install --omit=dev

# 复制后端代码
COPY backend/ ./backend/
WORKDIR /app/backend

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
