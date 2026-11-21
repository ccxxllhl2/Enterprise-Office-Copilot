# 知识助手：PDF/Excel 解析 + 阿里百炼 RAG
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
backend/app/doc_parser.py | 全部 | 新增：txt/md/pdf/xlsx 纯文本解析（pypdf + openpyxl）
backend/app/rag_service.py | 全部 | 新增：百炼知识检索 API（agent_id，直连绕过本地代理）
backend/app/agents/knowledge_agent.py | 重构 | RAG 优先检索，失败回退本地文档解析
backend/app/routers/knowledge.py | docs/upload | docs 返回解析状态，upload 后校验解析
backend/app/config.py | RAG_* | 新增 RAG_API_URL/KEY/AGENT_ID/INDEX_ID
backend/requirements.txt | pypdf/openpyxl | 新增文档解析依赖

## 前端代码改动
页面 | 源文件 | 改动目的
知识助手 | frontend/src/pages/KnowledgePage.jsx | 上传支持 xlsx，显示解析状态，修复 key 警告

## 数据库改动
- 无

## 环境配置
- .env / .env.example 新增 RAG_AGENT_ID（检索服务 ID）与 RAG_INDEX_ID（知识库 ID）
