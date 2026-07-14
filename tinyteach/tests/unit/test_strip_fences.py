"""Tests for ``src.utils.strip_fences``."""

from __future__ import annotations

import pytest
from src.utils.strip_fences import extract_json_object, strip_markdown_fences


# --- begin: strip_markdown_fences ----------------------------------------
def test_strip_simple_json_fence() -> None:
    text = '```json\n{"a": 1}\n```'
    assert strip_markdown_fences(text) == '{"a": 1}'


def test_strip_python_fence() -> None:
    text = "```python\nprint('x')\n```"
    assert strip_markdown_fences(text) == "print('x')"


def test_strip_bare_fence_no_language() -> None:
    text = "```\nhello\n```"
    assert strip_markdown_fences(text) == "hello"


def test_strip_strips_leading_and_trailing_whitespace() -> None:
    text = '   \n  ```json\n{"a":1}\n```   \n'
    assert strip_markdown_fences(text) == '{"a":1}'


def test_strip_returns_unchanged_when_no_fence() -> None:
    text = '{"a": 1}'
    assert strip_markdown_fences(text) == '{"a": 1}'


def test_strip_returns_inner_whitespace_trimmed_when_no_fence() -> None:
    """Plain text is trimmed but otherwise unchanged."""
    text = '   {"a": 1}   '
    assert strip_markdown_fences(text) == '{"a": 1}'


def test_strip_keeps_nested_fences_as_input_unchanged() -> None:
    """If the body itself contains a fence (unbalanced), bail and return input."""
    text = "```\n```nested\n```"
    # The outer fence's body is "```nested"; we detect that and bail.
    assert strip_markdown_fences(text).startswith("```")


def test_strip_rejects_none() -> None:
    with pytest.raises(TypeError):
        strip_markdown_fences(None)  # type: ignore[arg-type]


# --- end: strip_markdown_fences -------------------------------------------


# --- begin: extract_json_object -------------------------------------------
def test_extracts_pure_json() -> None:
    assert extract_json_object('{"a": 1, "b": "hi"}') == {"a": 1, "b": "hi"}


def test_extracts_fenced_json() -> None:
    text = '```json\n{"a": 2}\n```'
    assert extract_json_object(text) == {"a": 2}


def test_extracts_json_from_prose_prefix() -> None:
    """An LLM sometimes writes 'Sure! Here is the JSON: {...}'."""
    text = 'Sure, here you go:\n{"x": 1, "y": [1, 2, 3]}'
    assert extract_json_object(text) == {"x": 1, "y": [1, 2, 3]}


def test_extracts_json_with_nested_braces() -> None:
    text = '{"outer": {"inner": {"deep": 42}}}'
    assert extract_json_object(text) == {"outer": {"inner": {"deep": 42}}}


def test_extracts_json_with_string_containing_braces() -> None:
    """Strings may contain { } — the brace-counter must respect that."""
    text = '{"msg": "hello {world}", "k": 1}'
    assert extract_json_object(text) == {"msg": "hello {world}", "k": 1}


def test_extracts_json_with_escaped_quotes_in_string() -> None:
    text = '{"msg": "He said \\"hi {nested}\\"", "k": 2}'
    assert extract_json_object(text) == {"msg": 'He said "hi {nested}"', "k": 2}


def test_raises_when_no_object_found() -> None:
    with pytest.raises(ValueError, match="No JSON object found"):
        extract_json_object("Just a prose answer, no JSON.")


def test_raises_on_unbalanced_braces() -> None:
    with pytest.raises(ValueError, match="Unbalanced JSON braces"):
        extract_json_object('{"a": 1, "b": {')


def test_raises_on_top_level_array() -> None:
    """Arrays are out of scope; the helper looks only for objects."""
    with pytest.raises(ValueError, match="No JSON object found"):
        extract_json_object("[1, 2, 3]")


def test_raises_on_invalid_json() -> None:
    with pytest.raises(ValueError, match="not valid JSON"):
        extract_json_object('{"a": not_valid}')


def test_error_message_includes_first_200_chars() -> None:
    long_prose = "x" * 500
    with pytest.raises(ValueError) as exc:
        extract_json_object(long_prose)
    # The message embeds ``First 200 chars: `` followed by the snippet.
    msg = str(exc.value)
    snippet_start = msg.index("First 200 chars: ") + len("First 200 chars: ")
    snippet = msg[snippet_start : snippet_start + 5]
    # The snippet starts with a quote (repr), then 4 'x' chars (since
    # the actual snippet is 200 'x's wrapped in quotes).
    assert snippet[1:] == "xxxx"


# --- end: extract_json_object --------------------------------------------
