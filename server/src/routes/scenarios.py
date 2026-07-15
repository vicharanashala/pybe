from flask import Blueprint, jsonify, request, current_app
from src.engine import ScenarioNotFoundError
from src.services.scenario_service import ScenarioService
from src.models import db, DiscussionComment
from src.storage import Storage
from datetime import datetime
import json
from pathlib import Path

scenarios_bp = Blueprint('scenarios', __name__)


def _is_mongo():
    try:
        from src.database import is_mongodb
        return is_mongodb()
    except Exception:
        return False


def get_engine():
    return current_app.config.get('engine')


def get_scenarios_dir():
    return current_app.config.get('scenarios_dir', '')


@scenarios_bp.route("/scenarios", methods=["GET"])
def list_scenarios():
    engine = get_engine()
    domain = request.args.get("domain")
    level = request.args.get("level")
    jonasan_type = request.args.get("type")

    scenarios = ScenarioService.get_list(engine, domain, level, jonasan_type)
    return jsonify({
        "count": len(scenarios),
        "scenarios": scenarios,
    })


@scenarios_bp.route("/scenarios/<scenario_id>", methods=["GET"])
def get_scenario(scenario_id: str):
    engine = get_engine()
    data = ScenarioService.get_detail(engine, scenario_id)
    if data is None:
        return jsonify({
            "error": "Scenario not found",
            "scenarioId": scenario_id,
        }), 404
    return jsonify(data)


@scenarios_bp.route("/scenarios/<scenario_id>/hints", methods=["GET"])
def get_hints(scenario_id: str):
    engine = get_engine()
    reveal_param = request.args.get("reveal")
    reveal_count = None
    if reveal_param is not None:
        try:
            reveal_count = int(reveal_param)
        except ValueError:
            return jsonify({
                "error": "Bad request",
                "message": "'reveal' must be an integer",
            }), 400

    hints = ScenarioService.get_hints(engine, scenario_id, reveal_count)
    return jsonify({
        "scenarioId": scenario_id,
        "revealedCount": len(hints),
        "hints": hints,
    })


@scenarios_bp.route("/scenarios/<scenario_id>/solutions", methods=["GET"])
def get_solutions(scenario_id: str):
    engine = get_engine()
    try:
        solutions = ScenarioService.get_solutions(engine, scenario_id)
        return jsonify({
            "scenarioId": scenario_id,
            "count": len(solutions),
            "solutions": solutions,
        })
    except ScenarioNotFoundError:
        return jsonify({
            "error": "Scenario not found",
            "scenarioId": scenario_id,
        }), 404


@scenarios_bp.route("/scenarios/<scenario_id>/reflection", methods=["GET"])
def get_reflection(scenario_id: str):
    engine = get_engine()
    try:
        prompts = ScenarioService.get_reflection(engine, scenario_id)
        return jsonify({
            "scenarioId": scenario_id,
            "reflection": prompts,
        })
    except ScenarioNotFoundError:
        return jsonify({
            "error": "Scenario not found",
            "scenarioId": scenario_id,
        }), 404


@scenarios_bp.route("/scenarios/<scenario_id>/rubric", methods=["GET"])
def get_rubric(scenario_id: str):
    engine = get_engine()
    try:
        rubric = ScenarioService.get_rubric(engine, scenario_id)
        return jsonify({
            "scenarioId": scenario_id,
            "rubric": rubric,
        })
    except ScenarioNotFoundError:
        return jsonify({
            "error": "Scenario not found",
            "scenarioId": scenario_id,
        }), 404


