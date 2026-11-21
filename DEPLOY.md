# 云端部署说明

推荐方式：**直接部署**（无需 Docker，全部国内源，最快）。备选：Docker。

---

## 方式一：直接部署（推荐，国内源）

### 前置条件

- Ubuntu 服务器（**Python ≥ 3.11 必需**，脚本会自动检测/安装）
- 可访问外网（脚本自动从国内源下载依赖）

> **Python 版本要求**：后端依赖 fastapi 0.165 要求 Python ≥ 3.11。
> Ubuntu 20.04（默认 3.8）/ 22.04（默认 3.10）不满足，脚本会通过 deadsnakes PPA 自动安装 Python 3.12。
> 若 PPA 访问慢，可手动用 miniconda（清华镜像）安装 Python 3.12：
> ```bash
> curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/Miniconda3-latest-Linux-x86_64.sh -o /tmp/mc.sh
> bash /tmp/mc.sh -b -p /opt/miniconda
> /opt/miniconda/bin/python -m venv .venv
> ```

### 部署步骤

```bash
# 1. 上传项目到服务器（可排除 node_modules/、.venv/、data/*.db）

# 2. 安装系统基础依赖（如未装）
sudo apt update
sudo apt install -y curl xz-utils lsof ca-certificates

# 3. 确认 .env 配置（关键！）
#    DEEPSEEK_API=sk-xxxx   ← 必须填真实 token（当前是占位符）
#    RAG_API_KEY=... / RAG_AGENT_ID=... / OUTLOOK_MAIL_CLIENT_ID=...

# 4. 一键部署（脚本自动：装 Node22 + venv + 依赖 + 构建 + 启动）
chmod +x deploy.sh stop.sh
sudo ./deploy.sh
```

脚本使用国内源：pip 清华源、npm npmmirror、Node 二进制 npmmirror。

### 访问

- 前端：`http://<服务器IP>`（80 端口，需 root 或开放端口）
- 后端健康检查：`http://<服务器IP>:8080/api/health`

### 管理

```bash
./start.sh                # 启动全部服务（nohup 后台，日常启动用这个）
./stop.sh                 # 停止全部服务
./status.sh               # 查看服务状态 + 端口 + 健康检查
tail -f logs/backend.log  # 查看后端日志
tail -f logs/agent.log    # 查看 Agent 日志
tail -f logs/frontend.log # 查看前端日志
```

> **日常使用**：首次部署用 `./deploy.sh`（含安装/构建）。之后重启服务只用 `./start.sh`（不重装依赖、不重新构建，秒起）。

### 已知限制

Outlook 邮件拉取/发送首次需设备码认证：

```bash
# 邮件拉取认证
cd /path/to/project
node node_modules/@hazzajenko/outlook-mail-mcp/dist/cli.js auth

# 邮件发送认证
cd backend && ../.venv/bin/python -m app.outlook_auth
```

认证后 token 缓存在 `~/.config/outlook-mail/`。

---

## 方式二：Docker 部署（备选）

```bash
docker compose up -d --build
```

> 国内镜像构建慢时，可在各 Dockerfile 内将 pip/npm/apt 源替换为国内镜像。
