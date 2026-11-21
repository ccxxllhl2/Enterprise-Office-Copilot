"""SQLite 持久层测试（使用独立测试库，不污染真实数据）。"""
import os
import tempfile
from pathlib import Path

tmp = tempfile.mkdtemp()
os.environ["COPILOT_DB_PATH"] = str(Path(tmp) / "test.db")

from app import db  # noqa: E402


def test_email_roundtrip():
    db.init_db()
    eid = db.insert_email("邮件正文", "摘要", "回复", "正式")
    rows = db.list_emails()
    assert any(r["id"] == eid for r in rows)


def test_meeting_roundtrip():
    mid = db.insert_meeting("会议记录", "纪要")
    assert any(r["id"] == mid for r in db.list_meetings())


def test_knowledge_roundtrip():
    kid = db.insert_knowledge_doc("doc.txt", "/tmp/doc.txt")
    assert any(r["id"] == kid for r in db.list_knowledge_docs())


def test_report_roundtrip():
    rid = db.insert_report("标题", "内容")
    assert any(r["id"] == rid for r in db.list_reports())
