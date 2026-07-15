"""
Comprehensive test configuration and fixtures for pyBE tests.
"""

import pytest
from datetime import datetime, timedelta
import jwt


@pytest.fixture
def app():
    """Create test Flask application with in-memory database."""
    import sys
    import os

    # Ensure correct import path
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    from app import create_app
    from src.models import db

    app = create_app(test_config=True)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Create CLI test runner."""
    return app.test_cli_runner()


@pytest.fixture
def app_context(app):
    """Provide application context."""
    with app.app_context():
        yield


@pytest.fixture
def auth_headers(client):
    """Create a test user and return auth headers."""
    import json

    # Register user
    client.post('/api/auth/register',
        data=json.dumps({
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }),
        content_type='application/json'
    )

    # Login to get token
    res = client.post('/api/auth/login',
        data=json.dumps({
            'username': 'testuser',
            'password': 'testpass123'
        }),
        content_type='application/json'
    )
    data = json.loads(res.data)
    token = data.get('token', '')
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def admin_headers(client):
    """Create an admin user and return auth headers."""
    import json

    # Use setup-admin endpoint
    res = client.post('/api/auth/setup-admin',
        data=json.dumps({
            'username': 'adminuser',
            'password': 'adminpass123',
            'secret': 'pybe-admin-setup-secret'
        }),
        content_type='application/json'
    )

    # Login to get token
    res = client.post('/api/auth/login',
        data=json.dumps({
            'username': 'adminuser',
            'password': 'adminpass123'
        }),
        content_type='application/json'
    )
    data = json.loads(res.data)
    token = data.get('token', '')
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def second_user_headers(client):
    """Create a second test user and return auth headers."""
    import json

    # Register second user
    client.post('/api/auth/register',
        data=json.dumps({
            'username': 'seconduser',
            'email': 'second@example.com',
            'password': 'secondpass123'
        }),
        content_type='application/json'
    )

    # Login to get token
    res = client.post('/api/auth/login',
        data=json.dumps({
            'username': 'seconduser',
            'password': 'secondpass123'
        }),
        content_type='application/json'
    )
    data = json.loads(res.data)
    token = data.get('token', '')
    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def expired_token(app):
    """Create an expired JWT token for testing token expiration."""
    with app.app_context():
        secret = app.config.get('JWT_SECRET', 'super-secret-key-for-dev')
        token = jwt.encode({
            'user_id': 1,
            'exp': datetime.utcnow() - timedelta(days=1)  # Expired yesterday
        }, secret, algorithm='HS256')
        return token


@pytest.fixture
def invalid_token():
    """Return an invalid JWT token."""
    return 'invalid.token.here'


@pytest.fixture
def sample_progress_data():
    """Sample progress data for testing."""
    return {
        'user_id': 1,
        'scenario_id': 'fellowship-graph',
        'quality': 4,
        'status': 'completed',
        'score': 80
    }


@pytest.fixture
def sample_scenario_data():
    """Sample valid scenario data for validation testing."""
    return {
        'id': 'test-scenario',
        'title': 'The Test Scenario That Is Valid',
        'domain': 'Science',
        'pythonConcept': 'Variables and Data Types',
        'difficultyLevel': 2,
        'jonasanType': 'Structured Inquiry',
        'philosophicalAnchor': 'This is a test philosophical anchor that is long enough to pass validation with over 50 characters for deep explanation.',
        'theoryPillar': 'Theory pillar content here - explaining why this matters deeply in a philosophical context.',
        'anchorPillar': 'Anchor pillar content here - showing interdisciplinary mapping to the domain.',
        'triggerPillar': 'Trigger pillar content here - explaining how the case study forces discovery of the concept.',
        'realityPillar': 'Reality pillar content here - connecting to real engineering practices and production patterns.',
        'caseStudy': 'This is a case study that is long enough to pass validation with over 100 characters as required for the scenario.',
        'hints': [
            {'level': 1, 'text': 'Can you think about what the object knows about itself?'},
            {'level': 2, 'text': 'Is there a built-in way to list all attributes of an object?'},
            {'level': 3, 'text': 'What if you could ask the object to describe itself first?'}
        ]
    }


@pytest.fixture
def sample_discussion_post():
    """Sample discussion post data."""
    return {
        'author': 'TestUser',
        'text': 'This is a test discussion comment about the scenario.',
        'python_construct': 'class',
        'domain_connection': 'Object-oriented programming'
    }


@pytest.fixture
def mock_scenario_engine(app):
    """Create a mock scenario engine for testing."""
    from src.engine import ScenarioEngine
    import os
    scenarios_dir = os.environ.get(
        'PYBE_SCENARIOS_DIR',
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'src', 'scenarios')
    )
    engine = ScenarioEngine(scenarios_dir)
    engine.load_all()
    return engine


@pytest.fixture
def user_with_progress(client, auth_headers):
    """Create user with completed scenario progress."""
    import json

    # Save progress
    client.post('/api/progress',
        data=json.dumps({
            'scenario_id': 'fellowship-graph',
            'quality': 4,
            'status': 'completed',
            'score': 80
        }),
        content_type='application/json',
        headers=auth_headers
    )

    return auth_headers


@pytest.fixture
def multiple_users_with_progress(client):
    """Create multiple users with various progress for leaderboard testing."""
    import json

    users = []
    # First user completes scenarios
    client.post('/api/auth/register',
        data=json.dumps({'username': 'user1', 'email': 'user1@test.com', 'password': 'pass123'}),
        content_type='application/json'
    )
    res = client.post('/api/auth/login',
        data=json.dumps({'username': 'user1', 'password': 'pass123'}),
        content_type='application/json'
    )
    token1 = json.loads(res.data)['token']
    headers1 = {'Authorization': f'Bearer {token1}'}

    client.post('/api/progress',
        data=json.dumps({'scenario_id': 'fellowship-graph', 'quality': 5, 'status': 'completed', 'score': 100}),
        content_type='application/json', headers=headers1
    )
    client.post('/api/progress',
        data=json.dumps({'scenario_id': 'buddhist-monk', 'quality': 4, 'status': 'completed', 'score': 80}),
        content_type='application/json', headers=headers1
    )
    users.append(headers1)

    # Second user completes one scenario
    client.post('/api/auth/register',
        data=json.dumps({'username': 'user2', 'email': 'user2@test.com', 'password': 'pass123'}),
        content_type='application/json'
    )
    res = client.post('/api/auth/login',
        data=json.dumps({'username': 'user2', 'password': 'pass123'}),
        content_type='application/json'
    )
    token2 = json.loads(res.data)['token']
    headers2 = {'Authorization': f'Bearer {token2}'}

    client.post('/api/progress',
        data=json.dumps({'scenario_id': 'fellowship-graph', 'quality': 3, 'status': 'completed', 'score': 60}),
        content_type='application/json', headers=headers2
    )
    users.append(headers2)

    return users