"""
pyBE i18n Support
=================

Internationalization framework for multi-language support.
"""

import json
from pathlib import Path
from functools import wraps
from flask import request, jsonify, current_app


TRANSLATIONS_DIR = Path(__file__).parent.parent / "translations"

SUPPORTED_LOCALES = ["en", "es", "hi", "fr", "de"]
DEFAULT_LOCALE = "en"

_translations_cache = {}


def load_translations(locale: str) -> dict:
    """Load translations for a locale."""
    if locale in _translations_cache:
        return _translations_cache[locale]

    if locale == "en":
        _translations_cache[locale] = {}
        return {}

    trans_file = TRANSLATIONS_DIR / f"{locale}.json"
    if trans_file.exists():
        with open(trans_file, encoding="utf-8") as f:
            _translations_cache[locale] = json.load(f)
    else:
        _translations_cache[locale] = {}

    return _translations_cache[locale]


def get_translation(key: str, locale: str = None, **kwargs) -> str:
    """
    Get translation for a key.

    Args:
        key: Translation key (e.g., 'scenario.difficulty.level_1')
        locale: Locale code (default: auto-detect from request)
        **kwargs: Format arguments

    Returns:
        Translated string or key if not found
    """
    if locale is None:
        locale = get_current_locale()

    translations = load_translations(locale)
    keys = key.split(".")

    value = translations
    for k in keys:
        if isinstance(value, dict):
            value = value.get(k)
        else:
            break

    if value is None:
        return key

    if kwargs:
        try:
            return value.format(**kwargs)
        except (KeyError, IndexError):
            return value

    return value


def get_current_locale() -> str:
    """Detect current locale from request."""
    # Check URL parameter
    locale = request.args.get("lang") or request.args.get("locale")
    if locale and locale in SUPPORTED_LOCALES:
        return locale

    # Check header
    accept_language = request.headers.get("Accept-Language", "")
    if accept_language:
        for lang in accept_language.split(","):
            code = lang.split(";")[0].strip()[:2].lower()
            if code in SUPPORTED_LOCALES:
                return code

    # Check user preference (if authenticated)
    if hasattr(request, "user_id"):
        # Could load from user profile
        pass

    return DEFAULT_LOCALE


def i18n_route(f):
    """Decorator to add locale info to response headers."""
    @wraps(f)
    def decorated(*args, **kwargs):
        locale = get_current_locale()
        response = f(*args, **kwargs)

        if isinstance(response, tuple):
            data, status = response[0], response[1] if len(response) > 1 else 200
        else:
            data, status = response, 200

        if hasattr(response, "headers"):
            response.headers["X-Locale"] = locale
            return response

        return jsonify(data), status

    return decorated


def init_i18n(app):
    """Initialize i18n with Flask app."""

    @app.route("/api/i18n/locales")
    def get_locales():
        """Return list of supported locales."""
        return jsonify({
            "locales": SUPPORTED_LOCALES,
            "default": DEFAULT_LOCALE
        })

    @app.route("/api/i18n/translations/<locale>")
    def get_locale_translations(locale):
        """Get translations for a specific locale."""
        if locale not in SUPPORTED_LOCALES:
            return jsonify({"error": "Unsupported locale"}), 400

        return jsonify({
            "locale": locale,
            "translations": load_translations(locale)
        })

    @app.route("/api/i18n/translations")
    def get_all_translations():
        """Get all translations."""
        result = {}
        for locale in SUPPORTED_LOCALES:
            result[locale] = load_translations(locale)
        return jsonify(result)

    print("[pyBE] i18n framework initialized")
    return SUPPORTED_LOCALES