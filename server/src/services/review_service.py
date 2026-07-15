import json
from datetime import datetime
from typing import Any, Optional
from flask import current_app
from src.models import db, ReviewRequest, Notification, User
from src.storage import Storage
from src.database import convert_object_ids


def _is_mongo():
    try:
        from src.database import is_mongodb
        return is_mongodb()
    except Exception:
        return False


class ReviewService:

    @staticmethod
    def create_review_request(scenario_id: str, submitter_id: int, submitter_name: str, scenario_data: dict) -> Any:
        if _is_mongo():
            doc = Storage.create_review_request(
                scenario_id=scenario_id,
                submitter_id=submitter_id,
                submitter_name=submitter_name,
                scenario_data=json.dumps(scenario_data),
                status='pending'
            )
            return convert_object_ids(doc)

        review = ReviewRequest(
            scenario_id=scenario_id,
            submitter_id=submitter_id,
            submitter_name=submitter_name,
            scenario_data=json.dumps(scenario_data),
            status='pending'
        )
        db.session.add(review)
        db.session.commit()
        return review

    @staticmethod
    def get_pending_reviews() -> list[dict[str, Any]]:
        if _is_mongo():
            reviews = Storage.get_pending_reviews()
            return [convert_object_ids(ReviewService._serialize_review_mongo(r)) for r in reviews]
        reviews = ReviewRequest.query.filter_by(status='pending').order_by(ReviewRequest.created_at.asc()).all()
        return [ReviewService._serialize_review(r) for r in reviews]

    @staticmethod
    def get_all_reviews(status: Optional[str] = None) -> list[dict[str, Any]]:
        if _is_mongo():
            reviews = Storage.get_all_reviews(status)
            return [convert_object_ids(ReviewService._serialize_review_mongo(r)) for r in reviews]
        query = ReviewRequest.query
        if status:
            query = query.filter_by(status=status)
        reviews = query.order_by(ReviewRequest.created_at.desc()).all()
        return [ReviewService._serialize_review(r) for r in reviews]

    @staticmethod
    def get_review_by_id(review_id: int) -> Optional[dict[str, Any]]:
        if _is_mongo():
            from bson import ObjectId
            doc = Storage.get_review_by_id(review_id)
            if not doc:
                return None
            return convert_object_ids(ReviewService._serialize_review_mongo(doc, include_scenario_data=True))
        review = ReviewRequest.query.get(review_id)
        if not review:
            return None
        return ReviewService._serialize_review(review, include_scenario_data=True)

    @staticmethod
    def approve_review(review_id: int, reviewer_id: int, reviewer_name: str, comments: str) -> Optional[dict[str, Any]]:
        if _is_mongo():
            from bson import ObjectId
            review = Storage.get_review_by_id(review_id)
            if not review:
                return None
            scenario_data = json.loads(review.get('scenario_data', '{}')) if review.get('scenario_data') else {}
            scenario_data['createdBy'] = {
                'username': review.get('submitter_name', ''),
                'approvedAt': datetime.utcnow().isoformat(),
                'reviewer': reviewer_name
            }
            scenario_data['isApproved'] = True
            _save_scenario_to_disk(review.get('scenario_id', ''), scenario_data)
            Storage.update_review_request(
                review_id=review_id,
                status='approved',
                reviewer_id=reviewer_id,
                reviewer_name=reviewer_name,
                mentor_comments=comments,
                change_requests='',
                reviewed_at=datetime.utcnow()
            )
            Storage.create_notification(
                user_id=review.get('submitter_id'),
                notification_type='review_approved',
                title='Scenario Approved!',
                message=f'Your scenario "{review.get("scenario_id")}" has been approved by {reviewer_name}.',
                link=f'/scenario/{review.get("scenario_id")}'
            )
            return convert_object_ids(ReviewService._serialize_review_mongo(Storage.get_review_by_id(review_id)))

        review = ReviewRequest.query.get(review_id)
        if not review:
            return None

        review.status = 'approved'
        review.reviewer_id = reviewer_id
        review.reviewer_name = reviewer_name
        review.mentor_comments = comments
        review.reviewed_at = datetime.utcnow()

        scenario_data = json.loads(review.scenario_data) if review.scenario_data else {}
        scenario_data['createdBy'] = {
            'username': review.submitter_name,
            'approvedAt': datetime.utcnow().isoformat(),
            'reviewer': reviewer_name
        }
        scenario_data['isApproved'] = True

        _save_scenario_to_disk(review.scenario_id, scenario_data)

        notification = Notification(
            user_id=review.submitter_id,
            notification_type='review_approved',
            title='Scenario Approved!',
            message=f'Your scenario "{review.scenario_id}" has been approved by {reviewer_name}.',
            link=f'/scenario/{review.scenario_id}'
        )
        db.session.add(notification)

        db.session.commit()
        return ReviewService._serialize_review(review)

    @staticmethod
    def request_changes(review_id: int, reviewer_id: int, reviewer_name: str, comments: str, change_requests: str) -> Optional[dict[str, Any]]:
        if _is_mongo():
            review = Storage.get_review_by_id(review_id)
            if not review:
                return None
            Storage.update_review_request(
                review_id=review_id,
                status='needs_changes',
                reviewer_id=reviewer_id,
                reviewer_name=reviewer_name,
                mentor_comments=comments,
                change_requests=change_requests,
                reviewed_at=datetime.utcnow()
            )
            Storage.create_notification(
                user_id=review.get('submitter_id'),
                notification_type='review_changes',
                title='Changes Requested',
                message=f'Changes have been requested for your scenario "{review.get("scenario_id")}" by {reviewer_name}.',
                link='/dashboard'
            )
            return convert_object_ids(ReviewService._serialize_review_mongo(Storage.get_review_by_id(review_id), include_scenario_data=True))

        review = ReviewRequest.query.get(review_id)
        if not review:
            return None

        review.status = 'needs_changes'
        review.reviewer_id = reviewer_id
        review.reviewer_name = reviewer_name
        review.mentor_comments = comments
        review.change_requests = change_requests
        review.reviewed_at = datetime.utcnow()

        notification = Notification(
            user_id=review.submitter_id,
            notification_type='review_changes',
            title='Changes Requested',
            message=f'Changes have been requested for your scenario "{review.scenario_id}" by {reviewer_name}.',
            link='/dashboard'
        )
        db.session.add(notification)

        db.session.commit()
        return ReviewService._serialize_review(review, include_scenario_data=True)

    @staticmethod
    def reject_review(review_id: int, reviewer_id: int, reviewer_name: str, comments: str) -> Optional[dict[str, Any]]:
        if _is_mongo():
            review = Storage.get_review_by_id(review_id)
            if not review:
                return None
            Storage.update_review_request(
                review_id=review_id,
                status='rejected',
                reviewer_id=reviewer_id,
                reviewer_name=reviewer_name,
                mentor_comments=comments,
                change_requests='',
                reviewed_at=datetime.utcnow()
            )
            Storage.create_notification(
                user_id=review.get('submitter_id'),
                notification_type='review_rejected',
                title='Scenario Rejected',
                message=f'Your scenario "{review.get("scenario_id")}" has been rejected by {reviewer_name}.',
                link='/dashboard'
            )
            return convert_object_ids(ReviewService._serialize_review_mongo(Storage.get_review_by_id(review_id)))

        review = ReviewRequest.query.get(review_id)
        if not review:
            return None

        review.status = 'rejected'
        review.reviewer_id = reviewer_id
        review.reviewer_name = reviewer_name
        review.mentor_comments = comments
        review.reviewed_at = datetime.utcnow()

        notification = Notification(
            user_id=review.submitter_id,
            notification_type='review_rejected',
            title='Scenario Rejected',
            message=f'Your scenario "{review.scenario_id}" has been rejected by {reviewer_name}.',
            link='/dashboard'
        )
        db.session.add(notification)

        db.session.commit()
        return ReviewService._serialize_review(review)

    @staticmethod
    def get_user_notifications(user_id: int, unread_only: bool = False) -> list[dict[str, Any]]:
        if _is_mongo():
            notifications = Storage.get_user_notifications(user_id, unread_only)
            return [ReviewService._serialize_notification_mongo(n) for n in notifications]
        query = Notification.query.filter_by(user_id=user_id)
        if unread_only:
            query = query.filter_by(is_read=False)
        notifications = query.order_by(Notification.created_at.desc()).limit(50).all()
        return [ReviewService._serialize_notification(n) for n in notifications]

    @staticmethod
    def mark_notification_read(notification_id: int, user_id: int) -> bool:
        if _is_mongo():
            return Storage.mark_notification_read(notification_id, user_id)
        notification = Notification.query.filter_by(id=notification_id, user_id=user_id).first()
        if not notification:
            return False
        notification.is_read = True
        db.session.commit()
        return True

    @staticmethod
    def mark_all_notifications_read(user_id: int) -> int:
        if _is_mongo():
            return Storage.mark_all_notifications_read(user_id)
        count = Notification.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
        db.session.commit()
        return count

    @staticmethod
    def get_unread_notification_count(user_id: int) -> int:
        if _is_mongo():
            return Storage.get_unread_notification_count(user_id)
        return Notification.query.filter_by(user_id=user_id, is_read=False).count()

    @staticmethod
    def _serialize_review(review: ReviewRequest, include_scenario_data: bool = False) -> dict[str, Any]:
        data = {
            'id': review.id,
            'scenarioId': review.scenario_id,
            'submitterId': review.submitter_id,
            'submitterName': review.submitter_name,
            'status': review.status,
            'reviewerId': review.reviewer_id,
            'reviewerName': review.reviewer_name,
            'antiSuperficialityScore': review.anti_superficiality_score,
            'mentorComments': review.mentor_comments,
            'changeRequests': review.change_requests,
            'createdAt': review.created_at.isoformat() if review.created_at else None,
            'reviewedAt': review.reviewed_at.isoformat() if review.reviewed_at else None
        }
        if include_scenario_data and review.scenario_data:
            data['scenarioData'] = json.loads(review.scenario_data)
        return data

    @staticmethod
    def _serialize_review_mongo(doc: dict, include_scenario_data: bool = False) -> dict[str, Any]:
        if not doc:
            return {}
        data = {
            'id': int(str(doc.get("_id", "0")), 16) if hasattr(doc.get("_id"), "__str__") else doc.get("id", 0),
            'scenarioId': doc.get('scenario_id', ''),
            'submitterId': doc.get('submitter_id'),
            'submitterName': doc.get('submitter_name', ''),
            'status': doc.get('status', 'pending'),
            'reviewerId': doc.get('reviewer_id'),
            'reviewerName': doc.get('reviewer_name', ''),
            'antiSuperficialityScore': doc.get('anti_superficiality_score'),
            'mentorComments': doc.get('mentor_comments', ''),
            'changeRequests': doc.get('change_requests', ''),
            'createdAt': doc.get('created_at'),
            'reviewedAt': doc.get('reviewed_at')
        }
        if include_scenario_data and doc.get('scenario_data'):
            data['scenarioData'] = json.loads(doc.get('scenario_data', '{}'))
        return data

    @staticmethod
    def _serialize_notification(notification: Notification) -> dict[str, Any]:
        return {
            'id': notification.id,
            'type': notification.notification_type,
            'title': notification.title,
            'message': notification.message,
            'link': notification.link,
            'isRead': notification.is_read,
            'createdAt': notification.created_at.isoformat() if notification.created_at else None
        }

    @staticmethod
    def _serialize_notification_mongo(doc: dict) -> dict[str, Any]:
        if not doc:
            return {}
        return {
            'id': int(str(doc.get("_id", "0")), 16) if hasattr(doc.get("_id"), "__str__") else doc.get("id", 0),
            'type': doc.get('notification_type', ''),
            'title': doc.get('title', ''),
            'message': doc.get('message', ''),
            'link': doc.get('link', ''),
            'isRead': doc.get('is_read', False),
            'createdAt': doc.get('created_at')
        }


