"""Outlook Graph 服务：通过 outlook-mail CLI 拉取邮件（只读）。"""
import json
import os
import subprocess

from app.config import OUTLOOK_MAIL_CLIENT_ID, OUTLOOK_MAIL_TENANT_ID, ROOT_DIR

_CLI_JS = ROOT_DIR / "node_modules" / "@hazzajenko" / "outlook-mail-mcp" / "dist" / "cli.js"


def _run(*args: str) -> dict | list:
    """调用 outlook-mail CLI 并返回 JSON。"""
    env = os.environ.copy()
    if OUTLOOK_MAIL_CLIENT_ID:
        env["OUTLOOK_MAIL_CLIENT_ID"] = OUTLOOK_MAIL_CLIENT_ID
    env["OUTLOOK_MAIL_TENANT_ID"] = OUTLOOK_MAIL_TENANT_ID or "consumers"

    proc = subprocess.run(
        ["node", str(_CLI_JS), *args],
        capture_output=True,
        text=True,
        encoding="utf-8",
        cwd=str(ROOT_DIR),
        env=env,
        timeout=90,
    )
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout or "outlook-mail 调用失败").strip())
    out = proc.stdout.strip()
    if not out:
        return []
    return json.loads(out)


def list_folders() -> list[dict]:
    """列出邮件文件夹。"""
    return _run("folders", "--json")


def search_emails(top: int = 20, folder: str = "inbox", unread: bool = False) -> list[dict]:
    """搜索邮件，默认收件箱。返回邮件列表。"""
    args = ["search", "--top", str(max(1, min(top, 500)))]
    if folder:
        args += ["--folder", folder]
    if unread:
        args += ["--unread"]
    args += ["--json"]
    data = _run(*args)
    if isinstance(data, dict) and "results" in data:
        return data["results"]
    return data if isinstance(data, list) else []


def get_email(message_id: str) -> dict:
    """获取单封邮件全文。"""
    return _run("get", message_id, "--body-format", "text", "--json")
