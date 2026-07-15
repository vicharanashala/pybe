import json
import os
import re
from datetime import datetime


class PromptBuilder:
    """
    Builds structured prompts for AI code evaluation.
    Follows the 4-pillar pyBE framework for feedback.

    B1 Spec Architecture:
    - System prompt tells AI the scenario's target constructs, theoretical anchor,
      scoring rubric, and common misconceptions to watch for
    - AI responds with structured JSON: scores by pillar, misconceptions, feedback by pillar,
      next step suggestion, and a genuine praise point
    - Hint system uses Socratic method - never gives answers, only asks questions
    """

    USE_AI_EVALUATION = os.environ.get('USE_AI_EVALUATION', 'true').lower() == 'true'

    @staticmethod
    def build_evaluator_prompt(scenario_data: dict, learner_code: str, learner_reasoning: str = "") -> dict:
        """
        Build the system prompt for evaluating a learner's code submission.

        B1 Spec: The AI evaluator needs a structured system prompt that tells the model:
        1. The scenario's expected Python construct (from scenario.json)
        2. The theoretical anchor (so AI knows the domain context)
        3. The scoring rubric (Theory 40%, Code 30%, Reflection 30%)
        4. What "good reasoning" looks like for this scenario
        5. What misconceptions to watch for

        Args:
            scenario_data: Full scenario object from engine.get_scenario()
            learner_code: The Python code the learner wrote
            learner_reasoning: Optional reasoning text from the learner

        Returns:
            dict with 'system' and 'user' keys for API call
        """
        target_constructs = scenario_data.get('targetConstructs', [])
        theory_pillar = scenario_data.get('theoryPillar', scenario_data.get('theoryPillar', ''))
        anchor_pillar = scenario_data.get('anchorPillar', scenario_data.get('anchorPillar', ''))
        trigger_pillar = scenario_data.get('triggerPillar', '')
        python_concept = scenario_data.get('pythonConcept', '')
        domain = scenario_data.get('domain', 'General')
        title = scenario_data.get('title', 'Unknown')

        rubric = scenario_data.get('scoringRubric', {})
        if not rubric:
            rubric = {'reasoning': 40, 'code': 30, 'reflection': 30}

        common_misconceptions = scenario_data.get('commonMisconceptions', [])
        misconceptions_text = json.dumps(common_misconceptions) if common_misconceptions else "[]"

        system_prompt = f"""You are a pyBE learning evaluator. You evaluate learner responses for the scenario: "{title}".

Target Python construct: {python_concept}
Domain anchor: {anchor_pillar[:200] if anchor_pillar else 'General programming'}

SCORING RUBRIC:
- Reasoning quality (0-{rubric.get('reasoning', 40)}%): Did the learner explain WHY they chose this construct?
- Code correctness (0-{rubric.get('code', 30)}%): Is the implementation correct and idiomatic?
- Reflection depth (0-{rubric.get('reflection', 30)}%): Did the learner connect the solution to the domain anchor?

EVALUATION CRITERIA:
1. Does the code correctly solve the stated problem in the trigger?
2. Does it use the target Python constructs appropriately?
3. Is the solution idiomatic and well-structured?
4. Does the approach show engagement with the philosophical/theme connection?
5. Is error handling appropriate for the scenario?

Common misconceptions to watch for: {misconceptions_text}

WHAT "GOOD REASONING" LOOKS LIKE FOR THIS SCENARIO:
- The learner connects the Python construct to the scenario's domain (e.g., Buddhist impermanence → context managers)
- The learner shows understanding of WHY the construct is appropriate, not just HOW to use it
- The learner's reflection demonstrates they explored the philosophical implications

IMPORTANT GUIDELINES:
- Be encouraging and specific in feedback
- Connect technical observations to the scenario theme when relevant
- Praise genuine insight, not just "correct" answers
- Identify misconceptions precisely so learner can address them
- Suggest concrete next steps when score < 70

Respond ONLY in this JSON format (no other text):
{{
  "scores": {{ "reasoning": 0-{rubric.get('reasoning', 40)}, "code": 0-{rubric.get('code', 30)}, "reflection": 0-{rubric.get('reflection', 30)} }},
  "totalScore": 0-100,
  "misconceptionsDetected": ["<list of misconceptions detected, or empty list>"],
  "feedbackByPillar": {{
    "reasoning": "<specific feedback on their reasoning approach>",
    "code": "<specific feedback on their code quality and construct usage>",
    "reflection": "<specific feedback on their reflection depth>"
  }},
  "nextStepSuggestion": "<what to explore next, be specific and actionable>",
  "praisePoint": "<one genuine specific thing they did well>"
}}"""

        user_prompt = f"""Learner's response to the scenario:

Code:
```python
{learner_code}
```"""

        if learner_reasoning:
            user_prompt += f"""

Learner's Reasoning:
{learner_reasoning}
"""

        user_prompt += f"""

Evaluate this submission for the scenario: "{title}"
Return your evaluation as JSON in the specified format."""

        return {
            "system": system_prompt,
            "user": user_prompt
        }

    @staticmethod
    def build_hint_prompt(scenario_data: dict, current_attempt: str, hints_given: list) -> dict:
        """
        Build a Socratic hint prompt - NEVER gives the answer.

        B1 Spec: When a learner clicks "Get a Hint," the AI doesn't give a generic
        hint it reads what the learner has written so far and gives a contextual nudge.
        Never give the answer. Ask a question that nudges the learner one step closer.
        """
        target_constructs = scenario_data.get('targetConstructs', [])
        scenario_title = scenario_data.get('title', 'Unknown')
        python_concept = scenario_data.get('pythonConcept', '')
        domain = scenario_data.get('domain', 'General')
        theory_pillar = scenario_data.get('theoryPillar', '')
        trigger_pillar = scenario_data.get('triggerPillar', '')

        hints_already_given = "\n- ".join(hints_given) if hints_given else "None yet"

        system_prompt = f"""You are a Socratic tutor for the pyBE scenario: "{scenario_title}".

SCENARIO CONTEXT:
- Domain: {domain}
- Python Concept being taught: {python_concept}
- Philosophical theme: {theory_pillar[:200] if theory_pillar else 'Programming fundamentals'}

PRACTICAL CHALLENGE (what they're trying to solve):
{trigger_pillar[:300] if trigger_pillar else 'Complete the programming challenge'}

Target constructs to discover: {', '.join(target_constructs[:5]) if target_constructs else 'the solution'}

YOUR Socratic METHOD (follow strictly):
1. NEVER give the answer directly ask questions, don't provide solutions
2. Ask ONE focused question that nudges the learner one step closer to discovery
3. Connect your question to the scenario's theme when appropriate
4. Be warm and encouraging learning is hard, acknowledge their effort
5. If the learner has written almost no code, give a slightly more specific nudge
6. NEVER repeat hints that have already been given
7. Phrase your hint as a question ending with "?"

PREVIOUS HINTS GIVEN (do NOT repeat these):
- {hints_already_given}

Respond in this exact JSON format (no other text):
{{
  "hint": "<ONE Socratic question, max 40 words, MUST end with a question mark>",
  "encouragement": "<1 sentence of genuine encouragement>"
}}"""

        user_prompt = f"""The learner has written:
```python
{current_attempt if current_attempt.strip() else "(no code written yet)"}
```

They are stuck. Give them ONE Socratic question (not an answer) that nudges them toward discovering: {target_constructs[0] if target_constructs else 'the solution approach'}."""

        return {
            "system": system_prompt,
            "user": user_prompt
        }

    @staticmethod
    def build_reflection_prompt(scenario_data: dict, learner_code: str, evaluation_result: dict) -> dict:
        """
        Build a prompt for post-evaluation reflection questions.
        Helps learners think deeper about their solution.
        """
        scenario_title = scenario_data.get('title', 'Unknown')
        domain = scenario_data.get('domain', 'General')
        python_concept = scenario_data.get('pythonConcept', 'Python')
        theory_pillar = scenario_data.get('theoryPillar', '')

        system_prompt = f"""You are a thoughtful learning companion for pyBE, a philosophical Python learning platform.

After a learner completes the scenario "{scenario_title}", you help them reflect on their learning.

SCENARIO DETAILS:
- Domain: {domain}
- Python Concept: {python_concept}
- Philosophical Theme: {_truncate(theory_pillar, 150)}

The learner scored {evaluation_result.get('totalScore', evaluation_result.get('score', 0))}/100 on their code.

Your role is to ask 2-3 deep, reflective questions that:
1. Connect the technical solution to the philosophical theme
2. Encourage meta-cognition about their learning process
3. Suggest real-world applications or extensions

Be warm, encouraging, and genuinely curious about their thinking.
Avoid yes/no questions - prefer open-ended "how" and "why" questions.

Respond in this exact JSON format:
{{
  "questions": [
    "<question 1 - open ended, about the philosophical/technical connection>",
    "<question 2 - about their learning process or approach>",
    "<question 3 - about real-world application or extension>"
  ],
  "encouragement": "<1 sentence of positive reinforcement based on their score>"
}}"""

        user_prompt = f"""Their code was:
```python
{learner_code}
```

Their evaluation feedback was: {str(evaluation_result.get('feedbackByPillar', evaluation_result.get('feedback', 'No feedback provided')))}

Generate 2-3 reflection questions and an encouragement message."""

        return {
            "system": system_prompt,
            "user": user_prompt
        }


