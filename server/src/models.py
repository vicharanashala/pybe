from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    sessions = db.relationship('Progress', backref='user', lazy=True)
    comments = db.relationship('DiscussionComment', backref='author', lazy=True)

class Progress(db.Model):
    __tablename__ = 'progress'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    scenario_id = db.Column(db.String(128), nullable=False)
    status = db.Column(db.String(50), default='started')
    score = db.Column(db.Float, nullable=True)

    # SM-2 Spaced Repetition fields
    repetition = db.Column(db.Integer, default=0)
    interval = db.Column(db.Integer, default=1)
    easiness_factor = db.Column(db.Float, default=2.5)
    next_review_date = db.Column(db.DateTime, default=datetime.utcnow)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DiscussionComment(db.Model):
    __tablename__ = 'discussion_comments'
    id = db.Column(db.Integer, primary_key=True)
    scenario_id = db.Column(db.String(128), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    author_name = db.Column(db.String(80), nullable=False)
    content = db.Column(db.Text, nullable=False)
    python_construct = db.Column(db.String(80), nullable=True)
    domain_connection = db.Column(db.String(120), nullable=True)
    upvotes = db.Column(db.Integer, default=0)
    is_accepted = db.Column(db.Boolean, default=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('discussion_comments.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    replies = db.relationship('DiscussionComment', backref='parent', remote_side=[id])


class DiscussionUpvote(db.Model):
    __tablename__ = 'discussion_upvotes'
    id = db.Column(db.Integer, primary_key=True)
    comment_id = db.Column(db.Integer, db.ForeignKey('discussion_comments.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class LearningPath(db.Model):
    __tablename__ = 'learning_paths'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    scenario_id = db.Column(db.String(128), nullable=False)
    domain = db.Column(db.String(80), nullable=False)
    python_concept = db.Column(db.String(120), nullable=False)
    score = db.Column(db.Float, nullable=True)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='learning_paths')


class Contributor(db.Model):
    __tablename__ = 'contributors'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    github = db.Column(db.String(120), nullable=True)
    avatar_url = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    total_impact = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class ReviewRequest(db.Model):
    __tablename__ = 'review_requests'
    id = db.Column(db.Integer, primary_key=True)
    scenario_id = db.Column(db.String(128), nullable=False)
    submitter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    submitter_name = db.Column(db.String(80), nullable=False)
    status = db.Column(db.String(20), default='pending')
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    reviewer_name = db.Column(db.String(80), nullable=True)
    anti_superficiality_score = db.Column(db.Float, nullable=True)
    mentor_comments = db.Column(db.Text, nullable=True)
    change_requests = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    reviewed_at = db.Column(db.DateTime, nullable=True)
    scenario_data = db.Column(db.Text, nullable=True)

    submitter = db.relationship('User', foreign_keys=[submitter_id], backref='submitted_reviews')
    reviewer = db.relationship('User', foreign_keys=[reviewer_id], backref='reviewed_reviews')


class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notification_type = db.Column(db.String(50), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(255), nullable=True)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='notifications')
