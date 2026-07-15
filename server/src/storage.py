"""
Storage Layer Unified Data Access
====================================

Provides a storage-agnostic interface for all database operations.
Works with either SQLite (via SQLAlchemy) or MongoDB (via MongoCollection).

Usage:
    from src.storage import Storage

    # Auto-detects storage mode from current app config
    Storage.get_user_by_id(123)
    Storage.create_user("alice", "alice@example.com", "hash")
    Storage.save_progress(...)
"""

from datetime import datetime, timezone
from typing import Any, Optional

from flask import current_app

from src.database import get_collection, is_mongodb


def utcnow():
    return datetime.now(timezone.utc)


def _is_mongo() -> bool:
    try:
        return is_mongodb()
    except RuntimeError:
        return False


def _get_storage_mode() -> str:
    try:
        return current_app.config.get('STORAGE_MODE', 'sqlite')
    except RuntimeError:
        return 'sqlite'


def _mongo_id_to_int(doc: Any) -> Any:
    """Convert MongoDB _id (ObjectId) to int for compatibility with SQLAlchemy IDs."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [_mongo_id_to_int(d) for d in doc]
    if isinstance(doc, dict):
        if "_id" in doc and not isinstance(doc["_id"], int):
            doc["id"] = int(str(doc["_id"]), 16) if hasattr(doc["_id"], "__str__") else doc["_id"]
        return doc
    return doc


class Storage:

    # ========================================================================
    # User operations
    # ========================================================================

    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Any]:
        if _is_mongo():
            doc = get_collection("users").find_one({"_id": user_id})
            return doc
        from src.models import User
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_username(username: str) -> Optional[Any]:
        if _is_mongo():
            return get_collection("users").find_one({"username": username})
        from src.models import User
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_user_by_identifier(identifier: str) -> Optional[Any]:
        if _is_mongo():
            return get_collection("users").find_one({
                "$or": [{"username": identifier}, {"email": identifier}]
            })
        from src.models import User
        return User.query.filter(
            (User.username == identifier) | (User.email == identifier)
        ).first()

    @staticmethod
    def create_user(username: str, email: str, password_hash: str) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "username": username,
                "email": email,
                "password_hash": password_hash,
                "is_admin": False,
                "createdAt": now,
                "updatedAt": now,
            }
            result = get_collection("users").insert_one(doc)
            doc["_id"] = result.get("_id")
            return doc
        from src.models import db, User
        user = User(username=username, email=email, password_hash=password_hash)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_all_users() -> list:
        if _is_mongo():
            return get_collection("users").find()
        from src.models import User
        return User.query.all()

    # ========================================================================
    # Progress operations
    # ========================================================================

    @staticmethod
    def get_progress(user_id: int, scenario_id: str) -> Optional[Any]:
        if _is_mongo():
            return get_collection("progress").find_one({
                "user_id": user_id,
                "scenario_id": scenario_id
            })
        from src.models import Progress
        return Progress.query.filter_by(
            user_id=user_id,
            scenario_id=scenario_id
        ).first()

    @staticmethod
    def get_all_progress_for_user(user_id: int) -> list:
        if _is_mongo():
            return get_collection("progress").find({"user_id": user_id})
        from src.models import Progress
        return Progress.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_progress_for_scenario(scenario_id: str) -> list:
        if _is_mongo():
            return get_collection("progress").find({"scenario_id": scenario_id})
        from src.models import Progress
        return Progress.query.filter_by(scenario_id=scenario_id).all()

    @staticmethod
    def get_due_progress(user_id: int, before_date: datetime) -> list:
        if _is_mongo():
            return get_collection("progress").find({
                "user_id": user_id,
                "next_review_date": {"$lte": before_date},
                "status": "completed"
            })
        from src.models import Progress
        return Progress.query.filter(
            Progress.user_id == user_id,
            Progress.next_review_date <= before_date,
            Progress.status == "completed"
        ).all()

    @staticmethod
    def save_progress(
        user_id: int,
        scenario_id: str,
        repetition: int,
        interval: int,
        easiness_factor: float,
        next_review_date: datetime,
        status: str,
        score: float,
        updated_at: datetime
    ) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "user_id": user_id,
                "scenario_id": scenario_id,
                "repetition": repetition,
                "interval": interval,
                "easiness_factor": easiness_factor,
                "next_review_date": next_review_date,
                "status": status,
                "score": score,
                "updated_at": updated_at,
                "created_at": now,
            }
            existing = get_collection("progress").find_one({
                "user_id": user_id,
                "scenario_id": scenario_id
            })
            if existing:
                get_collection("progress").update_one(
                    {"user_id": user_id, "scenario_id": scenario_id},
                    {"$set": doc}
                )
                return doc
            else:
                result = get_collection("progress").insert_one(doc)
                doc["_id"] = result.get("_id")
                return doc
        from src.models import db, Progress
        progress = Progress.query.filter_by(
            user_id=user_id,
            scenario_id=scenario_id
        ).first()
        if not progress:
            progress = Progress(user_id=user_id, scenario_id=scenario_id)
            db.session.add(progress)
        progress.repetition = repetition
        progress.interval = interval
        progress.easiness_factor = easiness_factor
        progress.next_review_date = next_review_date
        progress.status = status
        progress.score = score
        progress.updated_at = updated_at
        db.session.commit()
        return progress

    # ========================================================================
    # LearningPath operations
    # ========================================================================

    @staticmethod
    def create_learning_path(
        user_id: int,
        scenario_id: str,
        domain: str,
        python_concept: str,
        score: float
    ) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "user_id": user_id,
                "scenario_id": scenario_id,
                "domain": domain,
                "python_concept": python_concept,
                "score": score,
                "completed_at": now,
                "created_at": now,
            }
            result = get_collection("learning_paths").insert_one(doc)
            doc["_id"] = result.get("_id")
            return doc
        from src.models import db, LearningPath
        lp = LearningPath(
            user_id=user_id,
            scenario_id=scenario_id,
            domain=domain,
            python_concept=python_concept,
            score=score
        )
        db.session.add(lp)
        db.session.commit()
        return lp

    @staticmethod
    def get_learning_paths_for_user(user_id: int) -> list:
        if _is_mongo():
            return get_collection("learning_paths").find({"user_id": user_id})
        from src.models import LearningPath
        return LearningPath.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_learning_paths_by_domain(user_id: int, domain: str) -> list:
        if _is_mongo():
            return get_collection("learning_paths").find({
                "user_id": user_id,
                "domain": domain
            })
        from src.models import LearningPath
        return LearningPath.query.filter_by(user_id=user_id, domain=domain).all()

    # ========================================================================
    # DiscussionComment operations
    # ========================================================================

    @staticmethod
    def get_discussion_comments(scenario_id: str, parent_id=None) -> list:
        if _is_mongo():
            query = {"scenario_id": scenario_id}
            if parent_id is None:
                query["parent_id"] = None
            else:
                query["parent_id"] = parent_id
            return get_collection("discussion_comments").find(
                query,
                sort=[("upvotes", -1), ("created_at", -1)]
            )
        from src.models import DiscussionComment
        query = DiscussionComment.query.filter_by(
            scenario_id=scenario_id,
            parent_id=parent_id
        )
        if parent_id is None:
            query = query.filter(DiscussionComment.parent_id == None)
        return query.order_by(
            DiscussionComment.upvotes.desc(),
            DiscussionComment.created_at.desc()
        ).all()

    @staticmethod
    def get_comment_by_id(comment_id: int) -> Optional[Any]:
        if _is_mongo():
            from bson import ObjectId
            return get_collection("discussion_comments").find_one({"_id": comment_id})
        from src.models import DiscussionComment
        return DiscussionComment.query.get(comment_id)

    @staticmethod
    def create_comment(
        scenario_id: str,
        author_name: str,
        author_id: Any,
        content: str,
        python_construct: str,
        domain_connection: str,
        parent_id: Any
    ) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "scenario_id": scenario_id,
                "author_name": author_name,
                "author_id": author_id,
                "content": content,
                "python_construct": python_construct or "",
                "domain_connection": domain_connection or "",
                "upvotes": 0,
                "is_accepted": False,
                "parent_id": parent_id,
                "created_at": now,
            }
            result = get_collection("discussion_comments").insert_one(doc)
            doc["_id"] = result.get("_id")
            return doc
        from src.models import db, DiscussionComment
        comment = DiscussionComment(
            scenario_id=scenario_id,
            author_name=author_name,
            author_id=author_id,
            content=content,
            python_construct=python_construct,
            domain_connection=domain_connection,
            parent_id=parent_id
        )
        db.session.add(comment)
        db.session.commit()
        return comment

    @staticmethod
    def increment_comment_upvotes(comment_id: int) -> int:
        if _is_mongo():
            get_collection("discussion_comments").update_one(
                {"_id": comment_id},
                {"$inc": {"upvotes": 1}}
            )
            doc = get_collection("discussion_comments").find_one({"_id": comment_id})
            return doc.get("upvotes", 0) if doc else 0
        from src.models import db, DiscussionComment
        comment = DiscussionComment.query.get(comment_id)
        if comment:
            comment.upvotes = (comment.upvotes or 0) + 1
            db.session.commit()
            return comment.upvotes
        return 0

    @staticmethod
    def mark_comment_accepted(comment_id: int) -> bool:
        if _is_mongo():
            get_collection("discussion_comments").update_one(
                {"_id": comment_id},
                {"$set": {"is_accepted": True}}
            )
            return True
        from src.models import db, DiscussionComment
        comment = DiscussionComment.query.get(comment_id)
        if comment:
            comment.is_accepted = True
            db.session.commit()
            return True
        return False

    # ========================================================================
    # DiscussionUpvote operations
    # ========================================================================

    @staticmethod
    def get_upvote(comment_id: int, user_id: int) -> Optional[Any]:
        if _is_mongo():
            return get_collection("discussion_upvotes").find_one({
                "comment_id": comment_id,
                "user_id": user_id
            })
        from src.models import DiscussionUpvote
        return DiscussionUpvote.query.filter_by(
            comment_id=comment_id,
            user_id=user_id
        ).first()

    @staticmethod
    def create_upvote(comment_id: int, user_id: int) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "comment_id": comment_id,
                "user_id": user_id,
                "created_at": now,
            }
            result = get_collection("discussion_upvotes").insert_one(doc)
            doc["_id"] = result.get("_id")
            return doc
        from src.models import db, DiscussionUpvote
        upvote = DiscussionUpvote(comment_id=comment_id, user_id=user_id)
        db.session.add(upvote)
        db.session.commit()
        return upvote

    # ========================================================================
    # Contributor operations
    # ========================================================================

    @staticmethod
    def get_contributor_by_username(username: str) -> Optional[Any]:
        if _is_mongo():
            return get_collection("contributors").find_one({"username": username})
        from src.models import Contributor
        return Contributor.query.filter_by(username=username).first()

    @staticmethod
    def create_or_update_contributor(
        username: str,
        github: str,
        avatar_url: str,
        bio: str
    ) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "username": username,
                "github": github or "",
                "avatar_url": avatar_url or "",
                "bio": bio or "",
                "total_impact": 0,
                "created_at": now,
                "updated_at": now,
            }
            existing = get_collection("contributors").find_one({"username": username})
            if existing:
                get_collection("contributors").update_one(
                    {"username": username},
                    {"$set": doc}
                )
                doc["_id"] = existing.get("_id")
                return doc
            result = get_collection("contributors").insert_one(doc)
            doc["_id"] = result.get("_id")
            return doc
        from src.models import db, Contributor
        contributor = Contributor.query.filter_by(username=username).first()
        if not contributor:
            contributor = Contributor(username=username)
            db.session.add(contributor)
        if github is not None:
            contributor.github = github
        if avatar_url is not None:
            contributor.avatar_url = avatar_url
        if bio is not None:
            contributor.bio = bio
        db.session.commit()
        return contributor

    # ========================================================================
    # ReviewRequest operations
    # ========================================================================

    @staticmethod
    def create_review_request(
        scenario_id: str,
        submitter_id: int,
        submitter_name: str,
        scenario_data: str,
        status: str = "pending"
    ) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "scenario_id": scenario_id,
                "submitter_id": submitter_id,
                "submitter_name": submitter_name,
                "status": status,
                "reviewer_id": None,
                "reviewer_name": "",
                "anti_superficiality_score": None,
                "mentor_comments": "",
                "change_requests": "",
                "created_at": now,
                "reviewed_at": None,
                "scenario_data": scenario_data,
            }
            result = get_collection("review_requests").insert_one(doc)
            doc["_id"] = result.get("_id")
            return doc
        from src.models import db, ReviewRequest
        review = ReviewRequest(
            scenario_id=scenario_id,
            submitter_id=submitter_id,
            submitter_name=submitter_name,
            scenario_data=scenario_data,
            status=status
        )
        db.session.add(review)
        db.session.commit()
        return review

    @staticmethod
    def get_pending_reviews() -> list:
        if _is_mongo():
            return get_collection("review_requests").find(
                {"status": "pending"},
                sort=[("created_at", 1)]
            )
        from src.models import ReviewRequest
        return ReviewRequest.query.filter_by(status="pending").order_by(
            ReviewRequest.created_at.asc()
        ).all()

    @staticmethod
    def get_all_reviews(status: Optional[str] = None) -> list:
        if _is_mongo():
            query = {}
            if status:
                query["status"] = status
            return get_collection("review_requests").find(
                query,
                sort=[("created_at", -1)]
            )
        from src.models import ReviewRequest
        query = ReviewRequest.query
        if status:
            query = query.filter_by(status=status)
        return query.order_by(ReviewRequest.created_at.desc()).all()

    @staticmethod
    def get_review_by_id(review_id: int) -> Optional[Any]:
        if _is_mongo():
            from bson import ObjectId
            return get_collection("review_requests").find_one({"_id": review_id})
        from src.models import ReviewRequest
        return ReviewRequest.query.get(review_id)

    @staticmethod
    def update_review_request(
        review_id: int,
        status: str,
        reviewer_id: int,
        reviewer_name: str,
        mentor_comments: str,
        change_requests: str,
        reviewed_at: datetime
    ) -> bool:
        if _is_mongo():
            update = {
                "$set": {
                    "status": status,
                    "reviewer_id": reviewer_id,
                    "reviewer_name": reviewer_name,
                    "mentor_comments": mentor_comments,
                    "reviewed_at": reviewed_at,
                }
            }
            if change_requests:
                update["$set"]["change_requests"] = change_requests
            get_collection("review_requests").update_one(
                {"_id": review_id},
                update
            )
            return True
        from src.models import db, ReviewRequest
        review = ReviewRequest.query.get(review_id)
        if not review:
            return False
        review.status = status
        review.reviewer_id = reviewer_id
        review.reviewer_name = reviewer_name
        review.mentor_comments = mentor_comments
        review.change_requests = change_requests
        review.reviewed_at = reviewed_at
        db.session.commit()
        return True

    # ========================================================================
    # Notification operations
    # ========================================================================

    @staticmethod
    def create_notification(
        user_id: int,
        notification_type: str,
        title: str,
        message: str,
        link: str
    ) -> Any:
        if _is_mongo():
            now = utcnow()
            doc = {
                "user_id": user_id,
                "notification_type": notification_type,
                "title": title,
                "message": message,
                "link": link or "",
                "is_read": False,
                "created_at": now,
            }
            result = get_collection("notifications").insert_one(doc)
            doc["_id"] = result.get("_id")
            return doc
        from src.models import db, Notification
        notification = Notification(
            user_id=user_id,
            notification_type=notification_type,
            title=title,
            message=message,
            link=link
        )
        db.session.add(notification)
        db.session.commit()
        return notification

    @staticmethod
    def get_user_notifications(user_id: int, unread_only: bool = False) -> list:
        if _is_mongo():
            query = {"user_id": user_id}
            if unread_only:
                query["is_read"] = False
            return get_collection("notifications").find(
                query,
                sort=[("created_at", -1)],
                limit=50
            )
        from src.models import Notification
        query = Notification.query.filter_by(user_id=user_id)
        if unread_only:
            query = query.filter_by(is_read=False)
        return query.order_by(Notification.created_at.desc()).limit(50).all()

    @staticmethod
    def mark_notification_read(notification_id: int, user_id: int) -> bool:
        if _is_mongo():
            get_collection("notifications").update_one(
                {"_id": notification_id, "user_id": user_id},
                {"$set": {"is_read": True}}
            )
            return True
        from src.models import db, Notification
        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=user_id
        ).first()
        if not notification:
            return False
        notification.is_read = True
        db.session.commit()
        return True

    @staticmethod
    def mark_all_notifications_read(user_id: int) -> int:
        if _is_mongo():
            result = get_collection("notifications").update_many(
                {"user_id": user_id, "is_read": False},
                {"$set": {"is_read": True}}
            )
            return result.get("modified_count", 0)
        from src.models import db, Notification
        count = Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).update({"is_read": True})
        db.session.commit()
        return count

    @staticmethod
    def get_unread_notification_count(user_id: int) -> int:
        if _is_mongo():
            return get_collection("notifications").count_documents({
                "user_id": user_id,
                "is_read": False
            })
        from src.models import Notification
        return Notification.query.filter_by(
            user_id=user_id,
            is_read=False
        ).count()