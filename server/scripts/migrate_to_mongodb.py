"""
SQLite to MongoDB Migration Script
==================================

Migrates data from SQLite database to MongoDB.
Supports both full migration and incremental sync.

Usage:
    # Full migration (clears existing MongoDB data)
    python scripts/migrate_to_mongodb.py --mode full

    # Dry run (show what would be migrated)
    python scripts/migrate_to_mongodb.py --mode dry-run

    # Check MongoDB connection
    python scripts/migrate_to_mongodb.py --check

Environment Variables:
    STORAGE_MODE: Set to 'mongodb' to use MongoDB storage
    MONGODB_URI: MongoDB connection URI
    DATABASE_URL: SQLite database path (default: sqlite:///pybe.db)
"""

import os
import sys
import argparse
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ["STORAGE_MODE"] = "mongodb"

from src.database import init_mongodb, get_db, is_mongodb, get_collection
from src.mongo_models import (
    UserDocument, ProgressDocument, DiscussionCommentDocument,
    DiscussionUpvoteDocument, LearningPathDocument, ContributorDocument,
    ReviewRequestDocument, NotificationDocument, create_indexes
)
from src.models import db, User, Progress, DiscussionComment, DiscussionUpvote, LearningPath, Contributor, ReviewRequest, Notification


def utcnow():
    return datetime.now(timezone.utc)


