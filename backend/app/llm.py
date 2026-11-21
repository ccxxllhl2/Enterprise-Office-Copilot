"""DeepSeek 统一封装：所有 LLM 调用收敛到此处。"""
from openai import OpenAI

from app.config import DEEPSEEK_API, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL

_client = OpenAI(api_key=DEEPSEEK_API, base_url=DEEPSEEK_BASE_URL)


def chat(system: str, user: str, temperature: float = 0.3, max_tokens: int = 2048) -> str:
    """单轮对话，返回文本回复。"""
    resp = _client.chat.completions.create(
        model=DEEPSEEK_MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=temperature,
        max_tokens=max_tokens,
    )
    return resp.choices[0].message.content or ""
