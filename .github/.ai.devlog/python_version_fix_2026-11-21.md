# 修复：服务器 Python 版本兼容（需 ≥3.11）
2026-11-21

## 后端代码改动
- 无

## 前端代码改动
- 无

## 数据库改动
- 无

## 部署脚本改动
- deploy.sh：自动检测 Python ≥3.11，不足则 deadsnakes PPA 安装 3.12；旧 venv 版本不符自动重建
- DEPLOY.md：补充 Python ≥3.11 要求与 miniconda 备选方案

## 根因
- 服务器 Python 3.8（Ubuntu 20.04），fastapi 0.165 要求 ≥3.11、jiter 0.10 要求 ≥3.9
- 报错仅显示 jiter，实为 pip 解析首个失败点，后续 fastapi 等同样不兼容