@scenarios_bp.route("/scenarios/<scenario_id>/report", methods=["GET"])
def get_report_data(scenario_id: str):
    engine = get_engine()
    try:
        scenario = ScenarioService.get_detail(engine, scenario_id)
        if scenario is None:
            return jsonify({"error": "Scenario not found"}), 404
        hints = ScenarioService.get_hints(engine, scenario_id)
        solutions = ScenarioService.get_solutions(engine, scenario_id)
        reflection = ScenarioService.get_reflection(engine, scenario_id)
        rubric = ScenarioService.get_rubric(engine, scenario_id)

        user_progress = None
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                import jwt
                token = auth_header.split(' ')[1]
                payload = jwt.decode(
                    token,
                    current_app.config['JWT_SECRET'],
                    algorithms=['HS256']
                )
                user_id = payload.get('user_id')
                if user_id:
                    if _is_mongo():
                        progress_doc = Storage.get_progress(user_id, scenario_id)
                        if progress_doc:
                            next_review = progress_doc.get('next_review_date')
                            updated_at = progress_doc.get('updated_at')
                            user_progress = {
                                "score": progress_doc.get('score'),
                                "status": progress_doc.get('status'),
                                "completed_at": updated_at.isoformat() if hasattr(updated_at, 'isoformat') else str(updated_at) if updated_at else None,
                                "repetition": progress_doc.get('repetition', 0),
                                "interval": progress_doc.get('interval', 1),
                                "easiness_factor": progress_doc.get('easiness_factor', 2.5),
                                "next_review_date": next_review.isoformat() if hasattr(next_review, 'isoformat') else str(next_review) if next_review else None
                            }
                    else:
                        from src.models import Progress
                        progress = Progress.query.filter_by(
                            user_id=user_id,
                            scenario_id=scenario_id
                        ).first()
                        if progress:
                            user_progress = {
                                "score": progress.score,
                                "status": progress.status,
                                "completed_at": progress.updated_at.isoformat() if progress.updated_at else None,
                                "repetition": progress.repetition,
                                "interval": progress.interval,
                                "easiness_factor": progress.easiness_factor,
                                "next_review_date": progress.next_review_date.isoformat() if progress.next_review_date else None
                            }
            except Exception:
                pass

        return jsonify({
            "scenario": scenario,
            "hints": hints,
            "solutions": solutions,
            "reflection": reflection,
            "rubric": rubric,
            "userProgress": user_progress,
            "generatedAt": datetime.utcnow().isoformat()
        })
    except ScenarioNotFoundError:
        return jsonify({"error": "Scenario not found"}), 404


@scenarios_bp.route("/scenarios", methods=["POST"])
def create_scenario():
    engine = get_engine()
    scenarios_dir = get_scenarios_dir()
    data = request.get_json()

    valid, error = ScenarioService.validate_scenario_data(data)
    if not valid:
        return jsonify({"error": error}), 400

    scenario_id = data["id"]
    scenario_dir = Path(scenarios_dir) / scenario_id

    if scenario_dir.exists():
        return jsonify({"error": f"Scenario '{scenario_id}' already exists"}), 409

    scenario_dir.mkdir(parents=True)
    (scenario_dir / "solution").mkdir()

    scenario_meta = {
        "id": scenario_id,
        "title": data.get("title", ""),
        "domain": data.get("domain", "General"),
        "domainCategory": data.get("domainCategory", ""),
        "philosophicalAnchor": data.get("philosophicalAnchor", ""),
        "pythonConcept": data.get("pythonConcept", ""),
        "difficultyLevel": data.get("difficultyLevel", 2),
        "jonasanType": data.get("jonasanType", "Structured Inquiry"),
        "targetConstructs": data.get("targetConstructs", []),
        "briefDescription": data.get("briefDescription", ""),
        "theoryPillar": data.get("theoryPillar", ""),
        "anchorPillar": data.get("anchorPillar", ""),
        "triggerPillar": data.get("triggerPillar", ""),
        "realityPillar": data.get("realityPillar", ""),
    }
    with open(scenario_dir / "scenario.json", "w", encoding="utf-8") as f:
        json.dump(scenario_meta, f, indent=2)

    with open(scenario_dir / "case-study.md", "w", encoding="utf-8") as f:
        f.write(data.get("caseStudy", "# Case Study\n\nTo be written."))

    hints_data = data.get('hints', [])
    if hints_data:
        hints_formatted = [{"level": h.get("level", i+1), "text": h.get("text", "")} for i, h in enumerate(hints_data)]
        with open(scenario_dir / "hints.json", "w", encoding="utf-8") as f:
            json.dump(hints_formatted, f, indent=2)
    else:
        with open(scenario_dir / "hints.json", "w", encoding="utf-8") as f:
            f.write("[]")

    default_reflection = [
        "What was the hardest part of this scenario and why?",
        "How does the philosophical anchor connect to the Python concept for you personally?",
        "What would you do differently if you approached this scenario again?",
        "Where have you seen this Python concept in real-world code before?"
    ]
    with open(scenario_dir / "reflection-prompts.json", "w", encoding="utf-8") as f:
        json.dump(default_reflection, f, indent=2)

    default_rubric = {
        "reasoning": {"weight": 40, "description": "Understanding of the philosophical connection"},
        "code": {"weight": 30, "description": "Correct use of target Python constructs"},
        "reflection": {"weight": 30, "description": "Depth of reflection on the learning experience"}
    }
    with open(scenario_dir / "scoring-rubric.json", "w", encoding="utf-8") as f:
        json.dump(default_rubric, f, indent=2)

    engine.load_all()
    return jsonify({"message": f"Scenario '{scenario_id}' created", "id": scenario_id}), 201


