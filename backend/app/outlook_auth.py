"""手动运行设备码认证：python -m app.outlook_auth"""
from app.outlook_graph import auth_interactive

if __name__ == "__main__":
    auth_interactive()
