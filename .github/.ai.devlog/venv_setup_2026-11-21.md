# 虚拟开发环境搭建
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
start.ps1 | 后端启动命令 | 改用 .venv\Scripts\python.exe 启动 uvicorn

## 前端代码改动
- 无

## 数据库改动
- 无

## 环境说明
- 项目根创建 .venv（Python 3.14），安装 backend/requirements.txt 全部依赖
- agent-service、frontend 的 node_modules 均已就绪（npm install 确认 up to date）
- 后端测试 7 passed（需在 backend 目录运行 pytest）
