from functools import wraps
import jwt
from flask import request, jsonify, current_app


def authenticate():
    """
    Decorator that validates JWT token and adds user_id to request context.
    Usage: @authenticate
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return jsonify({'error': 'Authorization header required'}), 401
            try:
                scheme, token = auth_header.split()
                if scheme.lower() != 'bearer':
                    return jsonify({'error': 'Invalid authorization scheme'}), 401
            except ValueError:
                return jsonify({'error': 'Invalid authorization header format'}), 401
            try:
                payload = jwt.decode(
                    token,
                    current_app.config['JWT_SECRET'],
                    algorithms=['HS256']
                )
                request.user_id = payload['user_id']
            except jwt.ExpiredSignatureError:
                return jsonify({'error': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'error': 'Invalid token'}), 401
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def admin_required():
    """
    Decorator that validates JWT token and checks if user is an admin.
    Must be used after @authenticate.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            from src.models import User
            user = User.query.get(request.user_id)
            if not user or not user.is_admin:
                return jsonify({'error': 'Admin access required'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def authenticate_optional():
    """
    Decorator that validates JWT token if present, but allows unauthenticated access.
    Sets request.user_id if token is valid, None otherwise.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get('Authorization')
            request.user_id = None
            if auth_header:
                try:
                    scheme, token = auth_header.split()
                    if scheme.lower() == 'bearer':
                        payload = jwt.decode(
                            token,
                            current_app.config['JWT_SECRET'],
                            algorithms=['HS256']
                        )
                        request.user_id = payload['user_id']
                except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError):
                    pass
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def require_userOwnership(param_name='user_id'):
    """
    Decorator factory that ensures the authenticated user owns the resource.
    Must be used after @authenticate.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            resource_user_id = request.view_args.get(param_name) or request.args.get(param_name)
            if resource_user_id and int(resource_user_id) != int(request.user_id):
                return jsonify({'error': 'Access denied. You can only access your own resources.'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator