"""Helpers for constructing openai SDK exceptions in tests.

The ``openai`` SDK (>= 1.40) exception constructors take
``(message, response, body)`` — NOT ``request``. This helper builds a
valid ``httpx.Response`` so the exceptions can be constructed without
instantiating the SDK internals.
"""

from __future__ import annotations

from unittest.mock import MagicMock

import httpx
from openai import (
    APIConnectionError,
    APITimeoutError,
    AuthenticationError,
    RateLimitError,
)


def _make_response(status_code: int, body: dict | str | None = None) -> httpx.Response:
    """Build a real ``httpx.Response`` from a status code + body."""
    if body is None:
        content = b""
        headers = {"content-type": "text/plain"}
    elif isinstance(body, dict):
        import json

        content = json.dumps(body).encode("utf-8")
        headers = {"content-type": "application/json"}
    else:
        content = body.encode("utf-8") if isinstance(body, str) else body
        headers = {"content-type": "text/plain"}
    return httpx.Response(
        status_code=status_code,
        content=content,
        headers=headers,
        request=httpx.Request("POST", "http://test/"),
    )


def make_rate_limit_error(message: str = "429") -> RateLimitError:
    return RateLimitError(
        message=message, response=_make_response(429, {"error": message}), body=None
    )


def make_authentication_error(message: str = "bad token") -> AuthenticationError:
    return AuthenticationError(
        message=message,
        response=_make_response(401, {"error": message}),
        body=None,
    )


def make_connection_error() -> APIConnectionError:
    request = httpx.Request("POST", "http://test/")
    return APIConnectionError(request=request)


def make_timeout_error() -> APITimeoutError:
    request = httpx.Request("POST", "http://test/")
    return APITimeoutError(request=request)


def make_chat_response(content: str) -> MagicMock:
    """Build a fake OpenAI chat-completions response object."""
    msg = MagicMock()
    msg.content = content
    choice = MagicMock()
    choice.message = msg
    response = MagicMock()
    response.choices = [choice]
    return response
