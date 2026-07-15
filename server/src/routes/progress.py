from flask import Blueprint, jsonify, current_app, request
from src.services.progress_service import ProgressService
from src.middleware.auth import authenticate, require_userOwnership
from datetime import datetime, timedelta

progress_bp = Blueprint('progress', __name__)


def get_engine():
    return current_app.config.get('engine')


@progress_bp.route("/progress", methods=["POST"])
@authenticate()
def save_progress():
    data = request.get_json()
    if not data or not data.get('scenario_id') or not data.get('quality'):
        return jsonify({'error': 'Missing data'}), 400

    user_id = request.user_id
    scenario_id = data['scenario_id']

    engine = get_engine()
    try:
        scenario = engine.get_scenario(scenario_id)
    except Exception:
        return jsonify({'error': 'Scenario not found'}), 404

    score = data.get('score') or min(100, data['quality'] * 20)

    result = ProgressService.save_progress(
        user_id=user_id,
        scenario_id=scenario_id,
        quality=data['quality'],
        status='completed' if data['quality'] >= 3 else 'in_progress',
        score=score,
        domain=scenario.get('domain', 'General'),
        python_concept=scenario.get('pythonConcept', scenario.get('concept', 'General'))
    )
    return jsonify(result), 200


@progress_bp.route("/progress/due", methods=["GET"])
@authenticate()
def get_due_scenarios():
    """Get scenarios due for review today for the authenticated user."""
    user_id = request.user_id
    engine = get_engine()
    now = datetime.utcnow()

    from src.storage import Storage

    def _is_mongo():
        try:
            from src.database import is_mongodb
            return is_mongodb()
        except Exception:
            return False

    if _is_mongo():
        due_progress = Storage.get_due_progress(user_id, now)
        due_scenarios = []
        for p in due_progress:
            try:
                scenario = engine.get_scenario(p.get('scenario_id', ''))
                next_review = p.get('next_review_date')
                overdue = False
                if next_review:
                    if hasattr(next_review, 'replace'):
                        overdue = next_review < now - timedelta(days=1)
                    else:
                        overdue = True
                due_scenarios.append({
                    'id': p.get('scenario_id', ''),
                    'title': scenario.get('title', p.get('scenario_id', '')),
                    'domain': scenario.get('domain', 'General'),
                    'dueDate': next_review.isoformat() if hasattr(next_review, 'isoformat') else str(next_review) if next_review else None,
                    'overdue': overdue
                })
            except Exception:
                pass
        return jsonify({'due_scenarios': due_scenarios})

    from src.models import Progress
    due_progress = Progress.query.filter(
        Progress.user_id == user_id,
        Progress.next_review_date <= now,
        Progress.status == 'completed'
    ).order_by(Progress.next_review_date).limit(5).all()

    due_scenarios = []
    for p in due_progress:
        try:
            scenario = engine.get_scenario(p.scenario_id)
            overdue = p.next_review_date < now - timedelta(days=1)
            due_scenarios.append({
                'id': p.scenario_id,
                'title': scenario.get('title', p.scenario_id),
                'domain': scenario.get('domain', 'General'),
                'dueDate': p.next_review_date.isoformat() if p.next_review_date else None,
                'overdue': overdue
            })
        except Exception:
            pass

    return jsonify({'due_scenarios': due_scenarios})


@progress_bp.route("/progress/<int:user_id>", methods=["GET"])
@authenticate()
@require_userOwnership('user_id')
def get_user_progress(user_id: int):
    engine = get_engine()
    progress = ProgressService.get_user_progress(user_id, engine)
    return jsonify({"user_id": user_id, "progress": progress})


@progress_bp.route("/progress/due/<int:user_id>", methods=["GET"])
@authenticate()
@require_userOwnership('user_id')
def get_due_for_review(user_id: int):
    due = ProgressService.get_due_for_review(user_id)
    return jsonify({"user_id": user_id, "due": due})