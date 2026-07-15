from typing import Any, Optional
from src.engine import ScenarioNotFoundError
from src.services.scenario_validator import validate_scenario_for_submission


class ScenarioService:

    @staticmethod
    def get_list(engine, domain: Optional[str] = None, level: Optional[str] = None, jonasan_type: Optional[str] = None) -> list[dict[str, Any]]:
        return engine.list_scenarios(domain, level, jonasan_type)

    @staticmethod
    def get_detail(engine, scenario_id: str) -> Optional[dict[str, Any]]:
        try:
            return engine.get_scenario(scenario_id)
        except ScenarioNotFoundError:
            return None

    @staticmethod
    def get_hints(engine, scenario_id: str, reveal_count: Optional[int] = None) -> list[dict[str, Any]]:
        return engine.get_hints(scenario_id, reveal_count)

    @staticmethod
    def get_solutions(engine, scenario_id: str) -> list[dict[str, str]]:
        return engine.get_solutions(scenario_id)

    @staticmethod
    def get_reflection(engine, scenario_id: str) -> Any:
        return engine.get_reflection(scenario_id)

    @staticmethod
    def get_rubric(engine, scenario_id: str) -> Any:
        return engine.get_rubric(scenario_id)

    @staticmethod
    def calculate_rubric_score(scenario_id: str, rubric: dict, learner_response: dict) -> dict:
        """
        Calculate score based on rubric weights.
        Returns dict with breakdown and total score.

        Args:
            rubric: The scoring rubric dict from scenario
            learner_response: Dict containing:
                - theory_score: 0-100
                - code_score: 0-100
                - reflection_score: 0-100
                - theory_justification: str
                - reflection_text: str

        Returns:
            {
                "total": 0-100,
                "breakdown": {
                    "theory": {"score": 0-100, "weight": float, "weighted": 0-100},
                    "code": {"score": 0-100, "weight": float, "weighted": 0-100},
                    "reflection": {"score": 0-100, "weight": float, "weighted": 0-100}
                },
                "grade": "A"|"B"|"C"|"D"|"F",
                "feedback": str
            }
        """
        if not rubric:
            return {
                "total": 0,
                "breakdown": {},
                "grade": "F",
                "feedback": "No rubric available for evaluation."
            }

        weights = rubric.get("weights", {"reasoning": 0.35, "code": 0.40, "reflection": 0.25})

        theory_score = learner_response.get("theory_score", 0)
        code_score = learner_response.get("code_score", 0)
        reflection_score = learner_response.get("reflection_score", 0)

        theory_weight = weights.get("reasoning", 0.35)
        code_weight = weights.get("code", 0.40)
        reflection_weight = weights.get("reflection", 0.25)

        breakdown = {
            "theory": {
                "score": theory_score,
                "weight": theory_weight,
                "weighted": theory_score * theory_weight
            },
            "code": {
                "score": code_score,
                "weight": code_weight,
                "weighted": code_score * code_weight
            },
            "reflection": {
                "score": reflection_score,
                "weight": reflection_weight,
                "weighted": reflection_score * reflection_weight
            }
        }

        total = sum(b["weighted"] for b in breakdown.values())

        if total >= 90:
            grade = "A"
        elif total >= 80:
            grade = "B"
        elif total >= 70:
            grade = "C"
        elif total >= 60:
            grade = "D"
        else:
            grade = "F"

        feedback = _generate_feedback(rubric, breakdown, learner_response)

        return {
            "total": round(total, 2),
            "breakdown": breakdown,
            "grade": grade,
            "feedback": feedback
        }

    @staticmethod
    def validate_scenario_data(data: dict) -> tuple[bool, Optional[str]]:
        is_valid, errors, warnings = validate_scenario_for_submission(data)
        if not is_valid:
            error_messages = [e['message'] for e in errors]
            return False, "; ".join(error_messages)
        return True, None

    @staticmethod
    def build_scenario_summary(engine, scenario_id: str) -> Optional[dict]:
        detail = ScenarioService.get_detail(engine, scenario_id)
        if not detail:
            return None
        return {
            "id": detail.get("id"),
            "title": detail.get("title"),
            "domain": detail.get("domain"),
            "pythonConcept": detail.get("pythonConcept"),
            "difficultyLevel": detail.get("difficultyLevel"),
            "jonasanType": detail.get("jonasanType"),
        }


def _generate_feedback(rubric: dict, breakdown: dict, learner_response: dict) -> str:
    parts = []

    theory_justification = learner_response.get("theory_justification", "")
    reflection_text = learner_response.get("reflection_text", "")

    if breakdown.get("theory", {}).get("score", 0) >= 80:
        parts.append("Excellent reasoning and articulation of the theoretical concepts.")
    elif breakdown.get("theory", {}).get("score", 0) >= 60:
        parts.append("Good understanding shown, but could benefit from deeper analysis.")
    else:
        parts.append("Consider revisiting the theoretical foundations to strengthen your understanding.")

    if breakdown.get("code", {}).get("score", 0) >= 80:
        parts.append("Code implementation demonstrates strong grasp of the concepts.")
    elif breakdown.get("code", {}).get("score", 0) >= 60:
        parts.append("Code works but could be improved for efficiency and clarity.")
    else:
        parts.append("Review the reference solutions to understand alternative approaches.")

    if breakdown.get("reflection", {}).get("score", 0) >= 80:
        parts.append("Thoughtful reflection showing deep engagement with the philosophical dimensions.")
    elif breakdown.get("reflection", {}).get("score", 0) >= 60:
        parts.append("Good reflection, but consider exploring more diverse perspectives.")
    else:
        parts.append("Your reflection could explore the broader implications and connections more.")

    return " ".join(parts)