@scenarios_bp.route("/scenarios/<scenario_id>/discussions", methods=["GET"])
def get_discussions(scenario_id: str):
    if _is_mongo():
        comments = Storage.get_discussion_comments(scenario_id, parent_id=None)
        result = []
        for comment in comments:
            comment_data = {
                "id": int(str(comment.get("_id", "0")), 16) if hasattr(comment.get("_id"), "__str__") else comment.get("id", 0),
                "author": comment.get("author_name", ""),
                "author_id": comment.get("author_id"),
                "text": comment.get("content", ""),
                "python_construct": comment.get("python_construct", ""),
                "domain_connection": comment.get("domain_connection", ""),
                "timestamp": comment.get("created_at"),
                "upvotes": comment.get("upvotes", 0),
                "is_accepted": comment.get("is_accepted", False),
                "replies": []
            }
            replies = Storage.get_discussion_comments(scenario_id, parent_id=comment.get("_id"))
            for reply in replies:
                comment_data["replies"].append({
                    "id": int(str(reply.get("_id", "0")), 16) if hasattr(reply.get("_id"), "__str__") else reply.get("id", 0),
                    "author": reply.get("author_name", ""),
                    "text": reply.get("content", ""),
                    "timestamp": reply.get("created_at"),
                    "upvotes": reply.get("upvotes", 0)
                })
            result.append(comment_data)
        return jsonify({"scenarioId": scenario_id, "threads": result})

    comments = DiscussionComment.query.filter_by(
        scenario_id=scenario_id,
        parent_id=None
    ).order_by(DiscussionComment.upvotes.desc(), DiscussionComment.created_at.desc()).all()

    result = []
    for comment in comments:
        comment_data = {
            "id": comment.id,
            "author": comment.author_name,
            "author_id": comment.author_id,
            "text": comment.content,
            "python_construct": comment.python_construct,
            "domain_connection": comment.domain_connection,
            "timestamp": comment.created_at.isoformat(),
            "upvotes": comment.upvotes,
            "is_accepted": comment.is_accepted,
            "replies": []
        }
        replies = DiscussionComment.query.filter_by(parent_id=comment.id).order_by(DiscussionComment.created_at).all()
        for reply in replies:
            comment_data["replies"].append({
                "id": reply.id,
                "author": reply.author_name,
                "text": reply.content,
                "timestamp": reply.created_at.isoformat(),
                "upvotes": reply.upvotes
            })
        result.append(comment_data)

    return jsonify({"scenarioId": scenario_id, "threads": result})


