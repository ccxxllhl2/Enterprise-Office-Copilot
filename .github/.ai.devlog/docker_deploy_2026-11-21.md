# Docker 云端部署配置
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
backend/Dockerfile | 全部 | 新增：python3.14 + node22 + outlook-mail CLI + FastAPI
frontend/nginx.conf | 全部 | 新增：nginx 反向代理（/api/chat→agent，/api/*→backend）

## 前端代码改动
页面 | 源文件 | 改动目的
API 封装 | frontend/src/api/client.js | API_BASE 改相对路径（同源部署）
API 封装 | frontend/src/api/agent.js | AGENT_BASE 改相对路径
报告助手 | frontend/src/pages/ReportPage.jsx | 硬编码 localhost 改相对路径
构建配置 | frontend/vite.config.js | 新增 dev proxy（本地开发兼容）

## 数据库改动
- 无

## 新增文件
- backend/Dockerfile、agent-service/Dockerfile、frontend/Dockerfile
- docker-compose.yml（3 服务编排）
- .dockerignore（排除 node_modules/.venv/data/.env）
- DEPLOY.md（部署说明）
