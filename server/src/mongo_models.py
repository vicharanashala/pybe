"""
MongoDB Document Schemas
=======================

MongoDB document schemas that mirror the SQLAlchemy models.
These define the document structure for MongoDB storage.

Collections:
- users
- progress
- discussion_comments
- discussion_upvotes
- learning_paths
- contributors

B4 Spec: Each document includes:
- createdAt: ISO timestamp
- updatedAt: ISO timestamp (for tracking changes)
"""

from datetime import datetime, timezone
from typing import Optional, List, Dict, Any


def utcnow():
    """Get current UTC time as timezone-aware datetime."""
    return datetime.now(timezone.utc)


class UserDocument:
    """User document schema for MongoDB."""

    COLLECTION = "users"

    INDEXES = [
        {"keys": [("username", 1)], "unique": True},
        {"keys": [("email", 1)], "unique": True, "sparse": True},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "username": "",
            "email": "",
            "password_hash": "",
            "createdAt": utcnow(),
            "updatedAt": utcnow(),
            "level": 1,
            "total_score": 0,
            "domain_preferences": [],
            "contributor_badges": [],
        }

    @staticmethod
    def to_document(user_obj) -> dict:
        """Convert SQLAlchemy User model to MongoDB document."""
        return {
            "username": user_obj.username,
            "email": user_obj.email,
            "password_hash": user_obj.password_hash,
            "createdAt": user_obj.created_at or utcnow(),
            "updatedAt": utcnow(),
        }

    @staticmethod
    def from_document(doc: dict) -> dict:
        """Convert MongoDB document to API response format."""
        if not doc:
            return None
        return {
            "id": str(doc.get("_id", "")),
            "username": doc.get("username", ""),
            "email": doc.get("email", ""),
            "created_at": doc.get("createdAt", "").isoformat() if isinstance(doc.get("createdAt"), datetime) else doc.get("createdAt"),
        }


class ProgressDocument:
    """Progress document schema for MongoDB (SM-2 spaced repetition)."""

    COLLECTION = "progress"

    INDEXES = [
        {"keys": [("user_id", 1)]},
        {"keys": [("scenario_id", 1)]},
        {"keys": [("user_id", 1), ("scenario_id", 1)], "unique": True},
        {"keys": [("next_review_date", 1)]},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "user_id": None,
            "scenario_id": "",
            "status": "started",
            "score": 0.0,
            "repetition": 0,
            "interval": 1,
            "easiness_factor": 2.5,
            "next_review_date": utcnow(),
            "updated_at": utcnow(),
            "created_at": utcnow(),
        }

    @staticmethod
    def to_document(progress_obj) -> dict:
        """Convert SQLAlchemy Progress model to MongoDB document."""
        return {
            "user_id": progress_obj.user_id,
            "scenario_id": progress_obj.scenario_id,
            "status": progress_obj.status or "started",
            "score": progress_obj.score or 0.0,
            "repetition": progress_obj.repetition or 0,
            "interval": progress_obj.interval or 1,
            "easiness_factor": progress_obj.easiness_factor or 2.5,
            "next_review_date": progress_obj.next_review_date or utcnow(),
            "updated_at": utcnow(),
            "created_at": progress_obj.updated_at or utcnow(),
        }

    @staticmethod
    def from_document(doc: dict) -> dict:
        """Convert MongoDB document to API response format."""
        if not doc:
            return None
        return {
            "id": str(doc.get("_id", "")),
            "user_id": doc.get("user_id"),
            "scenario_id": doc.get("scenario_id", ""),
            "status": doc.get("status", "started"),
            "score": doc.get("score", 0.0),
            "repetition": doc.get("repetition", 0),
            "interval": doc.get("interval", 1),
            "easiness_factor": doc.get("easiness_factor", 2.5),
            "next_review_date": doc.get("next_review_date"),
            "updated_at": doc.get("updated_at"),
            "created_at": doc.get("created_at"),
        }


