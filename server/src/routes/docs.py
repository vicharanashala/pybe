"""
pyBE API Documentation
======================

OpenAPI/Swagger documentation for the pyBE API.

This module provides API schema definitions for automatic documentation generation.
"""

from flask import Blueprint, jsonify, request, current_app
from datetime import datetime

api_docs_bp = Blueprint('api_docs', __name__)


def get_openapi_spec() -> dict:
    """
    Generate OpenAPI 3.0 specification for the pyBE API.

    Returns complete OpenAPI schema with all endpoints, schemas, and security.
    """
    return {
        "openapi": "3.0.3",
        "info": {
            "title": "pyBE API",
            "description": "Philosophical Python Learning Platform API",
            "version": "0.1.0",
            "contact": {
                "name": "pyBE Support"
            },
            "license": {
                "name": "MIT"
            }
        },
        "servers": [
            {
                "url": "/api",
                "description": "Local development server"
            }
        ],
        "paths": get_paths(),
        "components": get_components(),
        "security": [{"bearerAuth": []}]
    }


def get_paths() -> dict:
    """Define all API paths with operations."""
    return {
        "/health": {
            "get": {
                "tags": ["Health"],
                "summary": "Health check",
                "responses": {
                    "200": {
                        "description": "Server is healthy",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/HealthResponse"}
                            }
                        }
                    }
                }
            }
        },
        "/auth/register": {
            "post": {
                "tags": ["Authentication"],
                "summary": "Register new user",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/RegisterRequest"}
                        }
                    }
                },
                "responses": {
                    "201": {"description": "User registered"},
                    "409": {"description": "User exists"}
                }
            }
        },
        "/auth/login": {
            "post": {
                "tags": ["Authentication"],
                "summary": "Login user",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/LoginRequest"}
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Login successful",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/LoginResponse"}
                            }
                        }
                    },
                    "401": {"description": "Invalid credentials"}
                }
            }
        },
        "/auth/refresh": {
            "post": {
                "tags": ["Authentication"],
                "summary": "Refresh JWT token",
                "security": [{"bearerAuth": []}],
                "responses": {
                    "200": {"description": "Token refreshed"},
                    "401": {"description": "Invalid token"}
                }
            }
        },
        "/scenarios": {
            "get": {
                "tags": ["Scenarios"],
                "summary": "List scenarios",
                "parameters": [
                    {"name": "domain", "in": "query", "schema": {"type": "string"}},
                    {"name": "level", "in": "query", "schema": {"type": "string"}},
                    {"name": "type", "in": "query", "schema": {"type": "string"}}
                ],
                "responses": {
                    "200": {
                        "description": "List of scenarios",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/ScenarioList"}
                            }
                        }
                    }
                }
            },
            "post": {
                "tags": ["Scenarios"],
                "summary": "Create scenario (admin)",
                "security": [{"bearerAuth": []}],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ScenarioCreate"}
                        }
                    }
                },
                "responses": {
                    "201": {"description": "Scenario created"},
                    "400": {"description": "Invalid data"}
                }
            }
        },
        "/scenarios/{scenario_id}": {
            "get": {
                "tags": ["Scenarios"],
                "summary": "Get scenario details",
                "parameters": [
                    {"name": "scenario_id", "in": "path", "required": True, "schema": {"type": "string"}}
                ],
                "responses": {
                    "200": {"description": "Scenario details"},
                    "404": {"description": "Not found"}
                }
            }
        },
        "/scenarios/{scenario_id}/hints": {
            "get": {
                "tags": ["Scenarios"],
                "summary": "Get scenario hints",
                "parameters": [
                    {"name": "scenario_id", "in": "path", "required": True, "schema": {"type": "string"}},
                    {"name": "reveal", "in": "query", "schema": {"type": "integer"}}
                ],
                "responses": {
                    "200": {"description": "Hints array"},
                    "404": {"description": "Not found"}
                }
            }
        },
        "/scenarios/{scenario_id}/discussions": {
            "get": {
                "tags": ["Discussions"],
                "summary": "Get discussion threads",
                "parameters": [
                    {"name": "scenario_id", "in": "path", "required": True, "schema": {"type": "string"}}
                ],
                "responses": {
                    "200": {"description": "Discussion threads"}
                }
            },
            "post": {
                "tags": ["Discussions"],
                "summary": "Post comment",
                "parameters": [
                    {"name": "scenario_id", "in": "path", "required": True, "schema": {"type": "string"}}
                ],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/CommentRequest"}
                        }
                    }
                },
                "responses": {
                    "201": {"description": "Comment posted"}
                }
            }
        },
        "/progress": {
            "post": {
                "tags": ["Progress"],
                "summary": "Save progress",
                "security": [{"bearerAuth": []}],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ProgressRequest"}
                        }
                    }
                },
                "responses": {
                    "200": {"description": "Progress saved"},
                    "401": {"description": "Unauthorized"}
                }
            }
        },
        "/gamification/profile": {
            "get": {
                "tags": ["Gamification"],
                "summary": "Get user profile",
                "security": [{"bearerAuth": []}],
                "responses": {
                    "200": {
                        "description": "User profile",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/GamificationProfile"}
                            }
                        }
                    }
                }
            }
        },
        "/gamification/leaderboard": {
            "get": {
                "tags": ["Gamification"],
                "summary": "Get leaderboard",
                "parameters": [
                    {"name": "limit", "in": "query", "schema": {"type": "integer"}}
                ],
                "responses": {
                    "200": {
                        "description": "Leaderboard",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/Leaderboard"}
                            }
                        }
                    }
                }
            }
        },
        "/evaluate": {
            "post": {
                "tags": ["AI Evaluation"],
                "summary": "Evaluate code",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/EvaluateRequest"}
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Evaluation result",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/EvaluationResult"}
                            }
                        }
                    }
                }
            }
        }
    }


