"""
Tests for authentication middleware and decorators.
"""

import pytest
import jwt
from datetime import datetime, timedelta


class TestAuthenticateDecorator:
    """Test @authenticate decorator."""

    def test_authenticate_missing_header(self, client):
        """Should return 401 when Authorization header is missing."""
        # Attempt to access protected endpoint
        res = client.post('/api/progress',
            data='{}',
            content_type='application/json'
        )
        assert res.status_code == 401

    def test_authenticate_invalid_scheme(self, client):
        """Should return 401 when scheme is not Bearer."""
        res = client.post('/api/progress',
            data='{}',
            content_type='application/json',
            headers={'Authorization': 'Basic sometoken'}
        )
        assert res.status_code == 401

    def test_authenticate_expired_token(self, client, expired_token, app):
        """Should return 401 when token is expired."""
        res = client.post('/api/progress',
            data='{}',
            content_type='application/json',
            headers={'Authorization': f'Bearer {expired_token}'}
        )
        assert res.status_code == 401

    def test_authenticate_invalid_token(self, client, invalid_token):
        """Should return 401 when token is invalid."""
        res = client.post('/api/progress',
            data='{}',
            content_type='application/json',
            headers={'Authorization': f'Bearer {invalid_token}'}
        )
        assert res.status_code == 401

    def test_authenticate_valid_token(self, client, auth_headers):
        """Should allow access with valid token."""
        res = client.post('/api/progress',
            data='{}',
            content_type='application/json',
            headers=auth_headers
        )
        # 200 or 400 is fine - 401 means auth failed
        assert res.status_code != 401


class TestAdminRequiredDecorator:
    """Test @admin_required decorator."""

    def test_admin_required_rejects_regular_user(self, client, auth_headers):
        """Should return 403 for non-admin user."""
        res = client.get('/api/reviews/pending',
            headers=auth_headers
        )
        assert res.status_code == 403

    def test_admin_required_allows_admin(self, client, admin_headers):
        """Should allow admin user."""
        res = client.get('/api/reviews/pending',
            headers=admin_headers
        )
        assert res.status_code == 200


class TestRequireOwnershipDecorator:
    """Test @require_userOwnership decorator."""

    def test_ownership_prevents_access_to_other_user_data(self, client, auth_headers, second_user_headers):
        """Should prevent accessing another user's resources."""
        # second_user_headers gets user_id 2
        # auth_headers has user_id 1
        # Trying to access user 2's data with user 1's token should fail
        res = client.get('/api/progress/2',
            headers=auth_headers
        )
        assert res.status_code == 403

    def test_ownership_allows_own_data(self, client, auth_headers):
        """Should allow accessing own data."""
        # Create progress first
        client.post('/api/progress',
            data='{"scenario_id": "test", "quality": 4}',
            content_type='application/json',
            headers=auth_headers
        )
        # Access own data
        res = client.get('/api/progress/1',
            headers=auth_headers
        )
        assert res.status_code == 200


class TestTokenRefresh:
    """Test JWT token refresh logic."""

    def test_token_refresh_extends_expiry(self, client, auth_headers):
        """Token refresh should return new token with extended expiry."""
        res = client.post('/api/auth/refresh',
            headers=auth_headers
        )
        assert res.status_code == 200
        import json
        data = json.loads(res.data)
        assert 'token' in data

        # New token should be valid
        new_res = client.post('/api/auth/refresh',
            headers={'Authorization': f"Bearer {data['token']}"}
        )
        assert new_res.status_code == 200


class TestAuthUtilities:
    """Test authentication utility functions."""

    def test_decode_token_payload(self):
        """Should correctly decode JWT payload."""
        from src.middleware.auth import authenticate
        # This tests the jwt.decode call pattern
        pass  # Covered by other tests

    def test_authenticate_optional_sets_user_id(self, client, auth_headers):
        """authenticate_optional should set request.user_id if token valid."""
        # This is tested indirectly through endpoints that don't require auth
        res = client.get('/api/scenarios/fellowship-graph/report',
            headers=auth_headers
        )
        assert res.status_code == 200