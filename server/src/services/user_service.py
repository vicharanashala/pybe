from typing import Any, Optional
from src.models import User, Progress, LearningPath


def _is_mongo():
    try:
        from src.database import is_mongodb
        return is_mongodb()
    except Exception:
        return False


class UserService:

    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Any]:
        if _is_mongo():
            from src.database import convert_object_ids
            return convert_object_ids(Storage.get_user_by_id(user_id))
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_identifier(identifier: str) -> Optional[Any]:
        if _is_mongo():
            from src.database import convert_object_ids
            return convert_object_ids(Storage.get_user_by_identifier(identifier))
        return User.query.filter(
            (User.username == identifier) | (User.email == identifier)
        ).first()

    @staticmethod
    def create_user(username: str, email: str, password_hash: str) -> User:
        if _is_mongo():
            return Storage.create_user(username, email, password_hash)
        user = User(username=username, email=email, password_hash=password_hash)
        from src.models import db
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_user_stats(engine) -> dict:
        concepts = {}
        for s in engine.list_scenarios():
            concept = s.get("pythonConcept", "General")
            if concept not in concepts:
                concepts[concept] = 0.0
            concepts[concept] += 0.5

        labels = list(concepts.keys())[:8]
        data = [min(concepts[l], 1.0) for l in labels]
        return {"labels": labels, "data": data}

    @staticmethod
    def get_domain_graph_data(engine) -> dict:
        scenarios = engine.list_scenarios()
        domain_set = {}
        links = []

        domain_colors = [
            "#7c3aed", "#6366f1", "#3b82f6", "#06b6d4",
            "#14b8a6", "#10b981", "#8b5cf6", "#a855f7",
            "#6d28d9", "#4f46e5", "#0ea5e9", "#22d3ee",
        ]
        concept_colors = [
            "#f97316", "#ef4444", "#f59e0b", "#ec4899",
            "#e11d48", "#d946ef", "#f43f5e", "#fb923c",
            "#fbbf24", "#a3e635", "#84cc16", "#22c55e",
        ]
        domain_idx = 0
        concept_idx = 0

        for s in scenarios:
            d = s.get("domain", "Unknown")
            concept = s.get("pythonConcept", "General")
            if d not in domain_set:
                color = domain_colors[domain_idx % len(domain_colors)]
                domain_set[d] = {"id": d, "mastery": 0.3, "color": color, "type": "domain"}
                domain_idx += 1
            if concept not in domain_set:
                color = concept_colors[concept_idx % len(concept_colors)]
                domain_set[concept] = {"id": concept, "mastery": 0.5, "color": color, "type": "concept"}
                concept_idx += 1
            links.append({"source": d, "target": concept})

        return {
            "nodes": list(domain_set.values()),
            "links": links,
        }

    @staticmethod
    def get_personalized_domain_graph(user_id: int) -> dict:
        if _is_mongo():
            paths = Storage.get_learning_paths_for_user(user_id)
        else:
            paths = LearningPath.query.filter_by(user_id=user_id).all()

        domain_colors = {
            'Literature': '#6366f1',
            'Folklore': '#f59e0b',
            'Science': '#10b981',
            'Music': '#ec4899',
            'Philosophy': '#8b5cf6',
            'Pop Culture': '#f97316'
        }

        concept_colors = {
            'Graph Theory': '#ef4444',
            'Recursion': '#f59e0b',
            'OOP': '#3b82f6',
            'Memory Management': '#8b5cf6',
            'Async': '#14b8a6',
            'Generators': '#f97316',
            'Data Structures': '#06b6d4'
        }

        nodes = {}
        links = []

        nodes['You'] = {'id': 'You', 'type': 'user', 'color': '#ffffff', 'mastery': 1.0}

        domains_seen = set()
        concepts_seen = set()

        for path in paths:
            if _is_mongo():
                domain = path.get('domain', 'Unknown')
                concept = path.get('python_concept', 'General')
                mastery = (path.get('score', 50) or 50) / 100.0
            else:
                domain = path.domain
                concept = path.python_concept
                mastery = (path.score or 50) / 100.0

            if domain not in nodes:
                nodes[domain] = {
                    'id': domain,
                    'type': 'domain',
                    'color': domain_colors.get(domain, '#6366f1'),
                    'mastery': mastery
                }
            else:
                nodes[domain]['mastery'] = max(nodes[domain]['mastery'], mastery)

            if concept not in nodes:
                nodes[concept] = {
                    'id': concept,
                    'type': 'concept',
                    'color': concept_colors.get(concept, '#64748b'),
                    'mastery': mastery
                }
            else:
                nodes[concept]['mastery'] = max(nodes[concept]['mastery'], mastery)

            if domain not in domains_seen:
                links.append({'source': 'You', 'target': domain})
                domains_seen.add(domain)

            link_key = f"{domain}->{concept}"
            if link_key not in concepts_seen:
                links.append({'source': domain, 'target': concept})
                concepts_seen.add(link_key)

        domain_nodes = [n for n in nodes.values() if n['type'] == 'domain']
        concept_nodes = [n for n in nodes.values() if n['type'] == 'concept']

        return {
            'nodes': list(nodes.values()),
            'links': links,
            'stats': {
                'domainsExplored': len(domain_nodes),
                'conceptsLearned': len(concept_nodes),
                'totalCompleted': len(paths)
            }
        }

    @staticmethod
    def get_user_progress_records(user_id: int, engine) -> list[dict]:
        if _is_mongo():
            records_raw = Storage.get_all_progress_for_user(user_id)
            scenarios = engine.list_scenarios()
            scenario_map = {s['id']: s for s in scenarios}

            result = []
            for p in records_raw:
                scenario = scenario_map.get(p.get('scenario_id', ''), {})
                next_review = p.get('next_review_date')
                updated_at = p.get('updated_at')
                result.append({
                    "id": p.get('id', 0),
                    "scenario_id": p.get('scenario_id', ''),
                    "scenario_title": scenario.get("title", "Unknown"),
                    "domain": scenario.get("domain", "Unknown"),
                    "python_concept": scenario.get("pythonConcept", "General"),
                    "status": p.get("status", "started"),
                    "score": p.get("score"),
                    "repetition": p.get("repetition", 0),
                    "interval": p.get("interval", 1),
                    "easiness_factor": p.get("easiness_factor", 2.5),
                    "next_review_date": next_review.isoformat() if hasattr(next_review, 'isoformat') else str(next_review) if next_review else None,
                    "updated_at": updated_at.isoformat() if hasattr(updated_at, 'isoformat') else str(updated_at) if updated_at else None,
                })
            return result

        records = Progress.query.filter_by(user_id=user_id).all()
        scenarios = engine.list_scenarios()
        scenario_map = {s['id']: s for s in scenarios}

        result = []
        for p in records:
            scenario = scenario_map.get(p.scenario_id, {})
            result.append({
                "id": p.id,
                "scenario_id": p.scenario_id,
                "scenario_title": scenario.get("title", "Unknown"),
                "domain": scenario.get("domain", "Unknown"),
                "python_concept": scenario.get("pythonConcept", "General"),
                "status": p.status,
                "score": p.score,
                "repetition": p.repetition,
                "interval": p.interval,
                "easiness_factor": p.easiness_factor,
                "next_review_date": p.next_review_date.isoformat() if p.next_review_date else None,
                "updated_at": p.updated_at.isoformat() if p.updated_at else None,
            })
        return result

    @staticmethod
    def calculate_level(xp: int) -> int:
        """Calculate level from XP. Formula: 1 + int(xp // 500)"""
        return 1 + int(xp // 500)

    @staticmethod
    def get_profile(user_id: int, engine) -> dict:
        """Get complete user profile including stats, XP, level, badges, progress count."""
        from src.services.gamification_service import GamificationService

        if _is_mongo():
            user = Storage.get_user_by_id(user_id)
            if not user:
                return None
            progress_records_raw = Storage.get_all_progress_for_user(user_id)
            progress_records = []
            for p in progress_records_raw:
                class FakeProgress:
                    pass
                fp = FakeProgress()
                fp.score = p.get('score', 0)
                fp.status = p.get('status', 'started')
                progress_records.append(fp)
            xp = GamificationService.calculate_xp(progress_records)
            level = UserService.calculate_level(xp)
            completed = [p for p in progress_records if p.status == 'completed']
            total_scenarios = len(engine.list_scenarios())

            learning_paths = Storage.get_learning_paths_for_user(user_id)
            domains_completed = set()
            concepts_learned = set()
            for lp in learning_paths:
                domain = lp.get('domain', '') if isinstance(lp, dict) else getattr(lp, 'domain', '')
                concept = lp.get('python_concept', '') if isinstance(lp, dict) else getattr(lp, 'python_concept', '')
                if domain:
                    domains_completed.add(domain)
                if concept:
                    concepts_learned.add(concept)

            username = user.get('username', '') if isinstance(user, dict) else getattr(user, 'username', '')

            return {
                "user_id": user_id,
                "username": username,
                "xp": xp,
                "level": level,
                "completed_count": len(completed),
                "total_scenarios": total_scenarios,
                "domains_explored": len(domains_completed),
                "concepts_learned": len(concepts_learned),
                "progress_percent": round((len(completed) / total_scenarios) * 100, 1) if total_scenarios > 0 else 0,
            }

        user = User.query.get(user_id)
        if not user:
            return None

        progress_records = Progress.query.filter_by(user_id=user_id).all()
        xp = GamificationService.calculate_xp(progress_records)
        level = UserService.calculate_level(xp)
        completed = [p for p in progress_records if p.status == 'completed']
        total_scenarios = len(engine.list_scenarios())

        learning_paths = LearningPath.query.filter_by(user_id=user_id).all()
        domains_completed = set(lp.domain for lp in learning_paths)
        concepts_learned = set(lp.python_concept for lp in learning_paths)

        return {
            "user_id": user_id,
            "username": user.username,
            "xp": xp,
            "level": level,
            "completed_count": len(completed),
            "total_scenarios": total_scenarios,
            "domains_explored": len(domains_completed),
            "concepts_learned": len(concepts_learned),
            "progress_percent": round((len(completed) / total_scenarios) * 100, 1) if total_scenarios > 0 else 0,
        }

    @staticmethod
    def get_due_scenarios(user_id: int, engine) -> list[dict]:
        """Return scenarios where next_review_date <= now, sorted by urgency (most overdue first)."""
        from datetime import datetime

        if _is_mongo():
            records_raw = Storage.get_due_progress(user_id, datetime.utcnow())
            scenario_map = {s['id']: s for s in engine.list_scenarios()}
            result = []
            for p in records_raw:
                scenario = scenario_map.get(p.get('scenario_id', ''), {})
                next_review = p.get('next_review_date')
                result.append({
                    "id": p.get("scenario_id", ""),
                    "title": scenario.get("title", p.get("scenario_id", "Unknown")),
                    "domain": scenario.get("domain", "Unknown"),
                    "python_concept": scenario.get("pythonConcept", "General"),
                    "due_date": next_review.isoformat() if hasattr(next_review, 'isoformat') else str(next_review) if next_review else None,
                    "interval": p.get("interval", 1),
                    "easiness_factor": p.get("easiness_factor", 2.5),
                })
            return result

        records = Progress.query.filter(
            Progress.user_id == user_id,
            Progress.next_review_date <= datetime.utcnow(),
            Progress.status == 'completed'
        ).order_by(Progress.next_review_date).all()

        scenario_map = {s['id']: s for s in engine.list_scenarios()}
        result = []

        for p in records:
            scenario = scenario_map.get(p.scenario_id, {})
            result.append({
                "id": p.scenario_id,
                "title": scenario.get("title", p.scenario_id),
                "domain": scenario.get("domain", "Unknown"),
                "python_concept": scenario.get("pythonConcept", "General"),
                "due_date": p.next_review_date.isoformat() if p.next_review_date else None,
                "interval": p.interval,
                "easiness_factor": p.easiness_factor,
            })

        return result


# Import at module level to avoid circular imports
from src.storage import Storage