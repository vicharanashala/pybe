from flask import Blueprint, request, jsonify, current_app
from src.models import db, User
from src.storage import Storage
import bcrypt
import jwt
from datetime import datetime, timedelta
import os

auth_bp = Blueprint('auth', __name__)
JWT_SECRET = os.environ.get('JWT_SECRET')
if not JWT_SECRET:
    if os.environ.get('FLASK_ENV') == 'production':
        raise ValueError("JWT_SECRET environment variable must be set in production")
    JWT_SECRET = 'super-secret-key-for-dev'


def _is_mongo():
    try:
        from src.database import is_mongodb
        return is_mongodb()
    except Exception:
        return False


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400

    username = data['username']
    email = data.get('email', '')
    password = data['password']

    if _is_mongo():
        existing = Storage.get_user_by_username(username)
        if existing:
            return jsonify({'error': 'User already exists'}), 409
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = Storage.create_user(username=username, email=email, password_hash=hashed)
        user_id = int(str(user["_id"]), 16) if hasattr(user.get("_id"), "__str__") else user.get("id", 0)
        return jsonify({'message': 'User registered successfully', 'id': user_id}), 201

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'User already exists'}), 409

    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(username=username, email=email, password_hash=hashed)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('password'):
        return jsonify({'error': 'Credentials are required'}), 400

    identifier = data.get('email') or data.get('username')
    if not identifier:
        return jsonify({'error': 'Email or username is required'}), 400

    if _is_mongo():
        user = Storage.get_user_by_identifier(identifier)
        if user and bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash'].encode('utf-8')):
            user_id = int(str(user["_id"]), 16) if hasattr(user.get("_id"), "__str__") else user.get("id", 0)
            token = jwt.encode({
                'user_id': user_id,
                'exp': datetime.utcnow() + timedelta(days=7)
            }, JWT_SECRET, algorithm='HS256')
            return jsonify({
                'token': token,
                'user': {
                    'id': user_id,
                    'username': user['username'],
                    'email': user.get('email', ''),
                    'isAdmin': user.get('is_admin', False)
                }
            }), 200
        return jsonify({'error': 'Invalid credentials'}), 401

    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, JWT_SECRET, algorithm='HS256')

        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'isAdmin': user.is_admin
            }
        }), 200

    return jsonify({'error': 'Invalid credentials'}), 401


@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'error': 'Authorization required'}), 401

    try:
        scheme, token = auth_header.split()
        if scheme.lower() != 'bearer':
            return jsonify({'error': 'Invalid authorization scheme'}), 401
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        new_token = jwt.encode({
            'user_id': payload['user_id'],
            'exp': datetime.utcnow() + timedelta(days=7)
        }, JWT_SECRET, algorithm='HS256')
        return jsonify({'token': new_token}), 200
    except (ValueError, jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({'error': 'Invalid token'}), 401


@auth_bp.route('/setup-admin', methods=['POST'])
def setup_admin():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password are required'}), 400

    admin_secret = os.environ.get('ADMIN_SETUP_SECRET', 'pybe-admin-setup-secret')
    provided_secret = data.get('secret', '')
    if provided_secret != admin_secret:
        return jsonify({'error': 'Invalid admin setup secret'}), 403

    username = data['username']
    password = data['password']

    if _is_mongo():
        from src.database import get_collection
        existing_admin = get_collection("users").find_one({"is_admin": True})
        if existing_admin:
            return jsonify({'error': 'An admin already exists. Use the database to modify roles.'}), 409
        user = Storage.get_user_by_username(username)
        if not user:
            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user = Storage.create_user(username=username, email='', password_hash=hashed)
            user_id = int(str(user["_id"]), 16)
        else:
            user_id = int(str(user["_id"]), 16)
        get_collection("users").update_one(
            {"username": username},
            {"$set": {"is_admin": True}}
        )
        return jsonify({'message': f'User {username} is now an admin'}), 201

    existing_admin = User.query.filter_by(is_admin=True).first()
    if existing_admin:
        return jsonify({'error': 'An admin already exists. Use the database to modify roles.'}), 409

    user = User.query.filter_by(username=username).first()
    if not user:
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(username=username, password_hash=hashed, is_admin=True)
        db.session.add(user)
    else:
        user.is_admin = True

    db.session.commit()

    return jsonify({'message': f'User {username} is now an admin'}), 201
