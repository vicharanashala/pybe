r"""Strip markdown code fences from LLM output.

SRP-justification: many small models wrap their JSON in
``\`\`\`json ... \`\`\`` even when told not to. A single, well-tested
helper centralises the cleanup so every caller (validator, tests) sees
identical behaviour.
"""

from __future__ import annotations

import json
import re

# --- begin: regex -------------------------------------------------------
# Matches an optional language tag after the opening fence, then any
# body, then the closing fence. Non-greedy and DOTALL so multi-line
# payloads survive. The whole match is replaced with the captured group.
_FENCE_PATTERN = re.compile(
    r"""^\s*```(?:[a-zA-Z0-9_+\-]*)?\s*\n?(.*?)\n?\s*```\s*$""",
    re.DOTALL,
)
# --- end: regex ---------------------------------------------------------


def strip_markdown_fences(text: str) -> str:
    """Return ``text`` with surrounding ``\\`\\`\\`...\\`\\`\\`` fences removed.

    The function is conservative:
    - If no fence is present, returns the input unchanged.
    - If the inner body itself contains a fence (unbalanced), returns
      the input unchanged — the validator will then surface a JSON
      parse error and the calling site can decide to retry.
    - Strips a leading ``json`` / ``JSON`` / similar language tag.

    Examples
    --------
    >>> strip_markdown_fences("```json\\n{\\"a\\": 1}\\n```")
    '{"a": 1}'
    >>> strip_markdown_fences("{\\"a\\": 1}")
    '{"a": 1}'
    >>> strip_markdown_fences("  hello  ")
    'hello'
    """
    if text is None:
        raise TypeError("strip_markdown_fences requires str input.")
    match = _FENCE_PATTERN.match(text)
    if match is None:
        # Not fenced; just trim whitespace and return.
        return text.strip()
    body = match.group(1)
    # Defensive: if stripping left another fence inside, give up and
    # return the original (the validator will catch it as invalid JSON).
    if "```" in body:
        return text.strip()
    return body.strip()


# --- begin: extract-first-json-object -----------------------------------
def extract_json_object(text: str) -> dict[str, object]:
    """Strip fences, then parse the FIRST balanced JSON object found.

    LLMs occasionally prefix the JSON with prose like "Sure! Here is the
    case study:". We tolerate that by scanning for the first ``{`` and
    attempting to parse from there.

    Raises ``ValueError`` if no parseable JSON object can be found. The
    error message includes the first 200 characters of the input so the
    user can debug the LLM output.
    """
    candidate = strip_markdown_fences(text)
    # Fast path: starts with '{'.
    start = candidate.find("{")
    if start == -1:
        raise ValueError(f"No JSON object found in LLM output. First 200 chars: {text[:200]!r}")
    candidate = candidate[start:]
    # Walk the string counting braces; respect quoted strings.
    depth = 0
    in_string = False
    escape = False
    for i, ch in enumerate(candidate):
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                raw = candidate[: i + 1]
                try:
                    parsed = json.loads(raw)
                except json.JSONDecodeError as exc:
                    raise ValueError(
                        f"LLM output is not valid JSON. "
                        f"First 200 chars: {text[:200]!r}. Parse error: {exc!r}"
                    ) from exc
                if not isinstance(parsed, dict):
                    raise ValueError(
                        f"LLM output JSON is not an object. " f"First 200 chars: {text[:200]!r}"
                    )
                return parsed
    raise ValueError(f"Unbalanced JSON braces in LLM output. First 200 chars: {text[:200]!r}")


# --- end: extract-first-json-object -------------------------------------
