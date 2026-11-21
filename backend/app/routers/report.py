"""报告助手 API。"""
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel

from app import db, doc_parser
from app.access import require_local_agent
from app.agents import report_agent
from app.config import TEMP_DIR

router = APIRouter(prefix="/api/report", tags=["report"])


class ReportIn(BaseModel):
    title: str = "工作简报"
    content: str


class ReportOut(BaseModel):
    report: str


class ParseOut(BaseModel):
    name: str
    text: str


@router.post("/generate", response_model=ReportOut, dependencies=[Depends(require_local_agent)])
def generate(payload: ReportIn) -> ReportOut:
    text = report_agent.generate({"汇总": payload.content}, title=payload.title)
    db.insert_report(payload.title, text)
    return ReportOut(report=text)


@router.post("/parse", response_model=ParseOut, dependencies=[Depends(require_local_agent)])
async def parse(file: UploadFile = File(...)) -> ParseOut:
    """解析上传的 PDF/Excel/txt/md 为纯文本，供报告生成使用。"""
    name = file.filename or "upload.bin"
    suffix = Path(name).suffix.lower()
    if suffix not in doc_parser.SUPPORTED_SUFFIXES:
        raise HTTPException(status_code=400, detail=f"不支持的格式: {suffix}")

    dest = TEMP_DIR / name
    dest.write_bytes(await file.read())
    try:
        text = doc_parser.parse_file(dest)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=422, detail=f"解析失败: {e}")

    return ParseOut(name=name, text=text)


@router.get("/list", dependencies=[Depends(require_local_agent)])
def list_reports() -> list[dict]:
    return db.list_reports()