def get_components() -> dict:
    """Define reusable schemas."""
    return {
        "schemas": {
            "HealthResponse": {
                "type": "object",
                "properties": {
                    "status": {"type": "string"},
                    "version": {"type": "string"},
                    "name": {"type": "string"},
                    "storage_mode": {"type": "string"}
                }
            },
            "RegisterRequest": {
                "type": "object",
                "required": ["username", "password"],
                "properties": {
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                    "password": {"type": "string"}
                }
            },
            "LoginRequest": {
                "type": "object",
                "required": ["password"],
                "properties": {
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                    "password": {"type": "string"}
                }
            },
            "LoginResponse": {
                "type": "object",
                "properties": {
                    "token": {"type": "string"},
                    "user": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "integer"},
                            "username": {"type": "string"},
                            "isAdmin": {"type": "boolean"}
                        }
                    }
                }
            },
            "ScenarioList": {
                "type": "object",
                "properties": {
                    "count": {"type": "integer"},
                    "scenarios": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ScenarioSummary"}
                    }
                }
            },
            "ScenarioSummary": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "title": {"type": "string"},
                    "domain": {"type": "string"},
                    "difficultyLevel": {"type": "integer"},
                    "jonasanType": {"type": "string"},
                    "pythonConcept": {"type": "string"},
                    "briefDescription": {"type": "string"}
                }
            },
            "ScenarioCreate": {
                "type": "object",
                "required": ["id", "title", "domain"],
                "properties": {
                    "id": {"type": "string"},
                    "title": {"type": "string"},
                    "domain": {"type": "string"},
                    "pythonConcept": {"type": "string"},
                    "difficultyLevel": {"type": "integer"},
                    "jonasanType": {"type": "string"},
                    "philosophicalAnchor": {"type": "string"},
                    "theoryPillar": {"type": "string"},
                    "anchorPillar": {"type": "string"},
                    "triggerPillar": {"type": "string"},
                    "realityPillar": {"type": "string"},
                    "caseStudy": {"type": "string"},
                    "hints": {"type": "array"}
                }
            },
            "CommentRequest": {
                "type": "object",
                "required": ["text"],
                "properties": {
                    "author": {"type": "string"},
                    "text": {"type": "string"},
                    "python_construct": {"type": "string"},
                    "domain_connection": {"type": "string"},
                    "parent_id": {"type": "integer"}
                }
            },
            "ProgressRequest": {
                "type": "object",
                "required": ["scenario_id", "quality"],
                "properties": {
                    "scenario_id": {"type": "string"},
                    "quality": {"type": "integer"},
                    "status": {"type": "string"},
                    "score": {"type": "number"}
                }
            },
            "GamificationProfile": {
                "type": "object",
                "properties": {
                    "xp": {"type": "integer"},
                    "level": {"type": "integer"},
                    "levelName": {"type": "string"},
                    "badges": {"type": "array"},
                    "completedCount": {"type": "integer"},
                    "totalScenarios": {"type": "integer"}
                }
            },
            "Leaderboard": {
                "type": "object",
                "properties": {
                    "leaderboard": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "user_id": {"type": "integer"},
                                "username": {"type": "string"},
                                "xp": {"type": "integer"},
                                "level": {"type": "integer"},
                                "completed": {"type": "integer"}
                            }
                        }
                    }
                }
            },
            "EvaluateRequest": {
                "type": "object",
                "required": ["code", "scenario_id"],
                "properties": {
                    "code": {"type": "string"},
                    "scenario_id": {"type": "string"},
                    "reasoning": {"type": "string"}
                }
            },
            "EvaluationResult": {
                "type": "object",
                "properties": {
                    "scores": {
                        "type": "object",
                        "properties": {
                            "reasoning": {"type": "number"},
                            "code": {"type": "number"},
                            "reflection": {"type": "number"}
                        }
                    },
                    "totalScore": {"type": "number"},
                    "feedback": {"type": "string"},
                    "nextStepSuggestion": {"type": "string"}
                }
            }
        },
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    }


