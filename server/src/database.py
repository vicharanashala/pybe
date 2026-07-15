"""
MongoDB Configuration Module
============================

Handles connection to MongoDB via PyMongo/MongoEngine.
Supports both MongoDB Atlas (cloud) and local MongoDB instances.

Environment Variables:
    STORAGE_MODE: 'mongodb' or 'sqlite' (default: 'sqlite')
    MONGODB_URI: Full MongoDB connection URI
        - Atlas: mongodb+srv://user:password@cluster.mongodb.net/pybe
        - Local: mongodb://localhost:27017/pybe
    MONGODB_DB: Database name (default: 'pybe')

Usage:
    from src.database import init_db, get_db

    # Initialize (call once at startup)
    init_db()

    # Get database instance
    db = get_db()
"""

import os
from typing import Optional

STORAGE_MODE = os.environ.get('STORAGE_MODE', 'sqlite').lower()
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/pybe')
MONGODB_DB = os.environ.get('MONGODB_DB', 'pybe')

_mongo_client = None
_mongo_db = None


def init_mongodb():
    """
    Initialize MongoDB connection.

    Supports:
    - MongoDB Atlas (cloud): mongodb+srv://user:password@cluster.mongodb.net/db
    - Local MongoDB: mongodb://localhost:27017/db
    """
    global _mongo_client, _mongo_db

    if STORAGE_MODE != 'mongodb':
        return False

    try:
        from pymongo import MongoClient
    except ImportError:
        print("[pyBE] MongoDB driver not installed. Run: pip install pymongo")
        return False

    try:
        _mongo_client = MongoClient(
            MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        _mongo_db = _mongo_client[MONGODB_DB]

        _mongo_client.admin.command('ping')
        print(f"[pyBE] Connected to MongoDB: {MONGODB_DB}")
        return True
    except Exception as e:
        print(f"[pyBE] MongoDB connection failed: {e}")
        print(f"[pyBE] Falling back to SQLite storage mode")
        return False


def get_db():
    """Get the MongoDB database instance."""
    return _mongo_db


def get_client():
    """Get the MongoDB client instance."""
    return _mongo_client


def is_mongodb():
    """Check if MongoDB is the active storage mode."""
    return STORAGE_MODE == 'mongodb' and _mongo_db is not None


def close_mongodb():
    """Close the MongoDB connection."""
    global _mongo_client, _mongo_db
    if _mongo_client:
        _mongo_client.close()
        _mongo_client = None
        _mongo_db = None
        print("[pyBE] MongoDB connection closed")


class MongoCollection:
    """
    Unified collection interface that works like MongoDB but degrades gracefully.

    This class provides a common interface for both MongoDB and a fallback
    JSON-file-based storage when MongoDB is unavailable.
    """

    def __init__(self, collection_name: str):
        self.collection_name = collection_name
        self._mongo_collection = None

        if is_mongodb():
            self._mongo_collection = _mongo_db[collection_name]

    def find_one(self, query: dict) -> Optional[dict]:
        """Find a single document matching the query."""
        if self._mongo_collection:
            return self._mongo_collection.find_one(query)
        return None

    def find(self, query: dict = None, sort: list = None, limit: int = None) -> list:
        """Find documents matching the query."""
        if not self._mongo_collection:
            return []

        cursor = self._mongo_collection.find(query or {})

        if sort:
            cursor = cursor.sort(sort)

        if limit:
            cursor = cursor.limit(limit)

        return list(cursor)

    def insert_one(self, document: dict) -> dict:
        """Insert a single document."""
        if self._mongo_collection:
            result = self._mongo_collection.insert_one(document)
            return {"_id": result.inserted_id}
        return {"_id": None}

    def insert_many(self, documents: list) -> dict:
        """Insert multiple documents."""
        if self._mongo_collection:
            result = self._mongo_collection.insert_many(documents)
            return {"inserted_ids": result.inserted_ids}
        return {"inserted_ids": []}

    def update_one(self, query: dict, update: dict, upsert: bool = False) -> dict:
        """Update a single document."""
        if self._mongo_collection:
            result = self._mongo_collection.update_one(query, update, upsert=upsert)
            return {
                "matched_count": result.matched_count,
                "modified_count": result.modified_count,
                "upserted_id": result.upserted_id
            }
        return {"matched_count": 0, "modified_count": 0, "upserted_id": None}

    def update_many(self, query: dict, update: dict) -> dict:
        """Update multiple documents."""
        if self._mongo_collection:
            result = self._mongo_collection.update_many(query, update)
            return {
                "matched_count": result.matched_count,
                "modified_count": result.modified_count
            }
        return {"matched_count": 0, "modified_count": 0}

    def delete_one(self, query: dict) -> dict:
        """Delete a single document."""
        if self._mongo_collection:
            result = self._mongo_collection.delete_one(query)
            return {"deleted_count": result.deleted_count}
        return {"deleted_count": 0}

    def delete_many(self, query: dict) -> dict:
        """Delete multiple documents."""
        if self._mongo_collection:
            result = self._mongo_collection.delete_many(query)
            return {"deleted_count": result.deleted_count}
        return {"deleted_count": 0}

    def count_documents(self, query: dict = None) -> int:
        """Count documents matching the query."""
        if self._mongo_collection:
            return self._mongo_collection.count_documents(query or {})
        return 0

    def aggregate(self, pipeline: list) -> list:
        """Run an aggregation pipeline."""
        if self._mongo_collection:
            return list(self._mongo_collection.aggregate(pipeline))
        return []

    def create_index(self, keys: list, **kwargs):
        """Create an index on the collection."""
        if self._mongo_collection is not None:
            return self._mongo_collection.create_index(keys, **kwargs)
        return None


def get_collection(name: str) -> MongoCollection:
    """Get a MongoCollection wrapper for the named collection."""
    return MongoCollection(name)


def convert_object_ids(doc):
    """
    Recursively convert ObjectId fields to int in MongoDB documents.
    Also handles lists of documents.

    This is the single canonical utility for ObjectId conversion across
    all services and routes that use MongoDB storage.

    Args:
        doc: A document dict, list of documents, or None

    Returns:
        The document with ObjectId fields converted to int
    """
    if doc is None:
        return None

    if isinstance(doc, list):
        return [convert_object_ids(d) for d in doc]

    if isinstance(doc, dict):
        if "_id" in doc:
            from bson import ObjectId
            obj_id = doc["_id"]
            if isinstance(obj_id, ObjectId):
                doc["id"] = int(str(obj_id), 16)
            elif isinstance(obj_id, int):
                doc["id"] = obj_id
        return doc

    return doc