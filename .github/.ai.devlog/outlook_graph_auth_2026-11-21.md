# Outlook Graph 接入与认证
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
package.json | 全部 | 项目根新增 Node 依赖 @hazzajenko/outlook-mail-mcp 及 outlook 脚本
.env | OUTLOOK_MAIL_TENANT_ID 行 | common 改为 consumers（应用为仅个人账户注册，修复 AADSTS9002346）
.env.example | OUTLOOK_MAIL_TENANT_ID 行 | 同步改为 consumers

## 前端代码改动
- 无

## 数据库改动
- 无