class DiscussionCommentDocument:
    """Discussion comment document schema for MongoDB."""

    COLLECTION = "discussion_comments"

    INDEXES = [
        {"keys": [("scenario_id", 1)]},
        {"keys": [("author_id", 1)]},
        {"keys": [("parent_id", 1)]},
        {"keys": [("scenario_id", 1), ("created_at", -1)]},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "scenario_id": "",
            "author_id": None,
            "author_name": "",
            "content": "",
            "python_construct": "",
            "domain_connection": "",
            "upvotes": 0,
            "is_accepted": False,
            "parent_id": None,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }

    @staticmethod
    def to_document(comment_obj) -> dict:
        """Convert SQLAlchemy DiscussionComment model to MongoDB document."""
        return {
            "scenario_id": comment_obj.scenario_id,
            "author_id": comment_obj.author_id,
            "author_name": comment_obj.author_name,
            "content": comment_obj.content,
            "python_construct": comment_obj.python_construct or "",
            "domain_connection": comment_obj.domain_connection or "",
            "upvotes": comment_obj.upvotes or 0,
            "is_accepted": comment_obj.is_accepted or False,
            "parent_id": comment_obj.parent_id,
            "created_at": comment_obj.created_at or utcnow(),
            "updated_at": utcnow(),
        }

    @staticmethod
    def from_document(doc: dict) -> dict:
        """Convert MongoDB document to API response format."""
        if not doc:
            return None
        return {
            "id": str(doc.get("_id", "")),
            "scenario_id": doc.get("scenario_id", ""),
            "author_id": doc.get("author_id"),
            "author_name": doc.get("author_name", ""),
            "content": doc.get("content", ""),
            "python_construct": doc.get("python_construct", ""),
            "domain_connection": doc.get("domain_connection", ""),
            "upvotes": doc.get("upvotes", 0),
            "is_accepted": doc.get("is_accepted", False),
            "parent_id": doc.get("parent_id"),
            "created_at": doc.get("created_at"),
        }


class DiscussionUpvoteDocument:
    """Discussion upvote document schema for MongoDB."""

    COLLECTION = "discussion_upvotes"

    INDEXES = [
        {"keys": [("comment_id", 1), ("user_id", 1)], "unique": True},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "comment_id": None,
            "user_id": None,
            "created_at": utcnow(),
        }

    @staticmethod
    def to_document(upvote_obj) -> dict:
        """Convert SQLAlchemy DiscussionUpvote model to MongoDB document."""
        return {
            "comment_id": upvote_obj.comment_id,
            "user_id": upvote_obj.user_id,
            "created_at": upvote_obj.created_at or utcnow(),
        }


class LearningPathDocument:
    """Learning path document schema for MongoDB."""

    COLLECTION = "learning_paths"

    INDEXES = [
        {"keys": [("user_id", 1)]},
        {"keys": [("scenario_id", 1)]},
        {"keys": [("domain", 1)]},
        {"keys": [("python_concept", 1)]},
        {"keys": [("user_id", 1), ("domain", 1)]},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "user_id": None,
            "scenario_id": "",
            "domain": "",
            "python_concept": "",
            "score": 0.0,
            "completed_at": utcnow(),
            "created_at": utcnow(),
        }

    @staticmethod
    def to_document(lp_obj) -> dict:
        """Convert SQLAlchemy LearningPath model to MongoDB document."""
        return {
            "user_id": lp_obj.user_id,
            "scenario_id": lp_obj.scenario_id,
            "domain": lp_obj.domain,
            "python_concept": lp_obj.python_concept,
            "score": lp_obj.score or 0.0,
            "completed_at": lp_obj.completed_at or utcnow(),
            "created_at": utcnow(),
        }

    @staticmethod
    def from_document(doc: dict) -> dict:
        """Convert MongoDB document to API response format."""
        if not doc:
            return None
        return {
            "id": str(doc.get("_id", "")),
            "user_id": doc.get("user_id"),
            "scenario_id": doc.get("scenario_id", ""),
            "domain": doc.get("domain", ""),
            "python_concept": doc.get("python_concept", ""),
            "score": doc.get("score", 0.0),
            "completed_at": doc.get("completed_at"),
            "created_at": doc.get("created_at"),
        }


class ContributorDocument:
    """Contributor document schema for MongoDB."""

    COLLECTION = "contributors"

    INDEXES = [
        {"keys": [("username", 1)], "unique": True},
        {"keys": [("total_impact", -1)]},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "username": "",
            "github": "",
            "avatar_url": "",
            "bio": "",
            "total_impact": 0,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }

    @staticmethod
    def to_document(contrib_obj) -> dict:
        """Convert SQLAlchemy Contributor model to MongoDB document."""
        return {
            "username": contrib_obj.username,
            "github": contrib_obj.github or "",
            "avatar_url": contrib_obj.avatar_url or "",
            "bio": contrib_obj.bio or "",
            "total_impact": contrib_obj.total_impact or 0,
            "created_at": contrib_obj.created_at or utcnow(),
            "updated_at": utcnow(),
        }

    @staticmethod
    def from_document(doc: dict) -> dict:
        """Convert MongoDB document to API response format."""
        if not doc:
            return None
        return {
            "id": str(doc.get("_id", "")),
            "username": doc.get("username", ""),
            "github": doc.get("github", ""),
            "avatar_url": doc.get("avatar_url", ""),
            "bio": doc.get("bio", ""),
            "total_impact": doc.get("total_impact", 0),
            "created_at": doc.get("created_at"),
        }


