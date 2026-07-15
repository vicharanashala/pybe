"""
pyBE Rate Limiting Configuration
================================

Provides rate limiting middleware to prevent API abuse.
Configurable limits per endpoint type with in-memory storage.

Rate Limits:
- Auth endpoints: 10 requests/minute per IP
- API read endpoints: 60 requests/minute per user/IP
- API write endpoints: 30 requests/minute per user
- Evaluation endpoints: 10 requests/minute per user
"""

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from functools import wraps
import time


def get_user_identifier():
    """
    Get identifier for rate limiting.
    Uses user_id if authenticated, otherwise falls back to IP.
    """
    from flask import request, has_request_context
    if has_request_context():
        # Check for authenticated user
        if hasattr(request, 'user_id') and request.user_id:
            return f"user_{request.user_id}"
        # Fall back to IP
        return get_remote_address()
    return get_remote_address()


limiter = Limiter(
    key_func=get_user_identifier,
    default_limits=["200 per day", "60 per minute"],
    storage_uri="memory://",
)


class RateLimitTier:
    """Rate limit tier definitions."""

    AUTH = "10 per minute"
    READ = "60 per minute"
    WRITE = "30 per minute"
    EVALUATE = "10 per minute"
    ADMIN = "30 per minute"


def rate_limit(limit_string: str):
    """
    Decorator to apply specific rate limit to an endpoint.

    Usage:
        @rate_limit("30 per minute")
        def my_endpoint():
            ...
    """
    return limiter.limit(limit_string)


def auth_rate_limit(f):
    """Decorator for auth endpoints - stricter limits."""
    @wraps(f)
    @limiter.limit(RateLimitTier.AUTH)
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated


def read_rate_limit(f):
    """Decorator for read endpoints."""
    @wraps(f)
    @limiter.limit(RateLimitTier.READ)
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated


def write_rate_limit(f):
    """Decorator for write endpoints."""
    @wraps(f)
    @limiter.limit(RateLimitTier.WRITE)
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated


def evaluate_rate_limit(f):
    """Decorator for AI evaluation endpoints - strictest limits."""
    @wraps(f)
    @limiter.limit(RateLimitTier.EVALUATE)
    def decorated(*args, **kwargs):
        return f(*args, **kwargs)
    return decorated


def get_rate_limit_status():
    """
    Get current rate limit status for the user.
    Returns dict with remaining requests and reset time.
    """
    identifier = get_user_identifier()
    key = f"limitier_{identifier}"

    # This would need to access limiter's internal state
    # For now, return a basic response
    return {
        "identifier": identifier,
        "limit": "200 per day",
        "message": "Rate limiting is active"
    }


def init_rate_limiting(app):
    """
    Initialize rate limiting with the Flask app.

    Applies default limits and registers error handlers.
    """
    limiter.init_app(app)

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return {
            "error": "Rate limit exceeded",
            "message": str(e.description),
            "retry_after": e.retry_after
        }, 429

    @app.before_request
    def check_rate_limit():
        """Pre-request hook to check and log rate limits."""
        pass  # Limiter handles this automatically

    print("[pyBE] Rate limiting initialized")
    return limiter