"""
Comprehensive API endpoint tests for pyBE.
Covers all routes with edge cases and error handling.
"""

import pytest
import json


class TestHealthEndpoints:
    """Test health and root endpoints."""

    def test_health_check_returns_ok(self, client):
        """Health endpoint should return status ok."""
        res = client.get('/api/health')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['status'] == 'ok'
        assert data['name'] == 'pyBE'
        assert 'version' in data

    def test_health_includes_storage_mode(self, client):
        """Health endpoint should include storage mode info."""
        res = client.get('/api/health')
        data = json.loads(res.data)
        assert 'storage_mode' in data
        assert data['storage_mode'] == 'sqlite'  # test_config uses sqlite

    def test_root_endpoint(self, client):
        """Root endpoint should return API info."""
        res = client.get('/')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'message' in data
        assert 'health' in data
        assert 'scenarios' in data


class TestAuthentication:
    """Test authentication endpoints."""

    def test_register_success(self, client):
        """User should be able to register with valid credentials."""
        res = client.post('/api/auth/register',
            data=json.dumps({
                'username': 'newuser',
                'email': 'newuser@example.com',
                'password': 'securepass123'
            }),
            content_type='application/json'
        )
        assert res.status_code == 201
        data = json.loads(res.data)
        assert 'message' in data
        assert data['message'] == 'User registered successfully'

    def test_register_missing_username(self, client):
        """Registration should fail without username."""
        res = client.post('/api/auth/register',
            data=json.dumps({'password': 'pass123'}),
            content_type='application/json'
        )
        assert res.status_code == 400
        data = json.loads(res.data)
        assert 'error' in data

    def test_register_missing_password(self, client):
        """Registration should fail without password."""
        res = client.post('/api/auth/register',
            data=json.dumps({'username': 'user'}),
            content_type='application/json'
        )
        assert res.status_code == 400

    def test_register_duplicate_username(self, client):
        """Registration should fail for duplicate username."""
        # First registration
        client.post('/api/auth/register',
            data=json.dumps({'username': 'dupuser', 'password': 'pass123'}),
            content_type='application/json'
        )
        # Duplicate registration
        res = client.post('/api/auth/register',
            data=json.dumps({'username': 'dupuser', 'password': 'pass456'}),
            content_type='application/json'
        )
        assert res.status_code == 409
        data = json.loads(res.data)
        assert 'error' in data

    def test_login_success_with_username(self, client):
        """User should be able to login with username."""
        # Register
        client.post('/api/auth/register',
            data=json.dumps({'username': 'loginuser', 'password': 'pass123'}),
            content_type='application/json'
        )
        # Login
        res = client.post('/api/auth/login',
            data=json.dumps({'username': 'loginuser', 'password': 'pass123'}),
            content_type='application/json'
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'token' in data
        assert 'user' in data
        assert data['user']['username'] == 'loginuser'

    def test_login_success_with_email(self, client):
        """User should be able to login with email."""
        # Register with email
        client.post('/api/auth/register',
            data=json.dumps({
                'username': 'emailuser',
                'email': 'email@test.com',
                'password': 'pass123'
            }),
            content_type='application/json'
        )
        # Login with email
        res = client.post('/api/auth/login',
            data=json.dumps({'email': 'email@test.com', 'password': 'pass123'}),
            content_type='application/json'
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'token' in data

    def test_login_invalid_password(self, client):
        """Login should fail with wrong password."""
        client.post('/api/auth/register',
            data=json.dumps({'username': 'user', 'password': 'correct'}),
            content_type='application/json'
        )
        res = client.post('/api/auth/login',
            data=json.dumps({'username': 'user', 'password': 'wrong'}),
            content_type='application/json'
        )
        assert res.status_code == 401

    def test_login_nonexistent_user(self, client):
        """Login should fail for nonexistent user."""
        res = client.post('/api/auth/login',
            data=json.dumps({'username': 'nobody', 'password': 'pass'}),
            content_type='application/json'
        )
        assert res.status_code == 401

    def test_refresh_token_success(self, client, auth_headers):
        """Valid token should be refreshable."""
        res = client.post('/api/auth/refresh',
            headers=auth_headers
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'token' in data

    def test_refresh_token_expired(self, client, expired_token):
        """Expired token should not be refreshable."""
        res = client.post('/api/auth/refresh',
            headers={'Authorization': f'Bearer {expired_token}'}
        )
        assert res.status_code == 401

    def test_refresh_token_invalid(self, client, invalid_token):
        """Invalid token should not be refreshable."""
        res = client.post('/api/auth/refresh',
            headers={'Authorization': f'Bearer {invalid_token}'}
        )
        assert res.status_code == 401

    def test_refresh_token_missing(self, client):
        """Request without token should fail."""
        res = client.post('/api/auth/refresh')
        assert res.status_code == 401

    def test_setup_admin_success(self, client):
        """Admin should be creatable with correct secret."""
        res = client.post('/api/auth/setup-admin',
            data=json.dumps({
                'username': 'newadmin',
                'password': 'adminpass',
                'secret': 'pybe-admin-setup-secret'
            }),
            content_type='application/json'
        )
        assert res.status_code == 201
        data = json.loads(res.data)
        assert 'message' in data
        assert 'newadmin' in data['message']

    def test_setup_admin_wrong_secret(self, client):
        """Admin creation should fail with wrong secret."""
        res = client.post('/api/auth/setup-admin',
            data=json.dumps({
                'username': 'newadmin',
                'password': 'adminpass',
                'secret': 'wrong-secret'
            }),
            content_type='application/json'
        )
        assert res.status_code == 403

    def test_setup_admin_missing_fields(self, client):
        """Admin creation should fail with missing fields."""
        res = client.post('/api/auth/setup-admin',
            data=json.dumps({'secret': 'pybe-admin-setup-secret'}),
            content_type='application/json'
        )
        assert res.status_code == 400


class TestScenarios:
    """Test scenario endpoints."""

    def test_list_scenarios(self, client):
        """Should return list of scenarios."""
        res = client.get('/api/scenarios')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'scenarios' in data
        assert 'count' in data
        assert isinstance(data['scenarios'], list)

    def test_list_scenarios_filter_by_domain(self, client):
        """Should filter scenarios by domain."""
        res = client.get('/api/scenarios?domain=Philosophy')
        assert res.status_code == 200
        data = json.loads(res.data)
        for scenario in data['scenarios']:
            assert scenario['domain'] == 'Philosophy'

    def test_list_scenarios_filter_by_level(self, client):
        """Should filter scenarios by difficulty level."""
        res = client.get('/api/scenarios?level=3')
        assert res.status_code == 200
        data = json.loads(res.data)
        for scenario in data['scenarios']:
            assert scenario['difficultyLevel'] == 3

    def test_list_scenarios_filter_by_type(self, client):
        """Should filter scenarios by Jonasan type."""
        res = client.get('/api/scenarios?type=Dilemma')
        assert res.status_code == 200
        data = json.loads(res.data)
        for scenario in data['scenarios']:
            assert scenario['jonasanType'] == 'Dilemma'

    def test_list_scenarios_empty_filter(self, client):
        """Should return all scenarios for non-matching filter."""
        res = client.get('/api/scenarios?domain=NonExistent')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['count'] == 0

    def test_get_scenario_detail(self, client):
        """Should return full scenario details."""
        res = client.get('/api/scenarios/fellowship-graph')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['id'] == 'fellowship-graph'
        assert 'title' in data
        assert 'domain' in data

    def test_get_scenario_not_found(self, client):
        """Should return 404 for nonexistent scenario."""
        res = client.get('/api/scenarios/nonexistent-scenario')
        assert res.status_code == 404
        data = json.loads(res.data)
        assert 'error' in data

    def test_get_scenario_hints(self, client):
        """Should return scenario hints."""
        res = client.get('/api/scenarios/fellowship-graph/hints')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'hints' in data
        assert data['scenarioId'] == 'fellowship-graph'
        assert 'revealedCount' in data

    def test_get_scenario_hints_with_reveal(self, client):
        """Should return limited hints based on reveal param."""
        res = client.get('/api/scenarios/fellowship-graph/hints?reveal=2')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['revealedCount'] == 2
        assert len(data['hints']) == 2

    def test_get_scenario_hints_invalid_reveal(self, client):
        """Should return 400 for invalid reveal param."""
        res = client.get('/api/scenarios/fellowship-graph/hints?reveal=abc')
        assert res.status_code == 400

    def test_get_solutions(self, client):
        """Should return scenario solutions."""
        res = client.get('/api/scenarios/fellowship-graph/solutions')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'solutions' in data
        assert data['scenarioId'] == 'fellowship-graph'
        assert 'count' in data

    def test_get_reflection(self, client):
        """Should return reflection prompts."""
        res = client.get('/api/scenarios/fellowship-graph/reflection')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'reflection' in data
        assert data['scenarioId'] == 'fellowship-graph'

    def test_get_rubric(self, client):
        """Should return scoring rubric."""
        res = client.get('/api/scenarios/fellowship-graph/rubric')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'rubric' in data
        assert data['scenarioId'] == 'fellowship-graph'

    def test_get_report_data(self, client):
        """Should return full report data."""
        res = client.get('/api/scenarios/fellowship-graph/report')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'scenario' in data
        assert 'hints' in data
        assert 'solutions' in data
        assert 'reflection' in data
        assert 'rubric' in data

    def test_get_report_data_with_auth(self, client, auth_headers):
        """Should include user progress in report when authenticated."""
        res = client.get('/api/scenarios/fellowship-graph/report',
            headers=auth_headers)
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'userProgress' in data


class TestProgress:
    """Test progress endpoints."""

    def test_save_progress_requires_auth(self, client):
        """Should require authentication to save progress."""
        res = client.post('/api/progress',
            data=json.dumps({'scenario_id': 'test', 'quality': 4}),
            content_type='application/json'
        )
        assert res.status_code == 401

    def test_save_progress_success(self, client, auth_headers):
        """Should save progress when authenticated."""
        res = client.post('/api/progress',
            data=json.dumps({
                'scenario_id': 'fellowship-graph',
                'quality': 4,
                'status': 'completed',
                'score': 80
            }),
            content_type='application/json',
            headers=auth_headers
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'progress' in data
        assert 'next_review_date' in data['progress']

    def test_save_progress_updates_existing(self, client, auth_headers):
        """Should update existing progress record."""
        # First save
        client.post('/api/progress',
            data=json.dumps({'scenario_id': 'fellowship-graph', 'quality': 3}),
            content_type='application/json',
            headers=auth_headers
        )
        # Second save (update)
        res = client.post('/api/progress',
            data=json.dumps({'scenario_id': 'fellowship-graph', 'quality': 5}),
            content_type='application/json',
            headers=auth_headers
        )
        assert res.status_code == 200

    def test_get_user_progress(self, client, auth_headers):
        """Should get user's progress records."""
        # Create some progress
        client.post('/api/progress',
            data=json.dumps({'scenario_id': 'fellowship-graph', 'quality': 4}),
            content_type='application/json',
            headers=auth_headers
        )
        res = client.get('/api/progress/1',
            headers=auth_headers
        )
        assert res.status_code == 200

    def test_get_due_progress(self, client, auth_headers):
        """Should get scenarios due for review."""
        res = client.get('/api/progress/due/1',
            headers=auth_headers
        )
        assert res.status_code == 200


class TestDiscussions:
    """Test discussion endpoints."""

    def test_get_discussions(self, client):
        """Should return discussion threads."""
        res = client.get('/api/scenarios/fellowship-graph/discussions')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'threads' in data
        assert isinstance(data['threads'], list)

    def test_post_discussion(self, client, sample_discussion_post):
        """Should create a new discussion comment."""
        res = client.post('/api/scenarios/fellowship-graph/discussions',
            data=json.dumps(sample_discussion_post),
            content_type='application/json'
        )
        assert res.status_code == 201
        data = json.loads(res.data)
        assert 'comment' in data
        assert data['comment']['text'] == sample_discussion_post['text']

    def test_post_discussion_missing_text(self, client):
        """Should fail when text is missing."""
        res = client.post('/api/scenarios/fellowship-graph/discussions',
            data=json.dumps({'author': 'User'}),
            content_type='application/json'
        )
        assert res.status_code == 400

    def test_post_discussion_with_parent(self, client, sample_discussion_post):
        """Should create a reply to existing comment."""
        # First create parent comment
        parent_res = client.post('/api/scenarios/fellowship-graph/discussions',
            data=json.dumps(sample_discussion_post),
            content_type='application/json'
        )
        parent_id = json.loads(parent_res.data)['comment']['id']

        # Create reply
        reply_data = sample_discussion_post.copy()
        reply_data['parent_id'] = parent_id
        res = client.post('/api/scenarios/fellowship-graph/discussions',
            data=json.dumps(reply_data),
            content_type='application/json'
        )
        assert res.status_code == 201

    def test_upvote_discussion(self, client):
        """Should increment comment upvotes."""
        # Create comment
        client.post('/api/scenarios/fellowship-graph/discussions',
            data=json.dumps({'author': 'User', 'text': 'Test comment'}),
            content_type='application/json'
        )
        # Upvote
        res = client.post('/api/scenarios/fellowship-graph/discussions/1/upvote',
            content_type='application/json'
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['upvotes'] == 1

    def test_accept_discussion(self, client):
        """Should mark comment as accepted."""
        # Create comment
        client.post('/api/scenarios/fellowship-graph/discussions',
            data=json.dumps({'author': 'User', 'text': 'Test comment'}),
            content_type='application/json'
        )
        # Accept
        res = client.post('/api/scenarios/fellowship-graph/discussions/1/accept',
            content_type='application/json'
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['is_accepted'] is True

    def test_upvote_nonexistent_comment(self, client):
        """Should return 404 for nonexistent comment."""
        res = client.post('/api/scenarios/fellowship-graph/discussions/9999/upvote',
            content_type='application/json'
        )
        assert res.status_code == 404


class TestGamification:
    """Test gamification endpoints."""

    def test_get_profile(self, client, auth_headers):
        """Should return user gamification profile."""
        res = client.get('/api/gamification/profile',
            headers=auth_headers
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'xp' in data
        assert 'level' in data
        assert 'levelName' in data
        assert 'badges' in data
        assert 'completedCount' in data
        assert 'allBadges' in data

    def test_profile_shows_progress(self, client, user_with_progress):
        """Profile should reflect user progress."""
        res = client.get('/api/gamification/profile',
            headers=user_with_progress
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['completedCount'] >= 1

    def test_leaderboard(self, client):
        """Should return leaderboard."""
        res = client.get('/api/gamification/leaderboard')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'leaderboard' in data
        assert isinstance(data['leaderboard'], list)

    def test_leaderboard_with_limit(self, client):
        """Should respect limit parameter."""
        res = client.get('/api/gamification/leaderboard?limit=5')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert len(data['leaderboard']) <= 5

    def test_leaderboard_ordered_by_xp(self, client, multiple_users_with_progress):
        """Leaderboard should be ordered by XP descending."""
        res = client.get('/api/gamification/leaderboard')
        data = json.loads(res.data)
        leaderboard = data['leaderboard']
        if len(leaderboard) > 1:
            for i in range(len(leaderboard) - 1):
                assert leaderboard[i]['xp'] >= leaderboard[i + 1]['xp']


class TestUsers:
    """Test user endpoints."""

    def test_user_stats_requires_auth(self, client):
        """User stats should require authentication."""
        res = client.get('/api/users/stats')
        assert res.status_code == 401

    def test_user_stats_with_auth(self, client, auth_headers):
        """Should return user stats when authenticated."""
        res = client.get('/api/users/stats',
            headers=auth_headers
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'labels' in data
        assert 'data' in data

    def test_user_domains_requires_auth(self, client):
        """User domains should require authentication."""
        res = client.get('/api/users/domains')
        assert res.status_code == 401

    def test_user_domains_with_auth(self, client, auth_headers):
        """Should return domain graph data when authenticated."""
        res = client.get('/api/users/domains',
            headers=auth_headers
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'nodes' in data
        assert 'links' in data

    def test_user_progress(self, client, auth_headers):
        """Should return user progress records."""
        res = client.get('/api/users/1/progress',
            headers=auth_headers
        )
        assert res.status_code == 200


class TestEvaluate:
    """Test AI evaluation endpoints."""

    def test_evaluate_with_valid_code(self, client):
        """Should evaluate valid code."""
        res = client.post('/api/evaluate',
            data=json.dumps({
                'code': 'print("Hello, World!")',
                'scenario_id': 'fellowship-graph',
                'reasoning': 'I used print to output the greeting.'
            }),
            content_type='application/json'
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'totalScore' in data or 'feedback' in data or 'scores' in data

    def test_evaluate_invalid_scenario(self, client):
        """Should return 404 for invalid scenario."""
        res = client.post('/api/evaluate',
            data=json.dumps({
                'code': 'print("test")',
                'scenario_id': 'nonexistent'
            }),
            content_type='application/json'
        )
        assert res.status_code == 404

    def test_evaluate_empty_code(self, client):
        """Should handle empty code gracefully."""
        res = client.post('/api/evaluate',
            data=json.dumps({
                'code': '',
                'scenario_id': 'fellowship-graph'
            }),
            content_type='application/json'
        )
        # Should still return a response (mock evaluator handles empty)
        assert res.status_code == 200


class TestNotifications:
    """Test notification endpoints."""

    def test_get_notifications_requires_auth(self, client):
        """Should require auth for notifications."""
        res = client.get('/api/notifications')
        assert res.status_code == 401

    def test_get_notifications(self, client, auth_headers):
        """Should return user notifications."""
        res = client.get('/api/notifications',
            headers=auth_headers
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert isinstance(data, (list, dict))

    def test_mark_notification_read(self, client, auth_headers):
        """Should mark notification as read."""
        # Create a notification first (via review submission)
        res = client.post('/api/notifications/1/read',
            headers=auth_headers
        )
        # May be 200 or 404 if no notification exists
        assert res.status_code in [200, 404]

    def test_mark_all_notifications_read(self, client, auth_headers):
        """Should mark all notifications as read."""
        res = client.post('/api/notifications/read-all',
            headers=auth_headers
        )
        assert res.status_code == 200


class TestReviews:
    """Test review workflow endpoints."""

    def test_get_pending_reviews_requires_admin(self, client, auth_headers):
        """Should require admin for pending reviews."""
        res = client.get('/api/reviews/pending',
            headers=auth_headers
        )
        assert res.status_code == 403

    def test_get_pending_reviews_as_admin(self, client, admin_headers):
        """Should return pending reviews for admin."""
        res = client.get('/api/reviews/pending',
            headers=admin_headers
        )
        assert res.status_code == 200

    def test_submit_for_review_requires_auth(self, client):
        """Should require auth to submit for review."""
        res = client.post('/api/reviews/submit',
            data=json.dumps({'scenario_id': 'test'}),
            content_type='application/json'
        )
        assert res.status_code == 401


class TestReload:
    """Test scenario hot-reload endpoint."""

    def test_reload_scenarios(self, client):
        """Should reload scenarios from disk."""
        res = client.post('/api/reload')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['status'] == 'reloaded'
        assert 'count' in data
        assert data['count'] > 0


class TestSchema:
    """Test scenario schema validation."""

    def test_validate_valid_scenario(self, client, sample_scenario_data):
        """Should validate a correct scenario."""
        res = client.post('/api/scenarios/validate',
            data=json.dumps(sample_scenario_data),
            content_type='application/json'
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['valid'] is True
        assert data['errorCount'] == 0

    def test_validate_invalid_scenario(self, client):
        """Should reject invalid scenario data."""
        invalid_data = {
            'id': 'bad id',  # Invalid: contains space
            'title': 'Short',  # Too short
        }
        res = client.post('/api/scenarios/validate',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        assert res.status_code == 200
        data = json.loads(res.data)
        assert data['valid'] is False
        assert data['errorCount'] > 0

    def test_get_schema(self, client):
        """Should return schema specification."""
        res = client.get('/api/scenarios/schema')
        assert res.status_code == 200
        data = json.loads(res.data)
        assert 'required' in data
        assert 'optional' in data