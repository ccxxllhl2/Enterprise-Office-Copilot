# Enterprise Office Copilot — 实施方案（3 小时第一版）

## 1. 范围
- 交付 4 个助手：邮件 / 会议 / 知识 / 报告，管理 UI（React）单页入口。
- 新增 **Agent Chat**：用户自然语言对话，由 Pi Agent 调用本地工具操作邮件功能。
- 核心 LLM：DeepSeek API（Pi 原生支持，环境变量 `DEEPSEEK_API_KEY`）。
- 本地数据优先：SharePoint → 本地目录；Outlook Graph → 邮件 CLI + Graph 发送。

## 2. 架构
```
frontend (React, 80)
  ├── 管理 UI：邮件/会议/知识/报告 4 页面
  └── Agent Chat：与 Pi Agent 对话

agent-service (Node + Pi SDK, 3000)   ← 新增
  └── Pi extension 注册邮件工具 → 调 backend

backend (FastAPI, 8080)
  ├── 邮件 API（拉取/发送/摘要/回复）
  └── 会议/知识/报告 API
```

## 3. 技术选型
| 项 | 选择 | 说明 |
|----|------|------|
| 管理 UI | React + Vite | 端口 80 |
| 后端 | FastAPI + SQLite | 端口 8080 |
| Agent Chat | Pi SDK + extension | Node 服务端口 3000 |
| LLM | DeepSeek（Pi 内置 provider） | `DEEPSEEK_API_KEY` |
| 邮件 | outlook-mail CLI（读）+ Graph API（发） | 只读 CLI + msal sendMail |

## 4. 目录结构
```
Enterprise-Office-Copilot/
├── backend/                # FastAPI + SQLite（8080）
│   ├── app/
│   │   ├── main.py / config.py / llm.py / db.py
│   │   ├── outlook_service.py   # 邮件拉取（CLI）
│   │   ├── outlook_graph.py     # 邮件发送（Graph API）
│   │   └── agents/ routers/
│   └── tests/
├── agent-service/          # Pi Agent（3000）
│   ├── package.json
│   └── src/
│       ├── index.ts        # HTTP 服务 + Pi SDK session
│       └── email-tools.ts  # Pi extension：邮件工具
├── frontend/               # React（80）
│   └── src/pages/          # 4 管理页 + AgentChatPage
├── .pi/extensions/         # Pi 项目级扩展（若用自动发现）
├── Temp/ data/ docs/
└── start.ps1 / start.bat
```

## 5. Agent Chat 工具（Pi extension 注册）
| 工具 | 后端调用 |
|------|---------|
| send_email(to,subject,body) | POST /api/email/send |
| list_emails(folder) | GET /api/email/inbox |
| read_email(id) | GET /api/email/message/{id} |
| summarize_email(body) | POST /api/email/summarize |
| draft_reply(body,tone) | POST /api/email/reply |

## 6. 实施顺序
| 序 | 任务 | 产出 |
|----|------|------|
| 1 | 邮件助手（拉取/发送/摘要/回复） | 已完成 |
| 2 | Pi SDK 接入 DeepSeek + 邮件工具 extension | agent-service |
| 3 | Agent Chat 前端页 + 管理 UI 保留 | Chat 页 |
| 4 | 启动脚本整合 3 服务 | start 脚本 |
| 5 | 会议/知识/报告助手 | 后置 |

## 7. API 访问控制
- 所有 API 校验 `x-agent-token`，仅本地 Agent 调用。
- 不对外暴露；前端/agent-service 均监听 localhost。

## 8. 验收标准
- `start.bat` 一键启动 3 服务（backend/agent-service/frontend）。
- Agent Chat 输入「给 xx 发一封邮件…」能真实发送。
- 管理 UI 4 页面可操作。
- `pytest` 全绿。

## 9. 后置对接
1. Outlook Graph 收件箱（已通）、发送（已通）
2. 阿里百炼 RAG（替换 knowledge_agent 检索层）
3. Pi Agent 多代理协作深化

