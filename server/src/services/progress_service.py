from datetime import datetime
from src.models import db, Progress, LearningPath
from src.services.spaced_repetition import calculate_sm2
from src.storage import Storage


def _is_mongo():
    try:
        from src.database import is_mongodb
        return is_mongodb()
    except Exception:
        return False


class ProgressService:

    @staticmethod
    def save_progress(user_id: int, scenario_id: str, quality: int,
                      status: str = None, score: int = None,
                      domain: str = None, python_concept: str = None) -> dict:
        """
        Save or update progress for a user on a scenario.
        Applies SM-2 algorithm to calculate next review date.
        """
        if _is_mongo():
            existing = Storage.get_progress(user_id, scenario_id)
            repetition = existing.get('repetition', 0) if existing else 0
            easiness = existing.get('easiness_factor', 2.5) if existing else 2.5
            interval = existing.get('interval', 0) if existing else 0

            sm2_result = calculate_sm2(
                quality,
                repetition,
                easiness,
                interval
            )

            next_review = sm2_result['next_review_date']

            Storage.save_progress(
                user_id=user_id,
                scenario_id=scenario_id,
                repetition=sm2_result['repetitions'],
                interval=sm2_result['interval'],
                easiness_factor=sm2_result['easiness'],
                next_review_date=next_review,
                status=status or ('completed' if quality >= 3 else 'in_progress'),
                score=score or min(100, quality * 20),
                updated_at=datetime.utcnow()
            )

            if domain and python_concept and quality >= 3:
                Storage.create_learning_path(
                    user_id=user_id,
                    scenario_id=scenario_id,
                    domain=domain,
                    python_concept=python_concept,
                    score=score or (quality * 20)
                )

            return {
                "message": "Progress saved",
                "progress": {
                    "repetition": sm2_result['repetitions'],
                    "interval": sm2_result['interval'],
                    "easiness_factor": sm2_result['easiness'],
                    "next_review_date": next_review
                }
            }

        progress = Progress.query.filter_by(
            user_id=user_id,
            scenario_id=scenario_id
        ).first()

        if not progress:
            progress = Progress(user_id=user_id, scenario_id=scenario_id)
            db.session.add(progress)

        sm2_result = calculate_sm2(
            quality,
            progress.repetition or 0,
            progress.easiness_factor or 2.5,
            progress.interval or 0
        )

        progress.repetition = sm2_result['repetitions']
        progress.interval = sm2_result['interval']
        progress.easiness_factor = sm2_result['easiness']
        progress.next_review_date = sm2_result['next_review_date']

        if status is not None:
            progress.status = status
        if score is not None:
            progress.score = score

        progress.updated_at = datetime.utcnow()

        if domain and python_concept and quality >= 3:
            learning_path = LearningPath(
                user_id=user_id,
                scenario_id=scenario_id,
                domain=domain,
                python_concept=python_concept,
                score=score or (quality * 20)
            )
            db.session.add(learning_path)

        db.session.commit()

        return {
            "message": "Progress saved",
            "progress": {
                "repetition": progress.repetition,
                "interval": progress.interval,
                "easiness_factor": progress.easiness_factor,
                "next_review_date": progress.next_review_date
            }
        }

    @staticmethod
    def get_user_progress(user_id: int, engine) -> list[dict]:
        """Get all progress records for a user with scenario metadata."""
        from src.services.user_service import UserService
        return UserService.get_user_progress_records(user_id, engine)

    @staticmethod
    def get_scenario_progress(scenario_id: str) -> list[dict]:
        """Get all progress records for a scenario across all users."""
        if _is_mongo():
            records = Storage.get_progress_for_scenario(scenario_id)
            return [
                {
                    "user_id": r.get("user_id"),
                    "status": r.get("status", "started"),
                    "score": r.get("score"),
                    "repetition": r.get("repetition", 0),
                    "easiness_factor": r.get("easiness_factor", 2.5),
                    "next_review_date": r.get("next_review_date"),
                }
                for r in records
            ]
        records = Progress.query.filter_by(scenario_id=scenario_id).all()
        return [
            {
                "user_id": r.user_id,
                "status": r.status,
                "score": r.score,
                "repetition": r.repetition,
                "easiness_factor": r.easiness_factor,
                "next_review_date": r.next_review_date.isoformat() if r.next_review_date else None,
            }
            for r in records
        ]

    @staticmethod
    def get_due_for_review(user_id: int) -> list[dict]:
        """Get all scenarios due for review for a user."""
        from src.services.user_service import UserService
        from src.engine import ScenarioEngine

        if _is_mongo():
            records = Storage.get_due_progress(user_id, datetime.utcnow())
            engine = ProgressService._get_engine()
            if not engine:
                return []
            scenario_map = {s['id']: s for s in engine.list_scenarios()}
            result = []
            for p in records:
                scenario = scenario_map.get(p.get("scenario_id", ""), {})
                result.append({
                    "scenario_id": p.get("scenario_id", ""),
                    "scenario_title": scenario.get("title", "Unknown"),
                    "domain": scenario.get("domain", "Unknown"),
                    "next_review_date": p.get("next_review_date"),
                    "interval": p.get("interval", 1),
                    "easiness_factor": p.get("easiness_factor", 2.5),
                })
            return result

        records = Progress.query.filter(
            Progress.user_id == user_id,
            Progress.next_review_date <= datetime.utcnow()
        ).all()

        engine = ProgressService._get_engine()
        if not engine:
            return []

        scenario_map = {s['id']: s for s in engine.list_scenarios()}
        result = []

        for p in records:
            scenario = scenario_map.get(p.scenario_id, {})
            result.append({
                "scenario_id": p.scenario_id,
                "scenario_title": scenario.get("title", "Unknown"),
                "domain": scenario.get("domain", "Unknown"),
                "next_review_date": p.next_review_date.isoformat() if p.next_review_date else None,
                "interval": p.interval,
                "easiness_factor": p.easiness_factor,
            })

        return result

    @staticmethod
    def _get_engine():
        from flask import current_app
        return current_app.config.get('engine')

    @staticmethod
    def get_mastery_map(user_id: int, engine) -> dict:
        """
        Aggregate concept mastery across all completed scenarios for a user.
        Returns a dict mapping concept names to mastery scores (0-1).
        """
        if _is_mongo():
            learning_paths = Storage.get_learning_paths_for_user(user_id)
            mastery_scores = {}
            concept_counts = {}
            for lp in learning_paths:
                concept = lp.get('python_concept', 'General')
                score = (lp.get('score', 50) or 50) / 100.0
                if concept not in mastery_scores:
                    mastery_scores[concept] = 0.0
                    concept_counts[concept] = 0
                mastery_scores[concept] = max(mastery_scores[concept], score)
                concept_counts[concept] += 1
            result = []
            for concept, mastery in mastery_scores.items():
                result.append({
                    "concept": concept,
                    "mastery": round(mastery, 2),
                    "attempts": concept_counts[concept],
                })
            result.sort(key=lambda x: x['mastery'], reverse=True)
            return {
                "concepts": result,
                "total_concepts": len(result),
                "average_mastery": round(sum(x['mastery'] for x in result) / len(result), 2) if result else 0,
            }

        learning_paths = LearningPath.query.filter_by(user_id=user_id).all()

        mastery_scores = {}
        concept_counts = {}

        for lp in learning_paths:
            concept = lp.python_concept
            score = (lp.score or 50) / 100.0

            if concept not in mastery_scores:
                mastery_scores[concept] = 0.0
                concept_counts[concept] = 0

            mastery_scores[concept] = max(mastery_scores[concept], score)
            concept_counts[concept] += 1

        result = []
        for concept, mastery in mastery_scores.items():
            result.append({
                "concept": concept,
                "mastery": round(mastery, 2),
                "attempts": concept_counts[concept],
            })

        result.sort(key=lambda x: x['mastery'], reverse=True)
        return {
            "concepts": result,
            "total_concepts": len(result),
            "average_mastery": round(sum(x['mastery'] for x in result) / len(result), 2) if result else 0,
        }