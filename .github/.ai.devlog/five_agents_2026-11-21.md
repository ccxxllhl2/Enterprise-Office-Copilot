# 5 个 Pi Agent：主 Agent + 4 专项 Agent
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
- | - | 无改动（复用现有 API）

## 前端代码改动
页面 | 源文件 | 改动目的
通用组件 | frontend/src/pages/AgentPanel.jsx | 新增：可复用 Agent 对话面板，嵌入 4 管理页
邮件助手 | frontend/src/pages/EmailPage.jsx | 底部嵌入 email Agent 面板
会议助手 | frontend/src/pages/MeetingPage.jsx | 底部嵌入 meeting Agent 面板
知识助手 | frontend/src/pages/KnowledgePage.jsx | 底部嵌入 knowledge Agent 面板
报告助手 | frontend/src/pages/ReportPage.jsx | 底部嵌入 report Agent 面板
API 封装 | frontend/src/api/agent.js | agentChat 支持按 agent 名路由

## 数据库改动
- 无

## agent-service 改动
源文件 | 改动目的
agent-service/src/index.ts | 创建 5 个 Pi Agent session（chat/email/meeting/knowledge/report），按 agentDir 加载 SYSTEM.md，路由 /api/agents/:name
agent-service/src/other-tools.ts | 新增 meeting/knowledge/report 工具（meeting_minutes/meeting_weekly/search_knowledge/generate_report）
agent-service/prompts/chat/SYSTEM.md | 主 Agent 系统提示词（全部能力）
agent-service/prompts/email/SYSTEM.md | 邮件 Agent 系统提示词
agent-service/prompts/meeting/SYSTEM.md | 会议 Agent 系统提示词
agent-service/prompts/knowledge/SYSTEM.md | 知识 Agent 系统提示词
agent-service/prompts/report/SYSTEM.md | 报告 Agent 系统提示词

## 关键技术点
- Pi SDK 用 agentDir 指向 prompts/<name>，加载对应 SYSTEM.md 定制每个 agent 角色
- 主 Agent 注册全部 9 个工具，专项 Agent 只注册各自工具，实现能力隔离
