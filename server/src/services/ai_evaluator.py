import os
import time
import json
from typing import Generator, Tuple, Iterator, Any, Dict
from dataclasses import dataclass
from enum import Enum

from .prompt_builder import PromptBuilder, parse_ai_response


class StreamEventType(Enum):
    STATUS = "status"
    BREAKDOWN = "breakdown"
    FEEDBACK_CHUNK = "feedback_chunk"
    COMPLETE = "complete"
    ERROR = "error"


@dataclass
class StreamEvent:
    event_type: StreamEventType
    data: Dict[str, Any]


class AIEvaluator:
    """
    AI-powered code evaluation for pyBE.

    B1 Spec Implementation:
    - Uses OpenAI API for dynamic, contextual feedback
    - Falls back to mock evaluation when no API key is available
    - Feature flag USE_AI_EVALUATION=false forces mock mode
    - Supports streaming responses for real-time feedback
    - Socratic hint system generates contextual hints via AI
    """

    def __init__(self):
        self.groq_api_key = os.environ.get('GROQ_API_KEY')
        self.groq_model = os.environ.get('GROQ_MODEL', 'llama-3.3-70b-versatile')
        self.groq_api_base = os.environ.get('GROQ_API_BASE', 'https://api.groq.com/openai/v1')

        self.openai_api_key = os.environ.get('OPENAI_API_KEY')
        self.openai_model = os.environ.get('OPENAI_MODEL', 'gpt-4o')
        self.openai_api_base = os.environ.get('OPENAI_API_BASE', 'https://api.openai.com/v1')

        self.use_mock = (
            (not self.groq_api_key and not self.openai_api_key)
            or os.environ.get('USE_AI_EVALUATION', 'true').lower() == 'false'
        )

    def _get_client_config(self):
        """Returns (api_key, base_url, model) preferring Groq over OpenAI."""
        if self.groq_api_key:
            return self.groq_api_key, self.groq_api_base, self.groq_model
        return self.openai_api_key, self.openai_api_base, self.openai_model

    def evaluate(self, code: str, scenario_data: dict, stream: bool = False, reasoning: str = "") -> Tuple:
        """
        Evaluate learner code against a scenario.

        B1 Spec Args:
            code: Learner's Python code
            scenario_data: Full scenario object with targetConstructs, theoryPillar,
                          anchorPillar, triggerPillar, scoringRubric, commonMisconceptions
            stream: Whether to return a streaming generator
            reasoning: Optional reasoning text about approach

        B1 Spec Returns:
            Tuple of (streaming generator or dict result, score)
            Result dict contains: scores, totalScore, misconceptionsDetected,
            feedbackByPillar, nextStepSuggestion, praisePoint, constructs_demonstrated
        """
        if self.use_mock:
            return self._mock_evaluate(code, stream)

        try:
            prompt_data = PromptBuilder.build_evaluator_prompt(scenario_data, code, reasoning)

            if stream:
                return self._stream_openai(prompt_data), None
            else:
                return self._call_openai(prompt_data)
        except Exception:
            return self._mock_evaluate(code, stream)

    def get_hint(self, scenario_data: dict, current_attempt: str, hints_given: list) -> dict:
        """
        Get a Socratic hint for the learner.

        B1 Spec: When API key is available, generates AI-powered contextual hints
        that read what the learner has written and ask ONE Socratic question.
        Never gives the answer. Falls back to mock hints when no API key.

        Args:
            scenario_data: Full scenario object
            current_attempt: The learner's current code
            hints_given: List of previous hint texts (to avoid repetition)

        Returns:
            dict with 'hint' (Socratic question) and 'encouragement'
        """
        if self.use_mock:
            return self._mock_hint(current_attempt)

        try:
            prompt_data = PromptBuilder.build_hint_prompt(
                scenario_data, current_attempt, hints_given
            )
            result = self._call_openai(prompt_data)

            if isinstance(result, tuple):
                response, _ = result
                hint_text = response.get("hint", "Think about what the problem is really asking.")
                encouragement = response.get("encouragement", "You're on the right track!")
            else:
                hint_text = response.get("hint", "Think about what the problem is really asking.")
                encouragement = response.get("encouragement", "You're on the right track!")

            return {
                "hint": hint_text,
                "encouragement": encouragement
            }
        except Exception:
            return self._mock_hint(current_attempt)

    def _call_openai(self, prompt_data: dict) -> Tuple[Dict[str, Any], int]:
        """Make a non-streaming OpenAI-compatible API call (supports Groq and OpenAI)."""
        try:
            from openai import OpenAI
        except ImportError:
            return self._mock_evaluate("", False)[0], 50

        api_key, api_base, model = self._get_client_config()
        client = OpenAI(api_key=api_key, base_url=api_base)

        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": prompt_data["system"]},
                    {"role": "user", "content": prompt_data["user"]}
                ],
                temperature=0.3,
                max_tokens=1500
            )

            raw = response.choices[0].message.content
            result = parse_ai_response(raw)

            if result.get('error') == 'parse_failed':
                return result, 50

            total_score = result.get('totalScore', 50)
            return result, total_score

        except Exception as e:
            return {
                "error": str(e),
                "scores": {"reasoning": 50, "code": 50, "reflection": 50},
                "totalScore": 50,
                "feedback": f"API call failed: {str(e)}",
                "feedbackByPillar": {
                    "reasoning": "Evaluation unavailable.",
                    "code": "Code evaluation unavailable.",
                    "reflection": "Reflection unavailable."
                },
                "constructs_demonstrated": [],
                "misconceptionsDetected": [],
                "nextStepSuggestion": "Check your API configuration.",
                "praisePoint": "Thank you for your submission."
            }, 50

    def _stream_openai(self, prompt_data: dict) -> Generator[StreamEvent, None, None]:
        """
        Stream OpenAI-compatible response token by token, yielding structured events.
        Supports Groq and OpenAI APIs.

        B1 Spec: Yields structured events for real-time UI updates:
        - BREAKDOWN: Scores by pillar (reasoning, code, reflection)
        - FEEDBACK_CHUNK: Token-by-token feedback text
        - COMPLETE: Final result with scores, misconceptions, next step, praise
        """
        try:
            from openai import OpenAI
        except ImportError:
            yield from self._mock_stream_generator()
            return

        api_key, api_base, model = self._get_client_config()
        client = OpenAI(api_key=api_key, base_url=api_base)

        try:
            stream = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": prompt_data["system"]},
                    {"role": "user", "content": prompt_data["user"]}
                ],
                temperature=0.3,
                max_tokens=1500,
                stream=True
            )

            full_content = ""
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    token = chunk.choices[0].delta.content
                    full_content += token
                    yield StreamEvent(
                        event_type=StreamEventType.FEEDBACK_CHUNK,
                        data={"chunk": token}
                    )

            parsed = parse_ai_response(full_content)
            scores = parsed.get("scores", {"reasoning": 50, "code": 50, "reflection": 50})
            total_score = parsed.get("totalScore", 50)

            yield StreamEvent(
                event_type=StreamEventType.BREAKDOWN,
                data={
                    "reasoning": scores.get("reasoning", 50),
                    "code": scores.get("code", 50),
                    "reflection": scores.get("reflection", 50)
                }
            )

            feedback_by_pillar = parsed.get("feedbackByPillar", {})
            combined_feedback = _format_feedback_by_pillar(feedback_by_pillar)

            yield StreamEvent(
                event_type=StreamEventType.COMPLETE,
                data={
                    "score": total_score,
                    "scores": scores,
                    "feedback": combined_feedback,
                    "feedbackByPillar": feedback_by_pillar,
                    "next_step": parsed.get("nextStepSuggestion", ""),
                    "constructs": parsed.get("constructs_demonstrated", []),
                    "misconceptions": parsed.get("misconceptionsDetected", []),
                    "praisePoint": parsed.get("praisePoint", "Good work!")
                }
            )

        except Exception as e:
            yield StreamEvent(
                event_type=StreamEventType.ERROR,
                data={"error": str(e)}
            )

    def _stream_hint_openai(self, prompt_data: dict) -> Generator[StreamEvent, None, None]:
        """Stream hint response from OpenAI-compatible API (Groq or OpenAI)."""
        try:
            from openai import OpenAI
        except ImportError:
            mock = self._mock_hint("")
            yield StreamEvent(
                event_type=StreamEventType.COMPLETE,
                data={"hint": mock["hint"], "encouragement": mock["encouragement"]}
            )
            return

        api_key, api_base, model = self._get_client_config()
        client = OpenAI(api_key=api_key, base_url=api_base)

        try:
            stream = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": prompt_data["system"]},
                    {"role": "user", "content": prompt_data["user"]}
                ],
                temperature=0.3,
                max_tokens=200,
                stream=True
            )

            full_content = ""
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    token = chunk.choices[0].delta.content
                    full_content += token
                    yield StreamEvent(
                        event_type=StreamEventType.FEEDBACK_CHUNK,
                        data={"chunk": token}
                    )

            parsed = parse_ai_response(full_content)
            yield StreamEvent(
                event_type=StreamEventType.COMPLETE,
                data={
                    "hint": parsed.get("hint", "Think about the problem differently."),
                    "encouragement": parsed.get("encouragement", "Keep exploring!")
                }
            )

        except Exception as e:
            mock = self._mock_hint("")
            yield StreamEvent(
                event_type=StreamEventType.COMPLETE,
                data={"hint": mock["hint"], "encouragement": mock["encouragement"]}
            )

    def _mock_stream_generator(self) -> Generator[StreamEvent, None, None]:
        """Generate mock streaming events for fallback."""
        mock_result = self._mock_evaluate("", False)[0]
        scores = mock_result.get("scores", {})
        breakdown = {
            "reasoning": scores.get("reasoning", 70),
            "code": scores.get("code", 75),
            "reflection": scores.get("reflection", 80)
        }

        yield StreamEvent(
            event_type=StreamEventType.BREAKDOWN,
            data=breakdown
        )

        feedback = mock_result.get("feedback", "")
        feedback_by_pillar = mock_result.get("feedbackByPillar", {})

        combined_feedback = feedback
        if feedback_by_pillar:
            combined_feedback = _format_feedback_by_pillar(feedback_by_pillar)

        for word in combined_feedback.split():
            yield StreamEvent(
                event_type=StreamEventType.FEEDBACK_CHUNK,
                data={"chunk": word + " "}
            )
            time.sleep(0.03)

        yield StreamEvent(
            event_type=StreamEventType.COMPLETE,
            data={
                "score": mock_result.get("totalScore", 75),
                "scores": scores,
                "feedback": combined_feedback,
                "feedbackByPillar": feedback_by_pillar,
                "next_step": mock_result.get("nextStepSuggestion", ""),
                "constructs": mock_result.get("constructs_demonstrated", []),
                "misconceptions": mock_result.get("misconceptionsDetected", []),
                "praisePoint": mock_result.get("praisePoint", "Good work!")
            }
        )

    def _mock_evaluate(self, code: str, stream: bool) -> Tuple:
        """
        Fallback mock evaluation when API key is not available.

        B1 Spec: Returns structured response matching the AI format.
        """
        mock_score = 75.0

        if 'def ' in code or 'class ' in code:
            mock_score = 72.0
        if 'import ' in code:
            mock_score = 78.0
        if 'for ' in code or 'while ' in code:
            mock_score = 70.0
        if len(code) > 200:
            mock_score = 82.0

        mock_breakdown = {
            "scores": {"reasoning": 70, "code": int(mock_score), "reflection": 80},
            "totalScore": mock_score,
            "feedback": "Your code shows good understanding of the concepts. Consider edge cases and error handling. The philosophical connection could be explored further.",
            "feedbackByPillar": {
                "reasoning": "Your reasoning demonstrates engagement with the scenario's theme. Consider exploring how the philosophical anchor connects to the implementation.",
                "code": "The code structure is sound. Look for opportunities to make it more idiomatic and handle edge cases gracefully.",
                "reflection": "Good reflection on the solution approach. Try connecting your technical choices to the domain-specific context more explicitly."
            },
            "constructs_demonstrated": _extract_constructs_mock(code),
            "misconceptionsDetected": [],
            "nextStepSuggestion": "Consider how your solution connects to the philosophical theme of the scenario.",
            "praisePoint": "Your submission demonstrates thoughtful engagement with the scenario's interdisciplinary nature."
        }

        if stream:
            def generate():
                yield StreamEvent(
                    event_type=StreamEventType.BREAKDOWN,
                    data={
                        "reasoning": mock_breakdown["scores"]["reasoning"],
                        "code": mock_breakdown["scores"]["code"],
                        "reflection": mock_breakdown["scores"]["reflection"]
                    }
                )

                combined = _format_feedback_by_pillar(mock_breakdown["feedbackByPillar"])
                for word in combined.split():
                    yield StreamEvent(
                        event_type=StreamEventType.FEEDBACK_CHUNK,
                        data={"chunk": word + " "}
                    )
                    time.sleep(0.03)

                yield StreamEvent(
                    event_type=StreamEventType.COMPLETE,
                    data={
                        "score": mock_score,
                        "scores": mock_breakdown["scores"],
                        "feedback": combined,
                        "feedbackByPillar": mock_breakdown["feedbackByPillar"],
                        "next_step": mock_breakdown["nextStepSuggestion"],
                        "constructs": mock_breakdown.get("constructs_demonstrated", []),
                        "misconceptions": mock_breakdown.get("misconceptionsDetected", []),
                        "praisePoint": mock_breakdown["praisePoint"]
                    }
                )

            return generate(), mock_score

        return mock_breakdown, mock_score

    def _mock_hint(self, current_attempt: str) -> dict:
        """
        Fallback mock hint when API key is not available.

        B1 Spec: Returns Socratic-style hint following the spec's format.
        """
        if not current_attempt.strip():
            return {
                "hint": "Start by breaking down the problem into smaller steps. What is the core requirement you're trying to solve?",
                "encouragement": "Every journey begins with a single step!"
            }

        if 'def ' not in current_attempt and 'class ' not in current_attempt:
            return {
                "hint": "Have you considered how you might structure this as a function or class to organize your logic?",
                "encouragement": "Think about organization it makes the solution clearer!"
            }

        if 'for ' not in current_attempt and 'while ' not in current_attempt:
            return {
                "hint": "What repetitive pattern could you automate with a loop to make your code more efficient?",
                "encouragement": "Loops are powerful look for repetition!"
            }

        if 'return' not in current_attempt.lower():
            return {
                "hint": "What should your function give back to its caller? Think about what the result of this computation should be.",
                "encouragement": "Functions are about transformation input becomes output!"
            }

        return {
            "hint": "What happens if you try a different approach to the core logic? How might the philosophical anchor suggest an alternative?",
            "encouragement": "Keep exploring you're close to a breakthrough!"
        }


