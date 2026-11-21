"""FastAPI 主程序：端口 8080。"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import db
from app.routers import email, knowledge, meeting, report

db.init_db()

app = FastAPI(title="Enterprise Office Copilot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80", "http://127.0.0.1", "http://127.0.0.1:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(email.router)
app.include_router(meeting.router)
app.include_router(knowledge.router)
app.include_router(report.router)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}
