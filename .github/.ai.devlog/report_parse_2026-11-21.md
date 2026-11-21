# 报告助手：PDF/Excel 上传解析
2026-11-21

## 后端代码改动
源文件 | 改动行 | 改动目的
backend/app/routers/report.py | parse 端点 | 新增 POST /api/report/parse，上传 PDF/Excel/txt/md 解析为纯文本

## 前端代码改动
页面 | 源文件 | 改动目的
报告助手 | frontend/src/pages/ReportPage.jsx | 新增文件上传，解析后自动填入内容区并提示字符数

## 数据库改动
- 无
