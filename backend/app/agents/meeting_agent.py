"""会议助手：会议纪要 + 周报。"""
from app.llm import chat

_SYSTEM = "你是会议记录助手。输出结构化、要点式的中文。"


def minutes(transcript: str) -> str:
    """由会议文字稿生成纪要。"""
    return chat(
        _SYSTEM,
        f"请将以下会议记录整理为纪要，包含：议题、决议、行动项（负责人/截止时间）。\n\n{transcript}",
    )


def weekly_report(meeting_notes: str) -> str:
    """由会议纪要汇总周报。"""
    return chat(
        _SYSTEM,
        f"请根据以下会议纪要，生成本周工作周报（本周进展、下周计划、风险与求助）。\n\n{meeting_notes}",
    )