class ReviewRequestDocument:
    """Review request document schema for MongoDB."""

    COLLECTION = "review_requests"

    INDEXES = [
        {"keys": [("submitter_id", 1)]},
        {"keys": [("status", 1)]},
        {"keys": [("created_at", -1)]},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "scenario_id": "",
            "submitter_id": None,
            "submitter_name": "",
            "status": "pending",
            "reviewer_id": None,
            "reviewer_name": "",
            "anti_superficiality_score": None,
            "mentor_comments": "",
            "change_requests": "",
            "created_at": utcnow(),
            "reviewed_at": None,
            "scenario_data": "",
        }

    @staticmethod
    def to_document(review_obj) -> dict:
        """Convert SQLAlchemy ReviewRequest model to MongoDB document."""
        return {
            "scenario_id": review_obj.scenario_id,
            "submitter_id": review_obj.submitter_id,
            "submitter_name": review_obj.submitter_name,
            "status": review_obj.status or "pending",
            "reviewer_id": review_obj.reviewer_id,
            "reviewer_name": review_obj.reviewer_name or "",
            "anti_superficiality_score": review_obj.anti_superficiality_score,
            "mentor_comments": review_obj.mentor_comments or "",
            "change_requests": review_obj.change_requests or "",
            "created_at": review_obj.created_at or utcnow(),
            "reviewed_at": review_obj.reviewed_at,
            "scenario_data": review_obj.scenario_data or "",
        }

    @staticmethod
    def from_document(doc: dict) -> dict:
        """Convert MongoDB document to API response format."""
        if not doc:
            return None
        return {
            "id": str(doc.get("_id", "")),
            "scenario_id": doc.get("scenario_id", ""),
            "submitter_id": doc.get("submitter_id"),
            "submitter_name": doc.get("submitter_name", ""),
            "status": doc.get("status", "pending"),
            "reviewer_id": doc.get("reviewer_id"),
            "reviewer_name": doc.get("reviewer_name", ""),
            "anti_superficiality_score": doc.get("anti_superficiality_score"),
            "mentor_comments": doc.get("mentor_comments", ""),
            "change_requests": doc.get("change_requests", ""),
            "created_at": doc.get("created_at"),
            "reviewed_at": doc.get("reviewed_at"),
        }


class NotificationDocument:
    """Notification document schema for MongoDB."""

    COLLECTION = "notifications"

    INDEXES = [
        {"keys": [("user_id", 1)]},
        {"keys": [("user_id", 1), ("is_read", 1)]},
        {"keys": [("created_at", -1)]},
    ]

    @staticmethod
    def schema() -> dict:
        return {
            "_id": None,
            "user_id": None,
            "notification_type": "",
            "title": "",
            "message": "",
            "link": "",
            "is_read": False,
            "created_at": utcnow(),
        }

    @staticmethod
    def to_document(notification_obj) -> dict:
        """Convert SQLAlchemy Notification model to MongoDB document."""
        return {
            "user_id": notification_obj.user_id,
            "notification_type": notification_obj.notification_type,
            "title": notification_obj.title,
            "message": notification_obj.message,
            "link": notification_obj.link or "",
            "is_read": notification_obj.is_read or False,
            "created_at": notification_obj.created_at or utcnow(),
        }

    @staticmethod
    def from_document(doc: dict) -> dict:
        """Convert MongoDB document to API response format."""
        if not doc:
            return None
        return {
            "id": str(doc.get("_id", "")),
            "type": doc.get("notification_type", ""),
            "title": doc.get("title", ""),
            "message": doc.get("message", ""),
            "link": doc.get("link", ""),
            "isRead": doc.get("is_read", False),
            "createdAt": doc.get("created_at"),
        }


def create_indexes():
    """
    Create MongoDB indexes for all collections.

    Call this after data migration to ensure proper indexing.
    """
    from src.database import get_collection

    index_map = [
        (UserDocument.COLLECTION, UserDocument.INDEXES),
        (ProgressDocument.COLLECTION, ProgressDocument.INDEXES),
        (DiscussionCommentDocument.COLLECTION, DiscussionCommentDocument.INDEXES),
        (DiscussionUpvoteDocument.COLLECTION, DiscussionUpvoteDocument.INDEXES),
        (LearningPathDocument.COLLECTION, LearningPathDocument.INDEXES),
        (ContributorDocument.COLLECTION, ContributorDocument.INDEXES),
        (ReviewRequestDocument.COLLECTION, ReviewRequestDocument.INDEXES),
        (NotificationDocument.COLLECTION, NotificationDocument.INDEXES),
    ]

    for collection_name, indexes in index_map:
        try:
            collection = get_collection(collection_name)
            for index_spec in indexes:
                keys = [(k, v) if isinstance(v, int) else k for k, v in index_spec["keys"]]
                result = collection.create_index(keys, unique=index_spec.get("unique", False), sparse=index_spec.get("sparse", False))
                if result is not None:
                    print(f"[pyBE] Created index for {collection_name}: {result}")
            print(f"[pyBE] Indexed {collection_name}")
        except Exception as e:
            print(f"[pyBE] Failed to create indexes for {collection_name}: {e}")