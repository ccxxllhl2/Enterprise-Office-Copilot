"""知识助手 API。"""
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel

from app import db
from app.access import require_local_agent
from app.agents import knowledge_agent
from app.config import DATA_DIR

router = APIRouter(prefix="/api/knowledge", tags=["knowledge"])


class QuestionIn(BaseModel):
    question: str


class AnswerOut(BaseModel):
    answer: str


@router.post("/ask", response_model=AnswerOut, dependencies=[Depends(require_local_agent)])
def ask(payload: QuestionIn) -> AnswerOut:
    return AnswerOut(answer=knowledge_agent.answer(payload.question))


@router.get("/docs", dependencies=[Depends(require_local_agent)])
def list_docs() -> list[dict]:
    """列出本地文档（含 PDF/Excel），带解析状态。"""
    docs = knowledge_agent.list_docs()
    result = []
    for d in docs:
        try:
            from app import doc_parser

            doc_parser.parse_file(Path(d["path"]))
            status = "已解析"
        except Exception as e:  # noqa: BLE001
            status = f"解析失败: {e}"
        result.append({**d, "status": status})
    return result


@router.post("/upload", dependencies=[Depends(require_local_agent)])
async def upload(file: UploadFile = File(...)) -> dict:
    name = file.filename or "doc.txt"
    dest = DATA_DIR / name
    dest.write_bytes(await file.read())
    db.insert_knowledge_doc(name, str(dest))
    # 上传后立即校验解析
    try:
        from app import doc_parser

        doc_parser.parse_file(dest)
        parsed = True
    except Exception as e:  # noqa: BLE001
        parsed = False
    return {"name": name, "path": str(dest), "parsed": parsed}