@api_docs_bp.route("/openapi.json")
def get_spec():
    """Return OpenAPI specification as JSON."""
    return jsonify(get_openapi_spec())


@api_docs_bp.route("/docs")
def get_docs_ui():
    """Return simple API documentation HTML page."""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>pyBE API Documentation</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            h2 { color: #555; border-bottom: 2px solid #eee; padding-bottom: 10px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .method { display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; margin-right: 10px; }
            .get { background: #61affe; color: white; }
            .post { background: #49cc90; color: white; }
            .put { background: #fca130; color: white; }
            .delete { background: #f93e3e; color: white; }
            .path { font-family: monospace; font-size: 1.1em; }
            .tag { display: inline-block; background: #e3f2fd; padding: 3px 8px; border-radius: 4px; margin-right: 5px; font-size: 0.9em; }
            .description { color: #666; margin-top: 5px; }
            pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 4px; overflow-x: auto; }
            code { font-family: 'Consolas', monospace; }
        </style>
    </head>
    <body>
        <h1>pyBE API Documentation</h1>
        <p>Version: 0.1.0 | <a href="/api/openapi.json">OpenAPI Spec (JSON)</a></p>

        <h2>Authentication</h2>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/register</span>
            <p class="description">Register a new user account</p>
            <pre><code>{"username": "string", "email": "string", "password": "string"}</code></pre>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/login</span>
            <p class="description">Login and receive JWT token</p>
            <pre><code>{"username": "string", "password": "string"}</code></pre>
        </div>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/refresh</span>
            <p class="description">Refresh JWT token (requires auth header)</p>
        </div>

        <h2>Scenarios</h2>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/scenarios</span>
            <p class="description">List all scenarios (filter: domain, level, type)</p>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/scenarios/{id}</span>
            <p class="description">Get scenario details with case study</p>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/scenarios/{id}/hints</span>
            <p class="description">Get progressive hints (param: reveal=N)</p>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/scenarios/{id}/solutions</span>
            <p class="description">Get reference solutions</p>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/scenarios/{id}/report</span>
            <p class="description">Get full report data for PDF generation</p>
        </div>

        <h2>Progress & Gamification</h2>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/progress</span>
            <p class="description">Save progress with SM-2 spaced repetition</p>
            <pre><code>{"scenario_id": "string", "quality": 0-5, "status": "string", "score": 0-100}</code></pre>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/gamification/profile</span>
            <p class="description">Get user XP, level, badges</p>
        </div>
        <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/gamification/leaderboard</span>
            <p class="description">Get top users by XP (param: limit=N)</p>
        </div>

        <h2>AI Evaluation</h2>
        <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/evaluate</span>
            <p class="description">Evaluate learner code against scenario</p>
            <pre><code>{"code": "string", "scenario_id": "string", "reasoning": "string"}</code></pre>
        </div>

        <h2>WebSocket Events</h2>
        <div class="endpoint">
            <span class="path">evaluate_code</span>
            <p class="description">Streaming code evaluation</p>
        </div>
        <div class="endpoint">
            <span class="path">request_hint</span>
            <p class="description">Request contextual hint</p>
        </div>

        <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #888;">
            <p>pyBE - Philosophical Python Learning Platform</p>
        </footer>
    </body>
    </html>
    """
    return html


@api_docs_bp.route("/scenarios/schema")
def get_schema_summary():
    """Return scenario validation schema."""
    from src.services.scenario_validator import get_schema_summary
    return jsonify(get_schema_summary())