from flask import Blueprint, jsonify, request, current_app
from src.middleware.auth import authenticate, admin_required
from src.services.review_service import ReviewService

reviews_bp = Blueprint('reviews', __name__)


def get_engine():
    return current_app.config.get('engine')


@reviews_bp.route('/reviews/pending', methods=['GET'])
@authenticate()
@admin_required()
def get_pending_reviews():
    reviews = ReviewService.get_pending_reviews()
    return jsonify({
        'count': len(reviews),
        'reviews': reviews
    })


@reviews_bp.route('/reviews', methods=['GET'])
@authenticate()
@admin_required()
def get_all_reviews():
    status = request.args.get('status')
    reviews = ReviewService.get_all_reviews(status)
    return jsonify({
        'count': len(reviews),
        'reviews': reviews
    })


@reviews_bp.route('/reviews/<int:review_id>', methods=['GET'])
@authenticate()
@admin_required()
def get_review(review_id: int):
    review = ReviewService.get_review_by_id(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    return jsonify(review)


@reviews_bp.route('/reviews/<int:review_id>/approve', methods=['POST'])
@authenticate()
@admin_required()
def approve_review(review_id: int):
    from src.models import User
    data = request.get_json() or {}
    comments = data.get('comments', '')

    user = User.query.get(request.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    review = ReviewService.approve_review(review_id, request.user_id, user.username, comments)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    engine = get_engine()
    if engine:
        engine.load_all()

    return jsonify({
        'message': 'Scenario approved',
        'review': review
    })


@reviews_bp.route('/reviews/<int:review_id>/request-changes', methods=['POST'])
@authenticate()
@admin_required()
def request_changes(review_id: int):
    from src.models import User
    data = request.get_json() or {}
    comments = data.get('comments', '')
    change_requests = data.get('changeRequests', '')

    if not change_requests:
        return jsonify({'error': 'Change requests are required'}), 400

    user = User.query.get(request.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    review = ReviewService.request_changes(review_id, request.user_id, user.username, comments, change_requests)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    return jsonify({
        'message': 'Changes requested',
        'review': review
    })


@reviews_bp.route('/reviews/<int:review_id>/reject', methods=['POST'])
@authenticate()
@admin_required()
def reject_review(review_id: int):
    from src.models import User
    data = request.get_json() or {}
    comments = data.get('comments', '')

    user = User.query.get(request.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    review = ReviewService.reject_review(review_id, request.user_id, user.username, comments)
    if not review:
        return jsonify({'error': 'Review not found'}), 404

    return jsonify({
        'message': 'Scenario rejected',
        'review': review
    })


@reviews_bp.route('/notifications', methods=['GET'])
@authenticate()
def get_notifications():
    unread_only = request.args.get('unreadOnly', 'false').lower() == 'true'
    notifications = ReviewService.get_user_notifications(request.user_id, unread_only)
    unread_count = ReviewService.get_unread_notification_count(request.user_id)
    return jsonify({
        'count': len(notifications),
        'unreadCount': unread_count,
        'notifications': notifications
    })


@reviews_bp.route('/notifications/<int:notification_id>/read', methods=['POST'])
@authenticate()
def mark_notification_read(notification_id: int):
    success = ReviewService.mark_notification_read(notification_id, request.user_id)
    if not success:
        return jsonify({'error': 'Notification not found'}), 404
    return jsonify({'message': 'Notification marked as read'})


@reviews_bp.route('/notifications/read-all', methods=['POST'])
@authenticate()
def mark_all_notifications_read():
    count = ReviewService.mark_all_notifications_read(request.user_id)
    return jsonify({
        'message': f'{count} notifications marked as read',
        'count': count
    })


@reviews_bp.route('/reviews/submit', methods=['POST'])
@authenticate()
def submit_for_review():
    from src.models import User
    data = request.get_json()
    if not data or not data.get('scenarioId'):
        return jsonify({'error': 'scenarioId is required'}), 400

    scenario_id = data['scenarioId']
    user = User.query.get(request.user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    engine = get_engine()
    if not engine:
        return jsonify({'error': 'Engine not available'}), 500

    try:
        scenario = engine.get_scenario(scenario_id)
    except Exception:
        return jsonify({'error': 'Scenario not found'}), 404

    scenario_data = {
        'id': scenario.get('id'),
        'title': scenario.get('title'),
        'domain': scenario.get('domain'),
        'domainCategory': scenario.get('domainCategory', ''),
        'philosophicalAnchor': scenario.get('philosophicalAnchor', ''),
        'pythonConcept': scenario.get('pythonConcept', ''),
        'difficultyLevel': scenario.get('difficultyLevel', 2),
        'jonasanType': scenario.get('jonasanType', 'Structured Inquiry'),
        'targetConstructs': scenario.get('targetConstructs', []),
        'briefDescription': scenario.get('briefDescription', ''),
        'theoryPillar': scenario.get('theoryPillar', ''),
        'anchorPillar': scenario.get('anchorPillar', ''),
        'triggerPillar': scenario.get('triggerPillar', ''),
        'realityPillar': scenario.get('realityPillar', ''),
        'caseStudy': scenario.get('caseStudy', {}).get('markdown', '') if scenario.get('caseStudy') else ''
    }

    hints_path = current_app.config.get('scenarios_dir', '') + '/' + scenario_id + '/hints.json'
    try:
        import json
        with open(hints_path, 'r', encoding='utf-8') as f:
            hints = json.load(f)
            scenario_data['hints'] = hints
    except Exception:
        scenario_data['hints'] = []

    reflection_path = current_app.config.get('scenarios_dir', '') + '/' + scenario_id + '/reflection-prompts.json'
    try:
        with open(reflection_path, 'r', encoding='utf-8') as f:
            scenario_data['reflectionPrompts'] = json.load(f)
    except Exception:
        scenario_data['reflectionPrompts'] = []

    rubric_path = current_app.config.get('scenarios_dir', '') + '/' + scenario_id + '/scoring-rubric.json'
    try:
        with open(rubric_path, 'r', encoding='utf-8') as f:
            scenario_data['scoringRubric'] = json.load(f)
    except Exception:
        scenario_data['scoringRubric'] = {}

    review = ReviewService.create_review_request(
        scenario_id=scenario_id,
        submitter_id=request.user_id,
        submitter_name=user.username,
        scenario_data=scenario_data
    )

    return jsonify({
        'message': 'Scenario submitted for review',
        'review': {
            'id': review.id,
            'scenarioId': review.scenario_id,
            'status': review.status,
            'createdAt': review.created_at.isoformat()
        }
    }), 201