"""全局配置：路径、模型参数与 API 访问控制。"""
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# backend 目录为 BASE_DIR；项目根目录为其父目录
BACKEND_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BACKEND_DIR.parent
TEMP_DIR = ROOT_DIR / "Temp"
DATA_DIR = ROOT_DIR / "data"
DB_PATH = DATA_DIR / "office_copilot.db"

# DeepSeek 配置（OpenAI 兼容）
DEEPSEEK_API = os.getenv("DEEPSEEK_API", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

# 仅本地 Agent 调用：进程内共享令牌
LOCAL_AGENT_TOKEN = os.getenv("LOCAL_AGENT_TOKEN", "local-agent-only")

# Outlook Graph（outlook-mail CLI 使用）
OUTLOOK_MAIL_CLIENT_ID = os.getenv("OUTLOOK_MAIL_CLIENT_ID", "")
OUTLOOK_MAIL_TENANT_ID = os.getenv("OUTLOOK_MAIL_TENANT_ID", "consumers")

# 阿里百炼 RAG
RAG_API_URL = os.getenv("RAG_API_URL", "")
RAG_API_KEY = os.getenv("RAG_API_KEY", "")
RAG_AGENT_ID = os.getenv("RAG_AGENT_ID", "")
RAG_INDEX_ID = os.getenv("RAG_INDEX_ID", "")

TEMP_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)
