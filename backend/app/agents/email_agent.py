"""邮件助手：摘要 + 回复草稿。"""
from app.llm import chat

_SYSTEM = "你是企业邮件助手。输出简洁、专业的中文。"


def summarize(email_text: str) -> str:
    """生成邮件摘要。"""
    return chat(
        _SYSTEM,
        f"请用 3 条要点概括以下邮件，每条不超过 30 字：\n\n{email_text}",
    )


def draft_reply(email_text: str, tone: str = "正式") -> str:
    """生成回复草稿。"""
    return chat(
        _SYSTEM,
        f"请以「{tone}」语气为以下邮件撰写回复草稿：\n\n{email_text}",
    )