class MigrationRunner:
    def __init__(self, app=None):
        self.app = app
        self.stats = {
            "users": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
            "progress": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
            "discussion_comments": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
            "discussion_upvotes": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
            "learning_paths": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
            "contributors": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
            "review_requests": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
            "notifications": {"total": 0, "migrated": 0, "skipped": 0, "errors": 0},
        }

    def migrate_all(self, dry_run=False):
        """Run full migration."""
        print("\n" + "=" * 60)
        print("pyBE SQLite to MongoDB Migration")
        print("=" * 60)
        print(f"Mode: {'DRY RUN' if dry_run else 'LIVE MIGRATION'}")
        print(f"Started at: {datetime.now().isoformat()}")
        print("=" * 60 + "\n")

        self._migrate_users(dry_run)
        self._migrate_progress(dry_run)
        self._migrate_discussion_comments(dry_run)
        self._migrate_discussion_upvotes(dry_run)
        self._migrate_learning_paths(dry_run)
        self._migrate_contributors(dry_run)
        self._migrate_review_requests(dry_run)
        self._migrate_notifications(dry_run)

        if not dry_run:
            create_indexes()

        self._print_summary()
        return self.stats

    def _migrate_users(self, dry_run):
        """Migrate users collection."""
        print("\n--- Migrating Users ---")

        users = User.query.all()
        self.stats["users"]["total"] = len(users)

        for user in users:
            try:
                doc = UserDocument.to_document(user)
                existing = get_collection("users").find_one({"username": user.username})

                if existing:
                    print(f"  SKIP: User '{user.username}' already exists")
                    self.stats["users"]["skipped"] += 1
                elif dry_run:
                    print(f"  WOULD CREATE: User '{user.username}' ({user.email})")
                    self.stats["users"]["migrated"] += 1
                else:
                    result = get_collection("users").insert_one(doc)
                    print(f"  MIGRATED: User '{user.username}' -> {result.get('_id')}")
                    self.stats["users"]["migrated"] += 1
            except Exception as e:
                print(f"  ERROR migrating user '{user.username}': {e}")
                self.stats["users"]["errors"] += 1

    def _migrate_progress(self, dry_run):
        """Migrate progress collection."""
        print("\n--- Migrating Progress (SM-2 Data) ---")

        records = Progress.query.all()
        self.stats["progress"]["total"] = len(records)

        for record in records:
            try:
                doc = ProgressDocument.to_document(record)
                existing = get_collection("progress").find_one({
                    "user_id": record.user_id,
                    "scenario_id": record.scenario_id
                })

                if existing:
                    if not dry_run:
                        get_collection("progress").update_one(
                            {"user_id": record.user_id, "scenario_id": record.scenario_id},
                            {"$set": doc}
                        )
                    print(f"  UPDATE: Progress user={record.user_id} scenario={record.scenario_id}")
                    self.stats["progress"]["skipped"] += 1
                elif dry_run:
                    print(f"  WOULD CREATE: Progress user={record.user_id} scenario={record.scenario_id}")
                    self.stats["progress"]["migrated"] += 1
                else:
                    result = get_collection("progress").insert_one(doc)
                    print(f"  MIGRATED: Progress -> {result.get('_id')}")
                    self.stats["progress"]["migrated"] += 1
            except Exception as e:
                print(f"  ERROR migrating progress: {e}")
                self.stats["progress"]["errors"] += 1

    def _migrate_discussion_comments(self, dry_run):
        """Migrate discussion comments collection."""
        print("\n--- Migrating Discussion Comments ---")

        comments = DiscussionComment.query.all()
        self.stats["discussion_comments"]["total"] = len(comments)

        for comment in comments:
            try:
                doc = DiscussionCommentDocument.to_document(comment)

                if dry_run:
                    print(f"  WOULD CREATE: Comment by '{comment.author_name}' on '{comment.scenario_id}'")
                    self.stats["discussion_comments"]["migrated"] += 1
                else:
                    result = get_collection("discussion_comments").insert_one(doc)
                    print(f"  MIGRATED: Comment -> {result.get('_id')}")
                    self.stats["discussion_comments"]["migrated"] += 1
            except Exception as e:
                print(f"  ERROR migrating comment: {e}")
                self.stats["discussion_comments"]["errors"] += 1

    def _migrate_discussion_upvotes(self, dry_run):
        """Migrate discussion upvotes collection."""
        print("\n--- Migrating Discussion Upvotes ---")

        upvotes = DiscussionUpvote.query.all()
        self.stats["discussion_upvotes"]["total"] = len(upvotes)

        for upvote in upvotes:
            try:
                doc = DiscussionUpvoteDocument.to_document(upvote)
                existing = get_collection("discussion_upvotes").find_one({
                    "comment_id": upvote.comment_id,
                    "user_id": upvote.user_id
                })

                if existing:
                    print(f"  SKIP: Upvote comment={upvote.comment_id} user={upvote.user_id}")
                    self.stats["discussion_upvotes"]["skipped"] += 1
                elif dry_run:
                    print(f"  WOULD CREATE: Upvote comment={upvote.comment_id} user={upvote.user_id}")
                    self.stats["discussion_upvotes"]["migrated"] += 1
                else:
                    result = get_collection("discussion_upvotes").insert_one(doc)
                    print(f"  MIGRATED: Upvote -> {result.get('_id')}")
                    self.stats["discussion_upvotes"]["migrated"] += 1
            except Exception as e:
                print(f"  ERROR migrating upvote: {e}")
                self.stats["discussion_upvotes"]["errors"] += 1

    def _migrate_learning_paths(self, dry_run):
        """Migrate learning paths collection."""
        print("\n--- Migrating Learning Paths ---")

        paths = LearningPath.query.all()
        self.stats["learning_paths"]["total"] = len(paths)

        for path in paths:
            try:
                doc = LearningPathDocument.to_document(path)

                if dry_run:
                    print(f"  WOULD CREATE: Path user={path.user_id} domain={path.domain}")
                    self.stats["learning_paths"]["migrated"] += 1
                else:
                    result = get_collection("learning_paths").insert_one(doc)
                    print(f"  MIGRATED: Path -> {result.get('_id')}")
                    self.stats["learning_paths"]["migrated"] += 1
            except Exception as e:
                print(f"  ERROR migrating path: {e}")
                self.stats["learning_paths"]["errors"] += 1

    def _migrate_contributors(self, dry_run):
        """Migrate contributors collection."""
        print("\n--- Migrating Contributors ---")

        contributors = Contributor.query.all()
        self.stats["contributors"]["total"] = len(contributors)

        for contrib in contributors:
            try:
                doc = ContributorDocument.to_document(contrib)
                existing = get_collection("contributors").find_one({"username": contrib.username})

                if existing:
                    if not dry_run:
                        get_collection("contributors").update_one(
                            {"username": contrib.username},
                            {"$set": doc}
                        )
                    print(f"  UPDATE: Contributor '{contrib.username}'")
                    self.stats["contributors"]["skipped"] += 1
                elif dry_run:
                    print(f"  WOULD CREATE: Contributor '{contrib.username}'")
                    self.stats["contributors"]["migrated"] += 1
                else:
                    result = get_collection("contributors").insert_one(doc)
                    print(f"  MIGRATED: Contributor '{contrib.username}' -> {result.get('_id')}")
                    self.stats["contributors"]["migrated"] += 1