@scenarios_bp.route("/scenarios/<scenario_id>/discussions", methods=["POST"])
def post_discussion(scenario_id: str):
    data = request.get_json()
    if not data or not data.get("text"):
        return jsonify({"error": "Missing text"}), 400

    parent_id = data.get("parent_id")

    if _is_mongo():
        comment = Storage.create_comment(
            scenario_id=scenario_id,
            author_name=data.get("author", "Anonymous"),
            author_id=data.get("author_id"),
            content=data["text"],
            python_construct=data.get("python_construct"),
            domain_connection=data.get("domain_connection"),
            parent_id=parent_id
        )
        created_at = comment.get('created_at')
        return jsonify({
            "message": "Comment posted",
            "comment": {
                "id": int(str(comment.get("_id", "0")), 16) if hasattr(comment.get("_id"), "__str__") else comment.get("id", 0),
                "author": comment.get("author_name", ""),
                "text": comment.get("content", ""),
                "timestamp": created_at.isoformat() if hasattr(created_at, 'isoformat') else str(created_at) if created_at else None,
                "upvotes": 0,
                "replies": []
            }
        }), 201

    comment = DiscussionComment(
        scenario_id=scenario_id,
        author_name=data.get("author", "Anonymous"),
        author_id=data.get("author_id"),
        content=data["text"],
        python_construct=data.get("python_construct"),
        domain_connection=data.get("domain_connection"),
        parent_id=parent_id
    )

    db.session.add(comment)
    db.session.commit()

    return jsonify({
        "message": "Comment posted",
        "comment": {
            "id": comment.id,
            "author": comment.author_name,
            "text": comment.content,
            "timestamp": comment.created_at.isoformat(),
            "upvotes": 0,
            "replies": []
        }
    }), 201


@scenarios_bp.route("/scenarios/<scenario_id>/discussions/<int:comment_id>/upvote", methods=["POST"])
def upvote_discussion(scenario_id: str, comment_id: int):
    if _is_mongo():
        upvotes = Storage.increment_comment_upvotes(comment_id)
        if upvotes == 0:
            return jsonify({"error": "Comment not found"}), 404
        return jsonify({"message": "Upvoted", "upvotes": upvotes})

    comment = DiscussionComment.query.filter_by(id=comment_id, scenario_id=scenario_id).first()
    if not comment:
        return jsonify({"error": "Comment not found"}), 404

    comment.upvotes += 1
    db.session.commit()

    return jsonify({"message": "Upvoted", "upvotes": comment.upvotes})


@scenarios_bp.route("/scenarios/<scenario_id>/discussions/<int:comment_id>/accept", methods=["POST"])
def accept_discussion(scenario_id: str, comment_id: int):
    if _is_mongo():
        success = Storage.mark_comment_accepted(comment_id)
        if not success:
            return jsonify({"error": "Comment not found"}), 404
        return jsonify({"message": "Marked as exemplary", "is_accepted": True})

    comment = DiscussionComment.query.filter_by(id=comment_id, scenario_id=scenario_id).first()
    if not comment:
        return jsonify({"error": "Comment not found"}), 404

    comment.is_accepted = True
    db.session.commit()

    return jsonify({"message": "Marked as exemplary", "is_accepted": True})


@scenarios_bp.route("/reload", methods=["POST"])
def reload_scenarios():
    engine = get_engine()
    count = engine.load_all()
    return jsonify({
        "status": "reloaded",
        "count": count,
    })


@scenarios_bp.route("/scenarios/validate", methods=["POST"])
def validate_scenario():
    from src.services.scenario_validator import validate_scenario_for_submission, get_schema_summary
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    is_valid, errors, warnings = validate_scenario_for_submission(data)

    return jsonify({
        "valid": is_valid,
        "errors": errors,
        "warnings": warnings,
        "errorCount": len(errors),
        "warningCount": len(warnings)
    })


@scenarios_bp.route("/scenarios/schema", methods=["GET"])
def get_scenario_schema():
    from src.services.scenario_validator import get_schema_summary
    return jsonify(get_schema_summary())