def _truncate(text: str, max_length: int) -> str:
    """Truncate text to max_length, adding ellipsis if needed."""
    if not text:
        return "(not specified)"
    text = text.strip()
    if len(text) <= max_length:
        return text
    return text[:max_length].rsplit(' ', 1)[0] + '...'


def parse_ai_response(raw_response: str) -> dict:
    """
    Extract and parse JSON from AI response, with robust fallback handling.

    B1 Spec: Supports the new response format with scores (nested),
    feedbackByPillar, misconceptionsDetected, nextStepSuggestion, praisePoint.

    Tries multiple parsing strategies:
    1. Direct JSON parse
    2. Extract JSON from markdown code blocks
    3. Extract JSON object with regex
    4. Final fallback with partial extraction
    """
    if not raw_response:
        return _empty_response()

    try:
        result = json.loads(raw_response)
        return _normalize_response(result)
    except json.JSONDecodeError:
        pass

    try:
        match = re.search(r'```(?:json)?\s*(\{[\s\S]*?\})\s*```', raw_response, re.DOTALL | re.IGNORECASE)
        if match:
            result = json.loads(match.group(1))
            return _normalize_response(result)
    except (json.JSONDecodeError, re.error):
        pass

    try:
        json_match = re.search(r'\{[\s\S]*?"scores"[\s\S]*?\}', raw_response, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            if 'scores' in result or 'totalScore' in result:
                return _normalize_response(result)
    except (json.JSONDecodeError, re.error):
        pass

    score_match = re.search(r'"totalScore"\s*:\s*(\d+)', raw_response)
    scores_match = re.search(r'"scores"\s*:\s*(\{[^}]+\})', raw_response)
    praise_match = re.search(r'"praisePoint"\s*:\s*"([^"]+)"', raw_response)

    if score_match or scores_match:
        result = {
            "scores": {"reasoning": 50, "code": 50, "reflection": 50},
            "totalScore": int(score_match.group(1)) if score_match else 50,
            "misconceptionsDetected": [],
            "feedbackByPillar": {
                "reasoning": "Unable to parse detailed feedback.",
                "code": "Code evaluation available.",
                "reflection": "Reflection captured."
            },
            "nextStepSuggestion": "Continue exploring the scenario.",
            "praisePoint": praise_match.group(1) if praise_match else "Thank you for your submission."
        }
        if scores_match:
            try:
                result["scores"] = json.loads(scores_match.group(1))
            except json.JSONDecodeError:
                pass
        return result

    return {
        "scores": {"reasoning": 50, "code": 50, "reflection": 50},
        "totalScore": 50,
        "feedback": raw_response[:500] if len(raw_response) > 500 else raw_response,
        "misconceptionsDetected": [],
        "feedbackByPillar": {
            "reasoning": "Feedback parsing failed.",
            "code": "Code parsing failed.",
            "reflection": "Reflection parsing failed."
        },
        "nextStepSuggestion": "Review your code and try again.",
        "praisePoint": "Thank you for your submission.",
        "error": "parse_failed"
    }


def _normalize_response(result: dict) -> dict:
    """
    Normalize AI response to a consistent format.

    Handles both B1 spec format (scores, totalScore, feedbackByPillar) and
    legacy format (score, breakdown, feedback).
    """
    if not isinstance(result, dict):
        return _empty_response()

    normalized = {
        "scores": {"reasoning": 50, "code": 50, "reflection": 50},
        "totalScore": 50,
        "misconceptionsDetected": [],
        "feedbackByPillar": {
            "reasoning": "No reasoning feedback available.",
            "code": "No code feedback available.",
            "reflection": "No reflection feedback available."
        },
        "nextStepSuggestion": "Continue exploring the scenario.",
        "praisePoint": "Thank you for your submission.",
        "constructs_demonstrated": [],
    }

    if 'scores' in result:
        scores = result['scores']
        if isinstance(scores, dict):
            normalized['scores'] = {
                'reasoning': scores.get('reasoning', 50),
                'code': scores.get('code', 50),
                'reflection': scores.get('reflection', 50)
            }
        elif isinstance(scores, list):
            if len(scores) >= 3:
                normalized['scores'] = {
                    'reasoning': scores[0] if isinstance(scores[0], (int, float)) else 50,
                    'code': scores[1] if isinstance(scores[1], (int, float)) else 50,
                    'reflection': scores[2] if isinstance(scores[2], (int, float)) else 50
                }

    normalized['totalScore'] = result.get('totalScore', result.get('score', 50))

    if 'totalScore' in result:
        normalized['totalScore'] = result['totalScore']
    elif 'score' in result:
        normalized['totalScore'] = result['score']

    normalized['misconceptionsDetected'] = result.get('misconceptionsDetected', result.get('misconceptions', []))

    if 'feedbackByPillar' in result:
        fbp = result['feedbackByPillar']
        if isinstance(fbp, dict):
            normalized['feedbackByPillar'] = {
                'reasoning': fbp.get('reasoning', 'No reasoning feedback.'),
                'code': fbp.get('code', 'No code feedback.'),
                'reflection': fbp.get('reflection', 'No reflection feedback.')
            }
    elif 'feedback' in result:
        normalized['feedbackByPillar'] = {
            'reasoning': str(result['feedback']),
            'code': str(result['feedback']),
            'reflection': str(result['feedback'])
        }

    normalized['nextStepSuggestion'] = result.get('nextStepSuggestion', result.get('next_step', ''))
    normalized['praisePoint'] = result.get('praisePoint', 'Good work on this submission!')
    normalized['constructs_demonstrated'] = result.get('constructs_demonstrated', result.get('constructs', []))
    normalized['error'] = result.get('error')

    return normalized


def _empty_response() -> dict:
    """Return a default empty response."""
    return {
        "scores": {"reasoning": 50, "code": 50, "reflection": 50},
        "totalScore": 50,
        "misconceptionsDetected": [],
        "feedbackByPillar": {
            "reasoning": "No response from AI evaluator.",
            "code": "No code feedback available.",
            "reflection": "No reflection available."
        },
        "nextStepSuggestion": "Try running your code.",
        "praisePoint": "Thank you for your submission.",
        "constructs_demonstrated": [],
        "error": "empty_response"
    }