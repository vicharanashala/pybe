from flask import Blueprint, jsonify, request
from src.models import db, Contributor, Progress
from src.middleware.auth import authenticate
from src.storage import Storage

contributors_bp = Blueprint('contributors', __name__)


def _is_mongo():
    try:
        from src.database import is_mongodb
        return is_mongodb()
    except Exception:
        return False


def get_scenario_count(username):
    from src.engine import ScenarioEngine
    from flask import current_app
    engine = current_app.config.get('engine')
    if not engine:
        return 0
    count = 0
    for scenario in engine.list_scenarios():
        created_by = scenario.get('createdBy', {})
        if created_by.get('username') == username:
            count += 1
    return count


def get_contributor_scenarios(username):
    from src.engine import ScenarioEngine
    from flask import current_app
    engine = current_app.config.get('engine')
    if not engine:
        return []
    scenarios = []
    for scenario in engine.list_scenarios():
        created_by = scenario.get('createdBy', {})
        if created_by.get('username') == username:
            scenarios.append({
                'id': scenario.get('id'),
                'title': scenario.get('title'),
                'domain': scenario.get('domain'),
                'pythonConcept': scenario.get('pythonConcept')
            })
    return scenarios


def calculate_impact(username):
    total = 0
    scenario_ids = []
    from src.engine import ScenarioEngine
    from flask import current_app
    engine = current_app.config.get('engine')
    if engine:
        for scenario in engine.list_scenarios():
            created_by = scenario.get('createdBy', {})
            if created_by.get('username') == username:
                scenario_ids.append(scenario.get('id'))
    if scenario_ids:
        if _is_mongo():
            progress_docs = Storage.get_progress_for_scenario(scenario_ids[0])
            for sid in scenario_ids:
                docs = Storage.get_progress_for_scenario(sid)
                for doc in docs:
                    if doc.get('status') == 'completed':
                        total += 1
            return total
        total = Progress.query.filter(
            Progress.scenario_id.in_(scenario_ids),
            Progress.status == 'completed'
        ).with_entities(db.func.count(db.distinct(Progress.user_id))).scalar() or 0
    return total


@contributors_bp.route('/contributors', methods=['GET'])
def get_contributors():
    from flask import current_app
    engine = current_app.config.get('engine')

    contributors_data = []
    seen_usernames = set()

    if engine:
        for scenario in engine.list_scenarios():
            created_by = scenario.get('createdBy')
            if created_by and created_by.get('username'):
                username = created_by.get('username')
                if username not in seen_usernames:
                    seen_usernames.add(username)
                    impact = calculate_impact(username)
                    contributors_data.append({
                        'username': username,
                        'avatar': created_by.get('avatar'),
                        'totalImpact': impact,
                        'createdScenarios': get_scenario_count(username)
                    })

    contributors_data.sort(key=lambda x: x['totalImpact'], reverse=True)

    result = []
    for i, c in enumerate(contributors_data):
        if _is_mongo():
            contributor = Storage.get_contributor_by_username(c['username'])
            result.append({
                'rank': i + 1,
                'username': c['username'],
                'avatar': c['avatar'],
                'totalImpact': c['totalImpact'],
                'createdScenarios': c['createdScenarios'],
                'github': contributor.get('github', '') if contributor else None,
                'bio': contributor.get('bio', '') if contributor else None
            })
        else:
            contributor = Contributor.query.filter_by(username=c['username']).first()
            result.append({
                'rank': i + 1,
                'username': c['username'],
                'avatar': c['avatar'],
                'totalImpact': c['totalImpact'],
                'createdScenarios': c['createdScenarios'],
                'github': contributor.github if contributor else None,
                'bio': contributor.bio if contributor else None
            })

    return jsonify({'contributors': result})


@contributors_bp.route('/contributors/<username>', methods=['GET'])
def get_contributor(username):
    if _is_mongo():
        contributor = Storage.get_contributor_by_username(username)
        created_scenarios = get_contributor_scenarios(username)
        impact = calculate_impact(username)
        return jsonify({
            'username': username,
            'github': contributor.get('github', '') if contributor else None,
            'avatar': contributor.get('avatar_url', '') if contributor else None,
            'totalImpact': impact,
            'bio': contributor.get('bio', '') if contributor else None,
            'scenarios': created_scenarios
        })

    contributor = Contributor.query.filter_by(username=username).first()

    created_scenarios = get_contributor_scenarios(username)
    impact = calculate_impact(username)

    return jsonify({
        'username': username,
        'github': contributor.github if contributor else None,
        'avatar': contributor.avatar_url if contributor else None,
        'totalImpact': impact,
        'bio': contributor.bio if contributor else None,
        'scenarios': created_scenarios
    })


@contributors_bp.route('/contributors', methods=['POST'])
@authenticate()
def create_or_update_contributor():
    data = request.get_json()
    if not data or not data.get('username'):
        return jsonify({'error': 'Username is required'}), 400

    username = data['username']
    github = data.get('github')
    avatar_url = data.get('avatar_url')
    bio = data.get('bio')

    if _is_mongo():
        contributor = Storage.create_or_update_contributor(
            username=username,
            github=github or '',
            avatar_url=avatar_url or '',
            bio=bio or ''
        )
        return jsonify({
            'message': 'Contributor saved',
            'contributor': {
                'id': int(str(contributor.get("_id", "0")), 16) if hasattr(contributor.get("_id"), "__str__") else contributor.get("id", 0),
                'username': contributor.get('username', ''),
                'github': contributor.get('github', ''),
                'avatar': contributor.get('avatar_url', ''),
                'bio': contributor.get('bio', '')
            }
        }), 201

    contributor = Contributor.query.filter_by(username=username).first()

    if not contributor:
        contributor = Contributor(username=username)
        db.session.add(contributor)

    if 'github' in data:
        contributor.github = data['github']
    if 'avatar_url' in data:
        contributor.avatar_url = data['avatar_url']
    if 'bio' in data:
        contributor.bio = data['bio']

    db.session.commit()

    return jsonify({
        'message': 'Contributor saved',
        'contributor': {
            'id': contributor.id,
            'username': contributor.username,
            'github': contributor.github,
            'avatar': contributor.avatar_url,
            'bio': contributor.bio
        }
    }), 201