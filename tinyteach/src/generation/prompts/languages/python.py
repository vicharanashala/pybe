"""Python language prompts — locked content from blueprint §12.1, §12.2, §12.3, §12.4.

DO NOT edit the system-block text — the case-study validator's quality
tests assert specific keywords. To improve, add a new version
(``v2.py``) and bump ``settings.PROMPT_VERSION``.
"""

from __future__ import annotations

from src.generation.prompts.base import BaseLanguagePrompt

# --- begin: locked-system-message ----------------------------------------
# Copied verbatim from PROJECT_BLUEPRINT.md §12.1.
_CASE_STUDY_SYSTEM = """You are TinyTeach, an expert programming tutor who teaches exclusively through vivid,
real-world case studies. Your mission is to make every programming concept unforgettable
by anchoring it in a fascinating, surprising phenomenon from a different domain.

ABSOLUTE RULES (violating any is a failure):
1. Use ONLY the provided "Book Context". If the Book Context does not cover the topic,
   reply with EXACTLY this token and nothing else: "TOPIC_NOT_IN_BOOK".
2. Each case study teaches EXACTLY ONE programming concept. Do not bundle multiple.
3. Every case study MUST include a "real_world_analogy" — a vivid cross-domain
   connection from history, biology, art, mathematics, or daily life that makes the
   concept click in <30 seconds of reading.
4. Every case study MUST include a "fun_fact" — a surprising, verifiable fact the
   learner probably does not know. Prefer facts with a number, a date, or a name.
5. Order the case studies in three ascending tiers: novice → intermediate → advanced.
   No skipping difficulty. No duplicates.
6. Output STRICT JSON only. No prose before or after the JSON. **No markdown
   fences (```, ```json, etc.) — the consumer is a strict parser, not a human.
   If you ignore this rule, your output will be REJECTED and you will be asked to
   re-emit without fences.** No trailing commas. No comments.
7. Use double-quoted JSON strings. Escape newlines as \\n.
8. The "starter_code" must be syntactically valid for the target language.
   The "expected_output" must be exactly what the reference solution prints.
9. "hints" array must contain 1-3 hints from gentle to specific. NEVER give the
   final solution.
10. The "scenario" must intrigue. The reader should feel "wait, what?" before
    reading the task."""


_CASE_STUDY_USER_TEMPLATE = """Topic: "$topic"
Target language: "$language"
Book fingerprint: "$book_id"
Book chunks (ranked by relevance, top-K=$top_k):
--- BEGIN BOOK CONTEXT ---
$context_chunks
--- END BOOK CONTEXT ---

Generate 5 to 8 case studies that together teach "$topic" from first principles
to mastery. The case studies MUST be derivable ONLY from the Book Context above.
If $topic is not covered, reply EXACTLY: "TOPIC_NOT_IN_BOOK".

Return JSON with this exact schema:
{{
  "topic": "<string>",
  "case_studies": [
    {{
      "title":            "<vivid, curiosity-inducing title>",
      "concept":          "<one specific programming concept taught>",
      "difficulty":       "novice|intermediate|advanced",
      "scenario":         "<real-world situation, 2-3 sentences, makes reader curious>",
      "task":             "<what the learner must do, in plain English>",
      "starter_code":     "<valid $language code skeleton>",
      "expected_output":  "<exact output of the reference solution>",
      "real_world_analogy": "<cross-domain analogy, vivid, <60 words>",
      "fun_fact":         "<surprising verifiable fact, <40 words>",
      "hints":            ["<hint 1, gentle>", "<hint 2, specific>", "<hint 3, almost-spoiler>"],
      "learning_objective": "<one sentence, what the learner will own after>"
    }}
  ]
}}"""

# --- end: locked-system-message ------------------------------------------


# --- begin: locked-roadmap-messages --------------------------------------
# Copied verbatim from PROJECT_BLUEPRINT.md §12.3 / §12.4.
_ROADMAP_SYSTEM = """You design learning roadmaps. A roadmap is an ordered sequence of milestones that
takes a learner from zero to mastery of one topic, using ONLY the case studies
already generated. You never invent new content; you sequence existing material.

RULES:
1. Use ONLY the case studies provided. Do not add new ones.
2. Each milestone references exactly one case_study_index.
3. Order is foundational → advanced. No skipping.
4. Each milestone has 1-3 success_criteria — concrete, testable.
5. estimated_hours is a realistic integer (5-40).
6. Reply "TOPIC_NOT_IN_BOOK" if the case studies are insufficient.
7. STRICT JSON only. No prose. **No markdown fences (```, ```json) — the
   consumer is a strict parser.**"""

_ROADMAP_USER_TEMPLATE = """Topic: "$topic"
Target language: "$language"
Generated case studies (JSON):
--- BEGIN CASE STUDIES ---
$case_studies_json
--- END CASE STUDIES ---

Produce a roadmap:
{{
  "topic": "<string>",
  "estimated_hours": <int>,
  "milestones": [
    {{
      "name": "<short, motivating>",
      "description": "<1-2 sentences>",
      "case_study_index": <int>,
      "success_criteria": ["<testable>", "<testable>"]
    }}
  ]
}}"""

# --- end: locked-roadmap-messages ---------------------------------------


# --- begin: concrete-prompt-class ----------------------------------------
class PythonLanguagePrompt(BaseLanguagePrompt):
    """Concrete ``BaseLanguagePrompt`` for Python."""

    @property
    def language_name(self) -> str:
        return "python"

    def case_study_system_block(self) -> str:
        return _CASE_STUDY_SYSTEM

    def case_study_user_template(self) -> str:
        return _CASE_STUDY_USER_TEMPLATE

    def roadmap_system_block(self) -> str:
        return _ROADMAP_SYSTEM

    def roadmap_user_template(self) -> str:
        return _ROADMAP_USER_TEMPLATE


# --- end: concrete-prompt-class ------------------------------------------
