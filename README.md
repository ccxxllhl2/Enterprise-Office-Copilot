# Enterprise Office Copilot

企业办公助手第一版原型：邮件 / 会议 / 知识 / 报告 4 个助手 + Agent Chat。

## 架构

- `backend/`：FastAPI + SQLite，端口 **8080**
- `agent-service/`：Pi Agent（DeepSeek）+ 邮件工具，端口 **3000**
- `frontend/`：Vite + React，端口 **80**（管理 UI + Agent Chat）
- `Temp/`：临时文档（实验演示）
- `data/`：本地知识库 + SQLite 数据库

## 快速开始

前置：Python 3.14、Node.js 22+。

```powershell
# 1. 安装后端依赖
py -3.14 -m pip install -r backend/requirements.txt

# 2. 安装 agent-service 依赖
cd agent-service; npm install; cd ..

# 3. 安装前端依赖
cd frontend; npm install; cd ..

# 4. 一键启动全部服务
.\start.bat
```

访问：
- 前端 http://localhost:80 （Agent Chat 为默认页）
- Agent 服务 http://localhost:3000
- 后端 http://localhost:8080

## 环境变量

- `DEEPSEEK_API`：DeepSeek API Token（必填；Pi Agent 自动映射为 `DEEPSEEK_API_KEY`）
- `OUTLOOK_MAIL_CLIENT_ID` / `OUTLOOK_MAIL_TENANT_ID`：Outlook Graph 应用配置
- `LOCAL_AGENT_TOKEN`：本地 Agent 调用令牌（默认 `local-agent-only`）

## 测试

```powershell
cd backend; py -3.14 -m pytest tests -q
```

