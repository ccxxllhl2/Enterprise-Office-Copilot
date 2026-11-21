# UI 重构：Chat 主页 + Admin 管理标签页
2026-11-21

## 后端代码改动
- 无

## 前端代码改动
页面 | 源文件 | 改动目的
全局布局 | frontend/src/App.jsx | 重构：顶部 Chat/Admin 两标签，Chat 为主页默认
管理页 | frontend/src/pages/AdminPage.jsx | 新增：4 助手（邮件/会议/知识/报告）侧边栏 + 内容
样式 | frontend/src/index.css | 新增 topbar/tabs/layout-col/layout-inner 样式
Agent Chat | frontend/src/pages/AgentChatPage.jsx | 高度适配新布局（100%）

## 数据库改动
- 无
