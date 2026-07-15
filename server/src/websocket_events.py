"""
pyBE WebSocket Events
=====================

Real-time event handlers and presence tracking for WebSocket connections.
Handles presence, live updates, and real-time notifications.

Events:
- presence_update: User presence changes
- discussion_new: New discussion comment posted
- discussion_reply: Reply to a discussion
- notification: Real-time notification
- scenario_progress: User progress updates
"""

from flask_socketio import emit, join_room, leave_room
from datetime import datetime
import json


connected_users = {}


def init_websocket_events(socketio):
    """
    Initialize all WebSocket event handlers.

    Sets up presence tracking, real-time updates, and notification delivery.
    """

    @socketio.on('connect')
    def handle_connect():
        """Handle new WebSocket connection."""
        emit('connected', {
            'status': 'connected',
            'timestamp': datetime.utcnow().isoformat()
        })
        print(f"[WebSocket] Client connected: {request.sid}")

    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle WebSocket disconnection."""
        # Remove from presence tracking
        for user_id, data in list(connected_users.items()):
            if data.get('sid') == request.sid:
                del connected_users[user_id]
                # Broadcast presence update
                emit_presence_update(user_id, 'offline')
                break
        print(f"[WebSocket] Client disconnected: {request.sid}")

    @socketio.on('authenticate')
    def handle_authenticate(data):
        """
        Authenticate WebSocket connection with JWT token.

        Stores user presence and enables personalized events.
        """
        from flask import request, current_app
        import jwt

        token = data.get('token')
        if not token:
            emit('auth_error', {'error': 'Token required'})
            return

        try:
            secret = current_app.config.get('JWT_SECRET', 'super-secret-key-for-dev')
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            user_id = payload.get('user_id')

            connected_users[user_id] = {
                'sid': request.sid,
                'authenticated_at': datetime.utcnow().isoformat()
            }

            # Join user-specific room for notifications
            join_room(f"user_{user_id}")

            emit('authenticated', {
                'user_id': user_id,
                'status': 'authenticated'
            })

            # Broadcast presence update
            emit_presence_update(user_id, 'online')

        except jwt.ExpiredSignatureError:
            emit('auth_error', {'error': 'Token expired'})
        except jwt.InvalidTokenError:
            emit('auth_error', {'error': 'Invalid token'})

    @socketio.on('join_scenario')
    def handle_join_scenario(data):
        """
        Join a scenario's room for real-time updates.

        Allows receiving updates when others interact with the scenario.
        """
        scenario_id = data.get('scenario_id')
        if scenario_id:
            room = f"scenario_{scenario_id}"
            join_room(room)
            emit('joined_scenario', {
                'scenario_id': scenario_id,
                'room': room
            })

    @socketio.on('leave_scenario')
    def handle_leave_scenario(data):
        """Leave a scenario's room."""
        scenario_id = data.get('scenario_id')
        if scenario_id:
            room = f"scenario_{scenario_id}"
            leave_room(room)
            emit('left_scenario', {'scenario_id': scenario_id})

    @socketio.on('typing')
    def handle_typing(data):
        """
        Broadcast typing indicator for discussions.

        Shows when a user is typing a comment/reply.
        """
        scenario_id = data.get('scenario_id')
        user_name = data.get('user_name', 'Anonymous')
        is_reply = data.get('is_reply', False)

        room = f"scenario_{scenario_id}" if scenario_id else None
        emit('user_typing', {
            'user_name': user_name,
            'is_reply': is_reply,
            'timestamp': datetime.utcnow().isoformat()
        }, room=room, include_self=False)

    @socketio.on('request_presence')
    def handle_request_presence(data):
        """Request list of users currently viewing a scenario."""
        scenario_id = data.get('scenario_id')
        room = f"scenario_{scenario_id}" if scenario_id else None

        # Get users in the room
        users_in_room = []
        for user_id, info in connected_users.items():
            users_in_room.append({
                'user_id': user_id,
                'connected_at': info.get('authenticated_at')
            })

        emit('presence_list', {
            'scenario_id': scenario_id,
            'users': users_in_room,
            'count': len(users_in_room)
        })

    @socketio.on('subscribe_notifications')
    def handle_subscribe_notifications():
        """Subscribe to personal notification stream."""
        from flask import request
        # This is handled by joining user-specific room in authenticate

    print("[WebSocket] Events initialized")
    return socketio


def emit_presence_update(user_id: int, status: str):
    """
    Broadcast user presence status change.

    Args:
        user_id: User ID
        status: 'online' or 'offline'
    """
    from flask_socketio import emit
    emit('presence_update', {
        'user_id': user_id,
        'status': status,
        'timestamp': datetime.utcnow().isoformat()
    }, broadcast=True)


def emit_discussion_update(scenario_id: str, comment_data: dict, event_type: str = 'new'):
    """
    Broadcast discussion update to all users viewing the scenario.

    Args:
        scenario_id: Scenario ID
        comment_data: Comment data dict
        event_type: 'new', 'reply', 'upvote', or 'accept'
    """
    from flask_socketio import emit
    room = f"scenario_{scenario_id}"
    emit(f'discussion_{event_type}', {
        'scenario_id': scenario_id,
        'comment': comment_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=room)


def emit_notification(user_id: int, notification: dict):
    """
    Send real-time notification to a specific user.

    Args:
        user_id: Target user ID
        notification: Notification dict with type, title, message
    """
    from flask_socketio import emit
    room = f"user_{user_id}"
    emit('notification', {
        'notification': notification,
        'timestamp': datetime.utcnow().isoformat()
    }, room=room)


def emit_scenario_progress(scenario_id: str, progress_data: dict):
    """
    Broadcast scenario progress update to all users.

    Args:
        scenario_id: Scenario ID
        progress_data: Progress data dict
    """
    from flask_socketio import emit
    room = f"scenario_{scenario_id}"
    emit('scenario_progress', {
        'scenario_id': scenario_id,
        'progress': progress_data,
        'timestamp': datetime.utcnow().isoformat()
    }, room=room)


def get_connected_users():
    """Get dict of currently connected users."""
    return connected_users


def get_scenario_viewers(scenario_id: str) -> list:
    """
    Get list of users currently viewing a scenario.

    Note: This is approximate as SocketIO rooms don't expose member lists directly.
    """
    # This would require custom tracking or Redis for accurate results
    return []