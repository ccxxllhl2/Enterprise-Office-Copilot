# 服务器启动/状态脚本
2026-11-21

## 后端代码改动
- 无

## 前端代码改动
- 无

## 数据库改动
- 无

## 新增文件
- start.sh：nohup 后台启动 3 服务（不装依赖/不构建），启动前检查端口占用，自动导出 DEEPSEEK_API_KEY
- status.sh：查看服务 PID 状态、端口监听、健康检查
- DEPLOY.md：管理部分补充 start.sh / status.sh 说明

## 脚本分工
- deploy.sh：首次部署（装 Node/Python + 依赖 + 构建 + 启动）
- start.sh：日常启动（秒起，不重复安装/构建）
- stop.sh：停止全部服务
- status.sh：状态检查
