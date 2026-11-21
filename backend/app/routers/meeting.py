"""会议助手 API。"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app import db
from app.access import require_local_agent
from app.agents import meeting_agent

router = APIRouter(prefix="/api/meeting", tags=["meeting"])


class MeetingIn(BaseModel):
    transcript: str


class MinutesOut(BaseModel):
    minutes: str


class WeeklyOut(BaseModel):
    report: str


@router.post("/minutes", response_model=MinutesOut, dependencies=[Depends(require_local_agent)])
def minutes(payload: MeetingIn) -> MinutesOut:
    text = meeting_agent.minutes(payload.transcript)
    db.insert_meeting(payload.transcript, text)
    return MinutesOut(minutes=text)


@router.post("/weekly", response_model=WeeklyOut, dependencies=[Depends(require_local_agent)])
def weekly(payload: MeetingIn) -> WeeklyOut:
    text = meeting_agent.weekly_report(payload.transcript)
    return WeeklyOut(report=text)


@router.get("/list", dependencies=[Depends(require_local_agent)])
def list_meetings() -> list[dict]:
    return db.list_meetings()
