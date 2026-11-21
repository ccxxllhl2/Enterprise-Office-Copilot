"""API 访问控制测试。"""
import pytest
from fastapi import HTTPException

from app.access import require_local_agent


def test_valid_token():
    assert require_local_agent(x_agent_token="local-agent-only") is None


def test_invalid_token():
    with pytest.raises(HTTPException) as e:
        require_local_agent(x_agent_token="bad")
    assert e.value.status_code == 403
