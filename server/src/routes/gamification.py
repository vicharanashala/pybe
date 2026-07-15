from flask import Blueprint, jsonify, current_app, request
from src.services.gamification_service import GamificationService
from src.middleware.auth import authenticate

gamification_bp = Blueprint('gamification', __name__)


def get_engine():
    return current_app.config.get('engine')


@gamification_bp.route("/gamification/profile", methods=["GET"])
@authenticate()
def get_gamification_profile():
    engine = get_engine()
    user_id = request.user_id
    profile = GamificationService.get_profile(user_id, engine)
    profile['lockedBadges'] = GamificationService.get_locked_badges(
        [b['id'] for b in profile['badges']]
    )
    return jsonify(profile)


@gamification_bp.route("/gamification/leaderboard", methods=["GET"])
def get_leaderboard():
    limit = request.args.get("limit", 10, type=int)
    leaderboard = GamificationService.get_leaderboard(limit)
    return jsonify({"leaderboard": leaderboard})