def _extract_constructs_mock(code: str) -> list:
    """Mock extraction of Python constructs from code."""
    constructs = []
    code_lower = code.lower()

    construct_markers = {
        'import': ['import ', 'from '],
        'function_def': ['def '],
        'class_def': ['class '],
        'for_loop': ['for '],
        'while_loop': ['while '],
        'if_statement': ['if '],
        'try_except': ['try:', 'except'],
        'list_comp': ['[', '] for'],
        'dict_comp': ['{', '} for'],
        'lambda': ['lambda '],
        'with_statement': ['with '],
        'return': ['return '],
        'yield': ['yield '],
        'async': ['async '],
    }

    for construct, markers in construct_markers.items():
        for marker in markers:
            if marker in code_lower:
                construct_name = construct.replace('_', ' ').title()
                if construct_name not in constructs:
                    constructs.append(construct_name)
                break

    return constructs


def _format_feedback_by_pillar(feedback_by_pillar: dict) -> str:
    """Format feedbackByPillar dict into a combined feedback string."""
    if not feedback_by_pillar:
        return ""

    parts = []
    if 'reasoning' in feedback_by_pillar:
        parts.append(f"Reasoning: {feedback_by_pillar['reasoning']}")
    if 'code' in feedback_by_pillar:
        parts.append(f"Code: {feedback_by_pillar['code']}")
    if 'reflection' in feedback_by_pillar:
        parts.append(f"Reflection: {feedback_by_pillar['reflection']}")

    return " | ".join(parts) if parts else str(feedback_by_pillar)