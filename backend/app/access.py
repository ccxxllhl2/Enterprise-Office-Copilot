"""API 访问控制：仅允许本地 Agent 调用（FastAPI 依赖注入）。"""
from fastapi import Header, HTTPException

from app.config import LOCAL_AGENT_TOKEN


def require_local_agent(x_agent_token: str = Header(default="")) -> None:
    """校验请求头 x-agent-token，仅本地 Agent 可调用。"""
    if x_agent_token != LOCAL_AGENT_TOKEN:
        raise HTTPException(status_code=403, detail="仅允许本地 Agent 调用")
