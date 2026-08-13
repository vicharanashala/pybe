# Changelog

All notable changes to PyBe will be documented in this file.

## [2.0.0] - 2024-08-12

### ✨ Added Features

#### CRUD Operations
- Full CRUD endpoints for scenarios (POST, GET, PUT, DELETE)
- Full CRUD endpoints for sessions (POST, GET, PUT, DELETE)
- Proper HTTP status codes for all operations

#### Pagination & Filtering
- Pagination support on all list endpoints
- Query parameters: `page`, `limit`, `difficulty`, `concept`, `q`
- Response includes pagination metadata

#### Learner Tracking
- Automatic learner profile creation
- Track total sessions, average prompt score, concept mastery
- GET /api/analytics/learners - list all learners
- GET /api/analytics/learners/:name - specific learner profile

#### Data Export
- Export sessions as JSON or CSV
- GET /api/analytics/export?format=json|csv
- Automatic file downloads with proper headers

#### Enhanced Learning Engine
- Added 2 new concept rules (8 total)
  - Data storage (variables and data structures)
  - Error handling (try/except/finally)
- Improved misconception detection (5 patterns)
- Concept mastery levels (beginner, intermediate, advanced)
- Better prompt evaluation with 5+ scoring criteria
- Enhanced code generation for complex scenarios

#### Database Improvements
- Automatic database backups before each write
- Backup directory: server/src/data/backups/
- Keeps last 10 backups with timestamps

#### Analytics Enhancements
- Concept mastery tracking
- Top learners ranking
- Learner count in overview
- Detailed misconception analytics
- Improved response schema

#### Error Handling & Validation
- Input validation schemas for all endpoints
- Clear, actionable error messages
- Proper HTTP status codes (400, 404, 500)
- Request logging middleware
- Global error handler with timestamps

#### Server Improvements
- Better request logging
- Improved health check endpoint
- Global error handling middleware
- Support for JSON payload limit (10mb)

### 🐛 Fixed Bugs

- Fixed hardcoded session list limits (was 30/5 limit, now unlimited with pagination)
- Fixed missing input validation on POST/PUT endpoints
- Fixed poor error handling with inconsistent status codes
- Fixed race conditions in JSON file writes (added backups)
- Fixed lack of learner identification (was always "Guest learner")
- Fixed missing DELETE operations for data management
- Fixed inconsistent error messages

### 📈 Performance Improvements

- Pagination reduces response payload
- Efficient concept mastery tracking
- Optimized learner stats calculation
- Faster database operations with backup strategy

### 🔒 Security & Data Integrity

- Input validation prevents malformed records
- Auto-backups prevent data loss
- Timestamps on all operations
- Proper error handling and status codes
- CORS configuration improved

### 📚 Documentation

- Added comprehensive ENHANCEMENTS_PR.md
- Added API endpoint documentation
- Added JSDoc comments to all functions
- Added validation schema documentation

### 💥 Breaking Changes

None - Full backward compatibility maintained

### 🔄 Migration Guide

Existing deployments will continue working without changes. New features are opt-in:
- Pagination is optional (can still use non-paginated endpoints)
- Learner profiles created automatically on first session
- Backups created automatically

### 📋 Files Changed

**Modified Files:**
- server/src/data/store.js - Enhanced with validation, pagination, learner tracking
- server/src/services/learningEngine.js - Better concept mapping, misconception detection
- server/src/routes/scenarios.js - Full CRUD + documentation
- server/src/routes/sessions.js - Full CRUD + better error handling
- server/src/routes/analytics.js - Enhanced with learners, export functionality
- server/src/index.js - Better error handling, logging middleware

**New Files:**
- ENHANCEMENTS_PR.md - Comprehensive PR documentation
- CHANGELOG.md - This file
- server/src/data/backups/ - Auto-backup directory (created on first backup)

---

## [1.0.0] - Initial Release

### Features
- Scenario browser with filters (difficulty, concept, search)
- Interactive learning session with reasoning, abstraction mapping
- Dashboard with progress, prompt maturity, concept mastery
- Roadmap view (V0-V3)
- JSON-file backed API
- Express + React + Vite stack

### Limitations (Fixed in 2.0.0)
- No update/delete operations
- Limited pagination (hardcoded limits)
- No input validation
- No learner tracking
- No data export
- Basic error handling
- No data backups
