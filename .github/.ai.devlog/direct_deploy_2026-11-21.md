# 直接部署方案（国内源，无 Docker）
2026-11-21

## 后端代码改动
- 无

## 前端代码改动
页面 | 源文件 | 改动目的
构建配置 | frontend/vite.config.js | 新增 preview 配置（80 端口 + API 代理），生产无需 nginx

## 数据库改动
- 无

## 新增文件
- deploy.sh：Ubuntu 一键部署（python3 + node22(npmmirror) + venv(清华源) + npm(npmmirror) + 构建 + 启动）
- stop.sh：停止全部服务（PID + 端口兜底）
- DEPLOY.md：更新为「直接部署为主、Docker 备选」

## 关键决策
- 放弃 Docker 作为主方案（国内源拉取慢），改用服务器直接部署
- 前端生产用 vite preview（内置代理），替代 nginx，简化部署
