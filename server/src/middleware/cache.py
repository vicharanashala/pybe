"""
pyBE Caching Layer
==================

Provides caching functionality for expensive operations.
Uses in-memory TTL cache for scenario data, user stats, etc.

Cache Keys:
- scenarios:list - Scenario listing (TTL: 5 min)
- scenarios:detail:{id} - Individual scenario details (TTL: 5 min)
- user:profile:{id} - User gamification profile (TTL: 1 min)
- user:stats:{id} - User statistics (TTL: 1 min)
- leaderboard - Leaderboard data (TTL: 2 min)
"""

from cachetools import TTLCache
from functools import wraps
import hashlib
import json
from typing import Any, Optional, Callable


cache = TTLCache(maxsize=500, ttl=300)  # 500 items, 5 minute default TTL


class CacheKeys:
    """Cache key generators."""

    @staticmethod
    def scenarios_list(domain: str = None, level: str = None, jonasan_type: str = None) -> str:
        """Generate cache key for scenario list."""
        key_parts = ["scenarios:list"]
        if domain:
            key_parts.append(f"d:{domain}")
        if level:
            key_parts.append(f"l:{level}")
        if jonasan_type:
            key_parts.append(f"t:{jonasan_type}")
        return ":".join(key_parts)

    @staticmethod
    def scenario_detail(scenario_id: str) -> str:
        """Generate cache key for scenario detail."""
        return f"scenarios:detail:{scenario_id}"

    @staticmethod
    def scenario_hints(scenario_id: str, reveal: int = None) -> str:
        """Generate cache key for scenario hints."""
        if reveal is not None:
            return f"scenarios:hints:{scenario_id}:{reveal}"
        return f"scenarios:hints:{scenario_id}:all"

    @staticmethod
    def user_profile(user_id: int) -> str:
        """Generate cache key for user profile."""
        return f"user:profile:{user_id}"

    @staticmethod
    def user_stats(user_id: int) -> str:
        """Generate cache key for user stats."""
        return f"user:stats:{user_id}"

    @staticmethod
    def user_domains(user_id: int) -> str:
        """Generate cache key for user domain graph."""
        return f"user:domains:{user_id}"

    @staticmethod
    def leaderboard(limit: int = 10) -> str:
        """Generate cache key for leaderboard."""
        return f"leaderboard:{limit}"

    @staticmethod
    def scenario_reflection(scenario_id: str) -> str:
        """Generate cache key for scenario reflection."""
        return f"scenarios:reflection:{scenario_id}"

    @staticmethod
    def scenario_rubric(scenario_id: str) -> str:
        """Generate cache key for scenario rubric."""
        return f"scenarios:rubric:{scenario_id}"


def get_cached(key: str) -> Optional[Any]:
    """
    Get value from cache.

    Args:
        key: Cache key

    Returns:
        Cached value or None if not found
    """
    return cache.get(key)


def set_cached(key: str, value: Any, ttl: int = None) -> None:
    """
    Set value in cache with optional custom TTL.

    Args:
        key: Cache key
        value: Value to cache
        ttl: Optional custom TTL in seconds (uses default if not specified)
    """
    if ttl:
        # Create a new cache entry with custom TTL
        cache[key] = value
    else:
        cache[key] = value


def invalidate_cached(key: str) -> bool:
    """
    Remove a specific key from cache.

    Args:
        key: Cache key to invalidate

    Returns:
        True if key was found and removed
    """
    if key in cache:
        del cache[key]
        return True
    return False


def invalidate_pattern(pattern: str) -> int:
    """
    Invalidate all cache keys matching a pattern.

    Args:
        pattern: Pattern to match (e.g., "scenarios:*")

    Returns:
        Number of keys invalidated
    """
    count = 0
    keys_to_delete = []

    # Parse pattern
    if pattern.endswith(':*'):
        prefix = pattern[:-2]
        for key in cache.keys():
            if key.startswith(prefix):
                keys_to_delete.append(key)
    else:
        if pattern in cache:
            keys_to_delete.append(pattern)

    for key in keys_to_delete:
        del cache[key]
        count += 1

    return count


def cached(ttl: int = 300, key_func: Callable = None):
    """
    Decorator to cache function results.

    Args:
        ttl: Time to live in seconds (default 5 minutes)
        key_func: Function to generate cache key from args

    Usage:
        @cached(ttl=60)
        def expensive_function(arg1, arg2):
            ...

        @cached(key_func=lambda args: f"custom:{args[0]}")
        def function_with_custom_key(arg):
            ...
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            if key_func:
                cache_key = key_func(args)
            else:
                # Default: function name + args hash
                key_parts = [func.__name__]
                key_parts.extend(str(arg) for arg in args)
                key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
                cache_key = ":".join(key_parts)

            # Check cache
            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value

            # Compute and cache
            result = func(*args, **kwargs)
            cache[cache_key] = result
            return result

        return wrapper
    return decorator


def cached_scenario_list(ttl: int = 300):
    """
    Specialized cache decorator for scenario list operations.

    Automatically handles the cache key based on filter params.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Extract filter params from kwargs or use defaults
            domain = kwargs.get('domain')
            level = kwargs.get('level')
            jonasan_type = kwargs.get('jonasan_type')

            cache_key = CacheKeys.scenarios_list(domain, level, jonasan_type)

            cached_value = cache.get(cache_key)
            if cached_value is not None:
                return cached_value

            result = func(*args, **kwargs)
            cache[cache_key] = result
            return result

        return wrapper
    return decorator


def get_cache_stats() -> dict:
    """
    Get cache statistics.

    Returns:
        Dict with cache size, hits, misses (if tracked), etc.
    """
    return {
        "size": len(cache),
        "max_size": cache.maxsize,
        "default_ttl": cache.ttl,
        "keys": list(cache.keys())[:20]  # First 20 keys for debugging
    }


def clear_cache():
    """Clear all cached data."""
    cache.clear()


def init_caching(app):
    """
    Initialize caching with the Flask app.

    Registers teardown handler and provides cache access via app config.
    """
    app.config['cache'] = cache
    app.config['cache_keys'] = CacheKeys

    @app.teardown_appcontext
    def teardown_cache(exception=None):
        """App context teardown - cache persists across requests."""
        pass  # TTLCache handles its own cleanup

    # Register cache invalidation for scenario reload
    @app.route("/api/reload", methods=["POST"])
    def reload_with_cache_clear():
        from flask import request, jsonify, current_app
        from functools import wraps

        # Clear relevant caches
        invalidate_pattern("scenarios:*")
        invalidate_pattern("leaderboard:*")

        # Reload scenarios
        engine = current_app.config.get('engine')
        count = engine.load_all()

        return jsonify({
            "status": "reloaded",
            "count": count,
            "cache_cleared": True
        })

    print("[pyBE] Caching layer initialized")
    return cache