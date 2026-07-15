"""
pyBE Flask API Server
=======================

A philosophical Python learning platform.

Run with:
    python app.py          # development server on port 5000
    flask run --port 5000  # alternative via Flask CLI

Storage Modes:
    - SQLite (default): STORAGE_MODE=sqlite
    - MongoDB: STORAGE_MODE=mongodb, MONGODB_URI=mongodb://localhost:27017/pybe
               Or for Atlas: mongodb+srv://user:password@cluster.mongodb.net/pybe

AI Providers:
    - Groq (recommended): GROQ_API_KEY env var (fast, free tier available)
    - OpenAI: OPENAI_API_KEY env var (gpt-4o, etc.)
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from src.engine import ScenarioEngine, ScenarioNotFoundError
from src.models import db, Progress, User
from src.database import init_mongodb, is_mongodb
from src.routes.auth import auth_bp
from src.routes.scenarios import scenarios_bp
from src.routes.users import users_bp
from src.routes.gamification import gamification_bp
from src.routes.progress import progress_bp
from src.routes.contributors import contributors_bp
from src.routes.reviews import reviews_bp
from src.routes.docs import api_docs_bp
from src.services.ai_evaluator import AIEvaluator, StreamEvent, StreamEventType

# Optional middleware (graceful degradation if not installed)
try:
    from src.middleware.rate_limit import init_rate_limiting
    RATE_LIMITING_AVAILABLE = True
except ImportError:
    RATE_LIMITING_AVAILABLE = False

try:
    from src.middleware.cache import init_caching
    CACHING_AVAILABLE = True
except ImportError:
    CACHING_AVAILABLE = False

try:
    from src.websocket_events import init_websocket_events
    WEBSOCKET_EVENTS_AVAILABLE = True
except ImportError:
    WEBSOCKET_EVENTS_AVAILABLE = False

# ---------------------------------------------------------------------------
# App factory & configuration
# ---------------------------------------------------------------------------

socketio = SocketIO(cors_allowed_origins="*")
ai_evaluator = AIEvaluator()


def create_app(test_config=False) -> Flask:
    """Application factory creates and configures the Flask app."""

    app = Flask(__name__)

    storage_mode = os.environ.get('STORAGE_MODE', 'sqlite').lower()
    app.config['STORAGE_MODE'] = storage_mode

    JWT_SECRET = os.environ.get('JWT_SECRET')
    if not JWT_SECRET:
        if os.environ.get('FLASK_ENV') == 'production':
            raise ValueError("JWT_SECRET environment variable must be set in production")
        JWT_SECRET = 'super-secret-key-for-dev'
    app.config['JWT_SECRET'] = JWT_SECRET

    if test_config:
        app.config.update({
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
            "SQLALCHEMY_TRACK_MODIFICATIONS": False
        })
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///pybe.db')
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    socketio.init_app(app)

    # Initialize WebSocket events if available
    if WEBSOCKET_EVENTS_AVAILABLE:
        try:
            init_websocket_events(socketio)
        except Exception as e:
            print(f"[pyBE] WebSocket events initialization failed: {e}")

    if not test_config and storage_mode == 'mongodb':
        mongodb_connected = init_mongodb()
        if mongodb_connected:
            print("[pyBE] Running in MONGODB mode")
            from src.mongo_models import create_indexes
            create_indexes()
        else:
            print("[pyBE] MongoDB connection failed, falling back to SQLite")
            app.config['STORAGE_MODE'] = 'sqlite'

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(scenarios_bp, url_prefix='/api')
    app.register_blueprint(users_bp, url_prefix='/api')
    app.register_blueprint(gamification_bp, url_prefix='/api')
    app.register_blueprint(progress_bp, url_prefix='/api')
    app.register_blueprint(contributors_bp, url_prefix='/api')
    app.register_blueprint(reviews_bp, url_prefix='/api')
    app.register_blueprint(api_docs_bp, url_prefix='/api')

    # Enable CORS (configure CORS_ORIGINS env var for production)
    CORS(app, resources={r"/api/*": {"origins": os.environ.get('CORS_ORIGINS', '*')}})

    # Determine the scenarios directory (allow override via env var)
    scenarios_dir = os.environ.get(
        "PYBE_SCENARIOS_DIR",
        str(Path(__file__).resolve().parent / "src" / "scenarios"),
    )

    # Initialise the scenario engine and store in app config
    engine = ScenarioEngine(scenarios_dir)
    loaded = engine.load_all()
    app.config['engine'] = engine
    app.config['scenarios_dir'] = scenarios_dir
    print(f"[pyBE] Loaded {loaded} scenario(s) from {scenarios_dir}")

    with app.app_context():
        db.create_all()

    # Initialize rate limiting if available
    if RATE_LIMITING_AVAILABLE and not test_config:
        try:
            init_rate_limiting(app)
        except Exception as e:
            print(f"[pyBE] Rate limiting initialization failed: {e}")

    # Initialize caching if available
    if CACHING_AVAILABLE and not test_config:
        try:
            init_caching(app)
        except Exception as e:
            print(f"[pyBE] Caching initialization failed: {e}")

    # ------------------------------------------------------------------
    # Error handlers
    # ------------------------------------------------------------------

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Not found", "message": str(error)}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error", "message": str(error)}), 500

    # ------------------------------------------------------------------
    # Health check
    # ------------------------------------------------------------------

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "ok",
            "version": "0.1.0",
            "name": "pyBE",
            "storage_mode": app.config.get('STORAGE_MODE', 'sqlite'),
            "mongodb_connected": is_mongodb(),
        })

    # ------------------------------------------------------------------
    # Root route
    # ------------------------------------------------------------------

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "message": "pyBE API is running",
            "health": "/api/health",
            "scenarios": "/api/scenarios"
        })

    # ------------------------------------------------------------------
    # REST endpoint for AI Evaluation
    # ------------------------------------------------------------------

    @app.route("/api/evaluate", methods=["POST"])
    def evaluate_code():
        """
        Evaluate learner code against a scenario (REST alternative to WebSocket).

        B1 Spec Response Format:
        {
            "scores": { "reasoning": 0-40, "code": 0-30, "reflection": 0-30 },
            "totalScore": 0-100,
            "misconceptionsDetected": ["..."],
            "feedbackByPillar": {
                "reasoning": "specific feedback",
                "code": "specific feedback",
                "reflection": "specific feedback"
            },
            "nextStepSuggestion": "what to explore next",
            "praisePoint": "genuine specific thing they did well",
            "constructs_demonstrated": ["..."]
        }
        """
        data = request.get_json()
        code = data.get('code', '')
        scenario_id = data.get('scenario_id')
        reasoning = data.get('reasoning', '')

        engine = app.config.get('engine')
        try:
            scenario = engine.get_scenario(scenario_id)
        except ScenarioNotFoundError:
            return jsonify({'error': 'Scenario not found'}), 404

        result, score = ai_evaluator.evaluate(code, scenario, stream=False, reasoning=reasoning)

        if isinstance(result, dict) and 'error' in result and result.get('error') in ('parse_failed', 'empty_response'):
            return jsonify({
                'error': 'Evaluation failed',
                'feedback': result.get('feedback', 'Could not parse AI evaluation result')
            }), 500

        return jsonify(result)

    # ------------------------------------------------------------------
    # WebSockets for AI Evaluator REAL STREAMING
    # ------------------------------------------------------------------

    @socketio.on('evaluate_code')
    def handle_evaluate_code(data):
        """
        Handle WebSocket code evaluation request with TRUE STREAMING.

        B1 Spec: Uses OpenAI's streaming API to yield tokens in real-time.

        Events emitted:
        - evaluation_status: Initial status message
        - evaluation_chunk: Individual token chunks (breakdown, feedback)
        - evaluation_complete: Final result with B1 spec format:
            {
                score, scores (breakdown), feedback, feedbackByPillar,
                next_step, constructs, misconceptions, praisePoint
            }
        - evaluation_error: Error if something fails
        """
        engine = app.config.get('engine')
        code = data.get('code', '')
        scenario_id = data.get('scenario_id')
        reasoning = data.get('reasoning', '')

        try:
            scenario = engine.get_scenario(scenario_id)
        except ScenarioNotFoundError:
            emit('evaluation_error', {'error': 'Scenario not found'})
            return

        emit('evaluation_status', {'status': 'thinking', 'message': 'Evaluating your code...'})

        stream_generator, _ = ai_evaluator.evaluate(
            code, scenario, stream=True, reasoning=reasoning
        )

        try:
            complete_data = {}
            for event in stream_generator:
                if event.event_type == StreamEventType.STATUS:
                    emit('evaluation_status', event.data)

                elif event.event_type == StreamEventType.BREAKDOWN:
                    for key, value in event.data.items():
                        emit('evaluation_chunk', {
                            'type': 'breakdown',
                            'key': key,
                            'value': value
                        })

                elif event.event_type == StreamEventType.FEEDBACK_CHUNK:
                    emit('evaluation_chunk', {
                        'type': 'feedback',
                        'chunk': event.data.get('chunk', '')
                    })

                elif event.event_type == StreamEventType.COMPLETE:
                    complete_data = event.data

                elif event.event_type == StreamEventType.ERROR:
                    emit('evaluation_error', event.data)

            if complete_data:
                emit('evaluation_complete', {
                    'score': complete_data.get('score', 50),
                    'scores': complete_data.get('scores', {'reasoning': 50, 'code': 50, 'reflection': 50}),
                    'feedback': complete_data.get('feedback', ''),
                    'feedbackByPillar': complete_data.get('feedbackByPillar', {}),
                    'next_step': complete_data.get('next_step', ''),
                    'constructs': complete_data.get('constructs', []),
                    'misconceptions': complete_data.get('misconceptions', []),
                    'praisePoint': complete_data.get('praisePoint', 'Good work!')
                })

        except Exception as e:
            emit('evaluation_error', {'error': str(e)})

    @socketio.on('request_hint')
    def handle_hint_request(data):
        """
        Handle WebSocket hint request with AI-driven contextual hints.

        When API key is available, generates Socratic hints using AI.
        Falls back to mock hints when no API key.
        """
        engine = app.config.get('engine')
        scenario_id = data.get('scenario_id')
        current_attempt = data.get('current_attempt', '')
        hints_given = data.get('hints_given', [])

        try:
            scenario = engine.get_scenario(scenario_id)
        except ScenarioNotFoundError:
            emit('hint_response', {'error': 'Scenario not found'})
            return

        emit('hint_status', {'status': 'thinking', 'message': 'Generating a hint for you...'})

        hint_data = ai_evaluator.get_hint(scenario, current_attempt, hints_given)
        emit('hint_response', hint_data)

    return app


# ---------------------------------------------------------------------------
# Development entry-point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app = create_app()
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.environ.get("PYBE_PORT", 5000)),
        debug=True,
        allow_unsafe_werkzeug=True
    )