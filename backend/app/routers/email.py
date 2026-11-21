"""邮件助手 API。"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app import db
from app.access import require_local_agent
from app.agents import email_agent
from app import outlook_service
from app.outlook_graph import send_email as graph_send_email

router = APIRouter(prefix="/api/email", tags=["email"])


class EmailIn(BaseModel):
    body: str
    tone: str = "正式"


class SummarizeOut(BaseModel):
    summary: str


class ReplyOut(BaseModel):
    reply: str


class SendIn(BaseModel):
    to: str
    subject: str
    body: str


class SendOut(BaseModel):
    sent: bool


@router.post("/summarize", response_model=SummarizeOut, dependencies=[Depends(require_local_agent)])
def summarize(payload: EmailIn) -> SummarizeOut:
    summary = email_agent.summarize(payload.body)
    db.insert_email(payload.body, summary, "", payload.tone)
    return SummarizeOut(summary=summary)


@router.post("/reply", response_model=ReplyOut, dependencies=[Depends(require_local_agent)])
def reply(payload: EmailIn) -> ReplyOut:
    draft = email_agent.draft_reply(payload.body, payload.tone)
    db.insert_email(payload.body, "", draft, payload.tone)
    return ReplyOut(reply=draft)


@router.get("/list", dependencies=[Depends(require_local_agent)])
def list_emails() -> list[dict]:
    return db.list_emails()


@router.get("/folders", dependencies=[Depends(require_local_agent)])
def mail_folders() -> list[dict]:
    """真实 Outlook 邮件文件夹。"""
    try:
        return outlook_service.list_folders()
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/inbox", dependencies=[Depends(require_local_agent)])
def inbox(
    top: int = Query(20, ge=1, le=500),
    folder: str = Query("inbox"),
    unread: bool = Query(False),
) -> list[dict]:
    """真实 Outlook 邮件列表。"""
    try:
        return outlook_service.search_emails(top=top, folder=folder, unread=unread)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/message/{message_id}", dependencies=[Depends(require_local_agent)])
def message(message_id: str) -> dict:
    """获取单封邮件全文。"""
    try:
        return outlook_service.get_email(message_id)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.post("/send", response_model=SendOut, dependencies=[Depends(require_local_agent)])
def send(payload: SendIn) -> SendOut:
    """通过 Graph API 发送邮件。"""
    try:
        graph_send_email(payload.to, payload.subject, payload.body)
        return SendOut(sent=True)
    except PermissionError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))
