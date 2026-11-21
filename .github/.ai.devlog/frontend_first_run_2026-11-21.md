# 前端首次运行与环境配置验证
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
.env.example | DEEPSEEK_API 行 | `${DEEPSEEK_API}` 自引用改为占位符 `your_token_here`

## 前端代码改动
页面 | 源文件 | 改动目的
- | frontend/ | 执行 npm install（66 包），Vite dev 启动于 80 端口，页面正常渲染

## 数据库改动
- 无结构变更；仅验证 SQLite 历史记录随 API 调用正确持久化
