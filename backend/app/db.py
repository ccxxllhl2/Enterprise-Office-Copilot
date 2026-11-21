"""SQLite 持久层：邮件/会议/知识/报告四表。"""
import os
import sqlite3
from datetime import datetime
from pathlib import Path

from app.config import DB_PATH

_DB_PATH = Path(os.getenv("COPILOT_DB_PATH", str(DB_PATH)))

_conn = sqlite3.connect(_DB_PATH, check_same_thread=False)
_conn.row_factory = sqlite3.Row


def _now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def init_db() -> None:
    cur = _conn.cursor()
    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            body TEXT NOT NULL,
            summary TEXT,
            reply TEXT,
            tone TEXT DEFAULT '正式',
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transcript TEXT NOT NULL,
            minutes TEXT,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS knowledge_docs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        """
    )
    _conn.commit()


# ---------- emails ----------
def insert_email(body: str, summary: str, reply: str, tone: str) -> int:
    cur = _conn.execute(
        "INSERT INTO emails (body, summary, reply, tone, created_at) VALUES (?,?,?,?,?)",
        (body, summary, reply, tone, _now()),
    )
    _conn.commit()
    return cur.lastrowid


def list_emails(limit: int = 50) -> list[dict]:
    rows = _conn.execute(
        "SELECT id, body, summary, reply, tone, created_at FROM emails ORDER BY id DESC LIMIT ?",
        (limit,),
    ).fetchall()
    return [dict(r) for r in rows]


# ---------- meetings ----------
def insert_meeting(transcript: str, minutes: str) -> int:
    cur = _conn.execute(
        "INSERT INTO meetings (transcript, minutes, created_at) VALUES (?,?,?)",
        (transcript, minutes, _now()),
    )
    _conn.commit()
    return cur.lastrowid


def list_meetings(limit: int = 50) -> list[dict]:
    rows = _conn.execute(
        "SELECT id, transcript, minutes, created_at FROM meetings ORDER BY id DESC LIMIT ?",
        (limit,),
    ).fetchall()
    return [dict(r) for r in rows]


# ---------- knowledge_docs ----------
def insert_knowledge_doc(name: str, path: str) -> int:
    cur = _conn.execute(
        "INSERT INTO knowledge_docs (name, path, created_at) VALUES (?,?,?)",
        (name, path, _now()),
    )
    _conn.commit()
    return cur.lastrowid


def list_knowledge_docs(limit: int = 50) -> list[dict]:
    rows = _conn.execute(
        "SELECT id, name, path, created_at FROM knowledge_docs ORDER BY id DESC LIMIT ?",
        (limit,),
    ).fetchall()
    return [dict(r) for r in rows]


# ---------- reports ----------
def insert_report(title: str, content: str) -> int:
    cur = _conn.execute(
        "INSERT INTO reports (title, content, created_at) VALUES (?,?,?)",
        (title, content, _now()),
    )
    _conn.commit()
    return cur.lastrowid


def list_reports(limit: int = 50) -> list[dict]:
    rows = _conn.execute(
        "SELECT id, title, content, created_at FROM reports ORDER BY id DESC LIMIT ?",
        (limit,),
    ).fetchall()
    return [dict(r) for r in rows]