def _save_scenario_to_disk(scenario_id: str, scenario_data: dict) -> bool:
    from pathlib import Path
    try:
        scenarios_dir = current_app.config.get('scenarios_dir', '')
        if not scenarios_dir:
            return False

        scenario_dir = Path(scenarios_dir) / scenario_id
        if not scenario_dir.exists():
            scenario_dir.mkdir(parents=True)
            (scenario_dir / "solution").mkdir()

        scenario_meta = {
            "id": scenario_id,
            "title": scenario_data.get("title", ""),
            "domain": scenario_data.get("domain", "General"),
            "domainCategory": scenario_data.get("domainCategory", ""),
            "philosophicalAnchor": scenario_data.get("philosophicalAnchor", ""),
            "pythonConcept": scenario_data.get("pythonConcept", ""),
            "difficultyLevel": scenario_data.get("difficultyLevel", 2),
            "jonasanType": scenario_data.get("jonasanType", "Structured Inquiry"),
            "targetConstructs": scenario_data.get("targetConstructs", []),
            "briefDescription": scenario_data.get("briefDescription", ""),
            "theoryPillar": scenario_data.get("theoryPillar", ""),
            "anchorPillar": scenario_data.get("anchorPillar", ""),
            "triggerPillar": scenario_data.get("triggerPillar", ""),
            "realityPillar": scenario_data.get("realityPillar", ""),
            "createdBy": scenario_data.get("createdBy", {}),
            "isApproved": scenario_data.get("isApproved", False)
        }

        with open(scenario_dir / "scenario.json", "w", encoding="utf-8") as f:
            json.dump(scenario_meta, f, indent=2)

        case_study = scenario_data.get("caseStudy", "# Case Study\n\nTo be written.")
        with open(scenario_dir / "case-study.md", "w", encoding="utf-8") as f:
            f.write(case_study)

        hints_data = scenario_data.get('hints', [])
        if hints_data:
            hints_formatted = [{"level": h.get("level", i+1), "text": h.get("text", "")} for i, h in enumerate(hints_data)]
            with open(scenario_dir / "hints.json", "w", encoding="utf-8") as f:
                json.dump(hints_formatted, f, indent=2)
        else:
            with open(scenario_dir / "hints.json", "w", encoding="utf-8") as f:
                f.write("[]")

        default_reflection = scenario_data.get('reflectionPrompts', [
            "What was the hardest part of this scenario and why?",
            "How does the philosophical anchor connect to the Python concept for you personally?",
            "What would you do differently if you approached this scenario again?",
            "Where have you seen this Python concept in real-world code before?"
        ])
        with open(scenario_dir / "reflection-prompts.json", "w", encoding="utf-8") as f:
            json.dump(default_reflection, f, indent=2)

        rubric = scenario_data.get('scoringRubric', {
            "reasoning": {"weight": 40, "description": "Understanding of the philosophical connection"},
            "code": {"weight": 30, "description": "Correct use of target Python constructs"},
            "reflection": {"weight": 30, "description": "Depth of reflection on the learning experience"}
        })
        with open(scenario_dir / "scoring-rubric.json", "w", encoding="utf-8") as f:
            json.dump(rubric, f, indent=2)

        return True
    except Exception as e:
        print(f"[ReviewService] Error saving scenario to disk: {e}")
        return False