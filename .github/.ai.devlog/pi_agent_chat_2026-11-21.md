# Pi Agent Chat：自然语言邮件助手
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
- | - | 无改动（复用现有邮件 API）

## 前端代码改动
页面 | 源文件 | 改动目的
Agent Chat | frontend/src/pages/AgentChatPage.jsx | 新增：对话界面，调 agent-service /api/chat
全局导航 | frontend/src/App.jsx | 新增 Agent Chat 菜单（默认首页），保留 4 个管理页
API 封装 | frontend/src/api/agent.js | 新增 agent-service 调用封装

## 数据库改动
- 无

## 新增 agent-service（Node + Pi SDK）
源文件 | 改动目的
agent-service/src/index.ts | express 服务（3000），Pi SDK createAgentSession，POST /api/chat
agent-service/src/email-tools.ts | 注册 5 个邮件工具：list/read/send/summarize/draft_reply，调 8080 后端
agent-service/package.json | 依赖 @earendil-works/pi-coding-agent、typebox、express、tsx
start.ps1 | 启动脚本整合 3 服务，DEEPSEEK_API 自动映射为 DEEPSEEK_API_KEY

## 关键技术点
- Pi 原生支持 DeepSeek：环境变量 DEEPSEEK_API_KEY，模型 getModel("deepseek","deepseek-flash")
- 自定义工具用 createAgentSession 的 customTools 参数（ToolDefinition + TypeBox schema）
- noTools:"builtin" 禁用内置 read/bash/edit/write，仅保留邮件工具
