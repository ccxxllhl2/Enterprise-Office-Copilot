# 项目重构：前后端分离 + SQLite
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
backend/app/main.py | 全部 | Streamlit 单页改为 FastAPI 入口，挂载 4 个路由，CORS 放行 localhost:80
backend/app/config.py | BASE_DIR/DB_PATH | 区分 backend 目录与项目根目录，新增 DB_PATH 指向 data/office_copilot.db
backend/app/db.py | 全部 | 新增 SQLite 持久层：emails/meetings/knowledge_docs/reports 四表 CRUD
backend/app/access.py | 全部 | 访问控制改为 FastAPI 依赖注入（x-agent-token 请求头校验）
backend/app/orchestrator.py | 全部 | 精简为子代理统一导出，路由逻辑移至 routers
backend/app/routers/email.py | 全部 | 邮件 API：/summarize /reply /list
backend/app/routers/meeting.py | 全部 | 会议 API：/minutes /weekly /list
backend/app/routers/knowledge.py | 全部 | 知识 API：/ask /docs /upload
backend/app/routers/report.py | 全部 | 报告 API：/generate /list
backend/tests/ | 重建 | test_access / test_db / test_api 共 7 用例

## 前端代码改动
页面 | 源文件 | 改动目的
全局布局 | frontend/src/App.jsx | 左侧导航 + 4 菜单切换
邮件助手 | frontend/src/pages/EmailPage.jsx | 邮件摘要/回复草稿/历史记录
会议助手 | frontend/src/pages/MeetingPage.jsx | 会议纪要/周报/历史纪要
知识助手 | frontend/src/pages/KnowledgePage.jsx | 提问/文档上传/文档列表
报告助手 | frontend/src/pages/ReportPage.jsx | 报告生成/历史报告
API 封装 | frontend/src/api/client.js | fetch 封装 + x-agent-token 注入
工程配置 | frontend/{package.json,vite.config.js,index.html} | Vite 端口 80

## 数据库改动
- 新建 data/office_copilot.db（运行时生成，git 忽略）
- emails：id/body/summary/reply/tone/created_at
- meetings：id/transcript/minutes/created_at
- knowledge_docs：id/name/path/created_at
- reports：id/title/content/created_at
