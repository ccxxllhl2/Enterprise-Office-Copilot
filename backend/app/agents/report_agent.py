"""报告助手：汇总各助手输出生成报告。"""
from app.llm import chat

_SYSTEM = "你是企业报告助手。输出结构清晰的中文报告。"


def generate(sections: dict[str, str], title: str = "工作简报") -> str:
    """将各部分内容汇总为一份报告。"""
    body = "\n\n".join(f"【{k}】\n{v}" for k, v in sections.items())
    return chat(
        _SYSTEM,
        f"请将以下各部分内容整合为一份《{title}》报告，保留要点、去除重复。\n\n{body}",
    )
