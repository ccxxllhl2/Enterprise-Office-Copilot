"""知识助手：阿里百炼 RAG 检索 + 本地文档解析（PDF/Excel/文本）。"""
from pathlib import Path

from app import doc_parser, rag_service
from app.config import DATA_DIR, TEMP_DIR
from app.llm import chat

_SYSTEM = "你是企业知识库助手。仅基于给定参考资料回答，资料不足时明确说明。"

_SEARCH_DIRS = (DATA_DIR, TEMP_DIR)


def list_docs() -> list[dict]:
    """列出本地可解析文档。"""
    docs = []
    for d in _SEARCH_DIRS:
        for p in sorted(d.rglob("*")):
            if p.is_file() and p.suffix.lower() in doc_parser.SUPPORTED_SUFFIXES:
                docs.append({"name": p.name, "path": str(p)})
    return docs


def _parse_all_docs() -> str:
    """解析所有本地文档为纯文本。"""
    parts = []
    for doc in list_docs():
        try:
            text = doc_parser.parse_file(Path(doc["path"]))
        except Exception as e:  # noqa: BLE001
            text = f"（解析失败: {e}）"
        parts.append(f"【{doc['name']}】\n{text}")
    return "\n\n".join(parts)


def _rag_context(question: str) -> str:
    """调用百炼 RAG 检索，拼接上下文。"""
    nodes = rag_service.search(question)
    lines = []
    for i, node in enumerate(nodes, 1):
        text = node.get("text", "")
        meta = node.get("metadata") or {}
        src = meta.get("doc_name") or meta.get("title") or ""
        lines.append(f"[片段{i}] 来源:{src}\n{text}")
    return "\n\n".join(lines)


def answer(question: str) -> str:
    """RAG 优先，失败则本地文档解析检索。"""
    try:
        context = _rag_context(question)
        source = "百炼 RAG 知识库"
    except Exception as e:  # noqa: BLE001
        context = _parse_all_docs()
        source = f"本地文档（RAG 不可用: {e}）"

    if not context.strip():
        context = "（知识库中未找到相关内容）"

    return chat(
        _SYSTEM,
        f"参考资料来源：{source}\n\n{context}\n\n问题：{question}\n请基于参考资料回答。",
    )
