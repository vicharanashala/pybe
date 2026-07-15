from flask import Blueprint, jsonify, current_app, request
from src.services.user_service import UserService
from src.middleware.auth import authenticate, require_userOwnership

users_bp = Blueprint('users', __name__)


def get_engine():
    return current_app.config.get('engine')


@users_bp.route("/users/stats", methods=["GET"])
@authenticate()
def get_user_stats():
    engine = get_engine()
    return jsonify(UserService.get_user_stats(engine))


@users_bp.route("/users/domains", methods=["GET"])
@authenticate()
def get_user_domains():
    user_id = request.user_id
    return jsonify(UserService.get_personalized_domain_graph(user_id))


@users_bp.route("/users/<int:user_id>/progress", methods=["GET"])
@authenticate()
@require_userOwnership('user_id')
def get_user_progress(user_id: int):
    engine = get_engine()
    progress = UserService.get_user_progress_records(user_id, engine)
    return jsonify({"user_id": user_id, "progress": progress})