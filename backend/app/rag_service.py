"""阿里百炼 RAG 知识检索服务。"""
from urllib.parse import urlparse

import httpx

from app.config import RAG_API_KEY, RAG_API_URL, RAG_AGENT_ID, RAG_INDEX_ID

# 直连阿里云（绕过本地代理），避免 TLS 握手超时
_client = httpx.Client(trust_env=False, timeout=60)


def _search_url() -> str:
    """由 RAG_API_URL 推导知识检索端点。"""
    parsed = urlparse(RAG_API_URL)
    return f"{parsed.scheme}://{parsed.netloc}/api/v1/indices/knowledge/search"


def search(query: str) -> list[dict]:
    """调用知识检索接口，返回命中切片 nodes 列表。"""
    if not RAG_AGENT_ID:
        raise RuntimeError("未配置 RAG_AGENT_ID（知识检索服务 ID）")
    if not RAG_API_KEY:
        raise RuntimeError("未配置 RAG_API_KEY")

    payload: dict = {"agent_id": RAG_AGENT_ID, "query": query}
    if RAG_INDEX_ID:
        payload["kb_search_configs"] = [{"id": RAG_INDEX_ID}]

    resp = _client.post(
        _search_url(),
        headers={"Authorization": f"Bearer {RAG_API_KEY}"},
        json=payload,
    )
    data = resp.json()
    if not data.get("success"):
        raise RuntimeError(f"RAG 检索失败: {data.get('message') or data.get('code') or data}")
    return data.get("data", {}).get("nodes", [])
