# 邮件助手：拉取与发送邮件
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
backend/app/outlook_service.py | 全部 | 新增：subprocess 封装 outlook-mail CLI，提供 list_folders/search_emails/get_email
backend/app/outlook_graph.py | 全部 | 新增：msal 设备码认证 + Graph API sendMail（Mail.Send）
backend/app/outlook_auth.py | 全部 | 新增：python -m app.outlook_auth 手动认证入口
backend/app/routers/email.py | 新增端点 | GET /folders、GET /inbox、GET /message/{id}、POST /send
backend/app/config.py | OUTLOOK_* 配置 | 新增 OUTLOOK_MAIL_CLIENT_ID/TENANT_ID 读取
backend/requirements.txt | msal 行 | 新增 msal>=1.31 依赖

## 前端代码改动
页面 | 源文件 | 改动目的
邮件助手 | frontend/src/pages/EmailPage.jsx | 重构：真实邮件列表（收件箱/已发送/草稿）+ 全文查看 + 写邮件发送表单

## 数据库改动
- 无结构变更
