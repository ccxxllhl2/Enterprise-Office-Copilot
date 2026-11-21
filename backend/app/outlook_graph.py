"""通过 Microsoft Graph API 发送邮件（需 Mail.Send 权限）。"""
from pathlib import Path

import httpx
from msal import PublicClientApplication, SerializableTokenCache

from app.config import OUTLOOK_MAIL_CLIENT_ID, OUTLOOK_MAIL_TENANT_ID

SCOPES = ["Mail.Read", "Mail.Send"]
CACHE_PATH = Path.home() / ".config" / "outlook-mail" / "msal-python-cache.bin"
GRAPH_SEND_URL = "https://graph.microsoft.com/v1.0/me/sendMail"


def _app() -> PublicClientApplication:
    tenant = OUTLOOK_MAIL_TENANT_ID or "consumers"
    cache = SerializableTokenCache()
    if CACHE_PATH.exists():
        cache.deserialize(CACHE_PATH.read_text(encoding="utf-8"))
    return PublicClientApplication(
        OUTLOOK_MAIL_CLIENT_ID,
        authority=f"https://login.microsoftonline.com/{tenant}",
        token_cache=cache,
    )


def auth_interactive() -> None:
    """设备码认证并缓存 token（供 python -m app.outlook_auth 调用）。"""
    app = _app()
    flow = app.initiate_device_flow(scopes=SCOPES)
    if "user_code" not in flow:
        raise RuntimeError(flow.get("error_description") or str(flow))
    print(flow["message"], flush=True)
    result = app.acquire_token_by_device_flow(flow)
    if "access_token" not in result:
        raise RuntimeError(result.get("error_description") or str(result))
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(app.token_cache.serialize(), encoding="utf-8")
    print("[OK] token acquired and cached", flush=True)


def _get_token() -> str:
    app = _app()
    accounts = app.get_accounts()
    if accounts:
        result = app.acquire_token_silent(SCOPES, account=accounts[0])
        if result and "access_token" in result:
            return result["access_token"]
    raise PermissionError("未获取到邮件发送授权，请先运行 python -m app.outlook_auth")


def send_email(to: str, subject: str, body: str) -> None:
    """发送邮件，成功后自动存入已发送。"""
    token = _get_token()
    payload = {
        "message": {
            "subject": subject,
            "body": {"contentType": "Text", "content": body},
            "toRecipients": [{"emailAddress": {"address": to}}],
        },
        "saveToSentItems": "true",
    }
    resp = httpx.post(
        GRAPH_SEND_URL,
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
        timeout=30,
    )
    if resp.status_code >= 300:
        raise RuntimeError(f"发送失败: {resp.status_code} {resp.text}")
