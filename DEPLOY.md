# 云端部署说明（Docker）

## 架构

```
┌──────────────────────────────────────┐
│  frontend (nginx, 80)                 │
│  ├─ /api/chat    → agent-service:3000 │
│  ├─ /api/agents  → agent-service:3000 │
│  ├─ /api/*       → backend:8080       │
│  └─ 静态资源（React 构建产物）          │
└──────────────────────────────────────┘
        │                    │
   backend (8080)      agent-service (3000)
   FastAPI + SQLite     Pi Agent + DeepSeek
```

## 前置条件

1. Ubuntu 服务器已安装 Docker Engine + Docker Compose
2. 项目上传到服务器（排除 `node_modules/`、`.venv/`、`data/*.db`）

## 部署步骤

```bash
# 1. 进入项目目录
cd Enterprise-Office-Copilot

# 2. 确认 .env 配置正确（关键！）
#    DEEPSEEK_API=sk-xxxx   ← 必须填真实 DeepSeek Token（当前是占位符）
#    RAG_API_KEY=...         ← 阿里百炼 RAG Key
#    RAG_AGENT_ID=...        ← 检索服务 ID
#    OUTLOOK_MAIL_CLIENT_ID=...  ← Outlook 应用 ID

# 3. 构建并启动
docker compose up -d --build

# 4. 查看状态
docker compose ps

# 5. 查看日志
docker compose logs -f
```

## 访问

浏览器打开 `http://<服务器IP>`（默认 80 端口）。

## 数据持久化

- SQLite 数据库挂载到宿主机 `./data/`，容器重建不丢数据。

## 已知限制（需在容器内手动认证）

Outlook 邮件的**拉取**（outlook-mail CLI）和**发送**（Graph API）使用设备码认证，
token 缓存在容器内 `~/.config/outlook-mail/`，首次部署需进入容器重新认证：

```bash
# 邮件拉取认证（outlook-mail CLI）
docker compose exec backend node /app/node_modules/@hazzajenko/outlook-mail-mcp/dist/cli.js auth
# 按提示访问 https://www.microsoft.com/link 输入验证码

# 邮件发送认证（msal）
docker compose exec backend python -m app.outlook_auth
# 按提示访问 https://www.microsoft.com/link 输入验证码
```

> 建议：认证后将容器内 token 缓存目录挂载到宿主机持久化。

## 常用命令

```bash
docker compose down          # 停止
docker compose logs backend  # 查看后端日志
docker compose restart       # 重启全部
```