except Exception as e:
                print(f"  ERROR migrating contributor '{contrib.username}': {e}")
                self.stats["contributors"]["errors"] += 1

    def _migrate_review_requests(self, dry_run):
        """Migrate review_requests collection."""
        print("\n--- Migrating Review Requests ---")

        reviews = ReviewRequest.query.all()
        self.stats["review_requests"]["total"] = len(reviews)

        for review in reviews:
            try:
                doc = ReviewRequestDocument.to_document(review)
                existing = get_collection("review_requests").find_one({
                    "scenario_id": review.scenario_id,
                    "submitter_id": review.submitter_id
                })

                if existing:
                    if not dry_run:
                        get_collection("review_requests").update_one(
                            {"scenario_id": review.scenario_id, "submitter_id": review.submitter_id},
                            {"$set": doc}
                        )
                    print(f"  UPDATE: ReviewRequest scenario={review.scenario_id}")
                    self.stats["review_requests"]["skipped"] += 1
                elif dry_run:
                    print(f"  WOULD CREATE: ReviewRequest scenario={review.scenario_id}")
                    self.stats["review_requests"]["migrated"] += 1
                else:
                    result = get_collection("review_requests").insert_one(doc)
                    print(f"  MIGRATED: ReviewRequest -> {result.get('_id')}")
                    self.stats["review_requests"]["migrated"] += 1
            except Exception as e:
                print(f"  ERROR migrating review_request: {e}")
                self.stats["review_requests"]["errors"] += 1

    def _migrate_notifications(self, dry_run):
        """Migrate notifications collection."""
        print("\n--- Migrating Notifications ---")

        notifications = Notification.query.all()
        self.stats["notifications"]["total"] = len(notifications)

        for notification in notifications:
            try:
                doc = NotificationDocument.to_document(notification)
                existing = get_collection("notifications").find_one({
                    "user_id": notification.user_id,
                    "notification_type": notification.notification_type,
                    "created_at": notification.created_at
                })

                if existing:
                    print(f"  SKIP: Notification user={notification.user_id} type={notification.notification_type}")
                    self.stats["notifications"]["skipped"] += 1
                elif dry_run:
                    print(f"  WOULD CREATE: Notification user={notification.user_id} type={notification.notification_type}")
                    self.stats["notifications"]["migrated"] += 1
                else:
                    result = get_collection("notifications").insert_one(doc)
                    print(f"  MIGRATED: Notification -> {result.get('_id')}")
                    self.stats["notifications"]["migrated"] += 1
            except Exception as e:
                print(f"  ERROR migrating notification: {e}")
                self.stats["notifications"]["errors"] += 1

    def _print_summary(self):
        """Print migration summary."""
        print("\n" + "=" * 60)
        print("MIGRATION SUMMARY")
        print("=" * 60)

        total_migrated = sum(s["migrated"] for s in self.stats.values())
        total_errors = sum(s["errors"] for s in self.stats.values())

        for collection, stats in self.stats.items():
            print(f"\n{collection}:")
            print(f"  Total:   {stats['total']}")
            print(f"  Migrated: {stats['migrated']}")
            print(f"  Skipped:  {stats['skipped']}")
            print(f"  Errors:   {stats['errors']}")

        print("\n" + "-" * 60)
        print(f"TOTAL MIGRATED: {total_migrated}")
        print(f"TOTAL ERRORS:   {total_errors}")
        print("=" * 60 + "\n")


def check_mongodb_connection():
    """Check if MongoDB connection is working."""
    print("\n--- Checking MongoDB Connection ---")

    success = init_mongodb()

    if success:
        db = get_db()
        print(f"Connected to MongoDB: {db.name}")

        collections = db.list_collection_names()
        print(f"Collections: {', '.join(collections)}")

        for coll_name in ["users", "progress", "discussion_comments"]:
            count = db[coll_name].count_documents({})
            print(f"  {coll_name}: {count} documents")
    else:
        print("MongoDB connection failed!")
        print("Make sure:")
        print("  1. STORAGE_MODE=mongodb is set")
        print("  2. MONGODB_URI is correctly configured")
        print("  3. MongoDB is running and accessible")

    return success


def main():
    parser = argparse.ArgumentParser(description="Migrate pyBE data to MongoDB")
    parser.add_argument("--mode", choices=["full", "dry-run"], default="dry-run",
                        help="Migration mode")
    parser.add_argument("--check", action="store_true",
                        help="Check MongoDB connection only")

    args = parser.parse_args()

    if args.check:
        success = check_mongodb_connection()
        sys.exit(0 if success else 1)

    if not init_mongodb():
        print("ERROR: Could not connect to MongoDB")
        sys.exit(1)

    from app import create_app
    app = create_app()

    with app.app_context():
        runner = MigrationRunner(app)
        runner.migrate_all(dry_run=(args.mode == "dry-run"))

    sys.exit(0)


if __name__ == "__main__":
    main()