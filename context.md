# pyBE - Philosophical Python Learning Platform

## Project Overview

**pyBE** (Python Philosophical Backend/Education) is a full-stack web application that reimagines programming education through philosophical, cultural, and interdisciplinary lenses. Instead of dry coding exercises, learners engage with scenarios that blend Python concepts with literature, folklore, science, music, and pop culture.

---

## Project Structure

```
pyBE/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml          # GitHub Actions CI/CD pipeline
│   │   └── pr-checker.yml  # PR quality checker workflow
│   ├── scripts/
│   │   └── check-pr-quality.js  # PR quality validation script
│   ├── ISSUE_TEMPLATE/
│   │   └── bug_report.md   # Bug report template
│   └── PULL_REQUEST_TEMPLATE.md # PR template
├── .gitignore              # Root gitignore
├── Dockerfile.backend      # Backend container definition
├── Dockerfile.frontend     # Frontend container definition
├── docker-compose.yml      # Multi-service orchestration
├── DOCKER_README.md        # Docker setup guide
├── client/                 # Vanilla JS SPA frontend (Vite)
│   ├── public/
│   ├── index.html          # Socket.IO client included
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── header.js
│   │   │   ├── scenario-card.js
│   │   │   ├── pillar-tabs.js
│   │   │   ├── hint-panel.js
│   │   │   ├── code-viewer.js
│   │   │   ├── PythonSandbox.js
│   │   │   ├── DiscussionPanel.js
│   │   │   ├── DomainMapper.js
│   │   │   └── NotificationDropdown.js
│   │   ├── pages/
│   │   │   ├── home.js
│   │   │   ├── scenarios.js
│   │   │   ├── scenario-detail.js
│   │   │   ├── dashboard.js
│   │   │   ├── gamification.js
│   │   │   ├── login.js
│   │   │   ├── register.js
│   │   │   ├── scenario-builder.js  # Multi-step wizard
│   │   │   ├── contributor-leaderboard.js
│   │   │   └── admin-review.js
│   │   ├── lib/
│   │   │   ├── api.js        # JWT refresh interceptor
│   │   │   ├── router.js
│   │   │   └── pdf-report.js
│   │   ├── style.css
│   │   ├── new-features.css
│   │   ├── animations.css
│   │   ├── counter.js
│   │   └── main.js
│   └── package.json
├── server/
│   ├── app.py              # App factory (~350 lines, modularized)
│   ├── requirements.txt
│   ├── pytest.ini          # Pytest configuration
│   ├── scripts/
│   │   └── migrate_to_mongodb.py  # SQLite → MongoDB migration tool
│   └── src/
│       ├── engine.py       # Scenario loading & indexing
│       ├── websocket_events.py  # WebSocket event handlers
│       ├── models.py       # SQLAlchemy models (8 tables)
│       ├── database.py     # MongoDB connection + MongoCollection wrapper
│       ├── mongo_models.py # MongoDB document schemas with to/from converters
│       ├── storage.py      # Unified dual-backend data access layer
│       ├── middleware/
│       │   ├── auth.py         # JWT authentication decorator
│       │   ├── rate_limit.py   # API rate limiting
│       │   └── cache.py        # Response caching layer
│       ├── routes/
│       │   ├── auth.py            # register, login, refresh, setup-admin
│       │   ├── scenarios.py       # Scenario CRUD, hints, solutions, discussions, validate, schema
│       │   ├── users.py           # Stats, domains, progress
│       │   ├── gamification.py    # Profile, leaderboard
│       │   ├── progress.py        # SM-2 progress tracking, due scenarios
│       │   ├── contributors.py    # Contributor profiles & impact
│       │   ├── reviews.py         # Mentor review workflow + notifications
│       │   └── docs.py            # API documentation (OpenAPI)
│       ├── services/
│           ├── ai_evaluator.py
│           ├── prompt_builder.py
│           ├── spaced_repetition.py
│           ├── scenario_service.py
│           ├── scenario_validator.py
│           ├── user_service.py
│           ├── progress_service.py
│           ├── gamification_service.py
│           ├── gamification_enhanced.py  # Streaks, challenges, certificates
│           ├── analytics_service.py      # Learning analytics
│           └── review_service.py
│       ├── translations/          # i18n translation files
│       │   ├── en.json
│       │   ├── es.json
│       │   └── hi.json
│       └── i18n.py                # i18n framework
│       └── scenarios/      # 26 scenario directories (each with solution/solution.py)
└── tests/                  # pytest test suite (152 tests)
    ├── conftest.py
    ├── test_api.py
    ├── test_services.py
    ├── test_middleware.py
    └── test_integration.py
```

---

## Technology Stack

### Frontend
- **Vite 8.x** - Build tool & dev server
- **Vanilla JavaScript** - SPA with hash-based client-side routing
- **Chart.js 4.x** - Line charts for learning velocity
- **D3 7.x** - Force-directed learning graph
- **jsPDF 4.x** - Client-side PDF generation
- **PrismJS** - Code syntax highlighting
- **Socket.IO Client 4.x** - WebSocket for AI evaluation streaming
- **Pyodide** - In-browser Python execution

### Backend
- **Flask 3.x** - Web framework
- **Flask-CORS** - Cross-origin resource sharing (configurable via CORS_ORIGINS)
- **Flask-SQLAlchemy** - ORM (SQLite default, swappable to MongoDB)
- **Flask-SocketIO** - WebSocket support
- **bcrypt** - Password hashing (cost factor 12)
- **PyJWT** - JWT token authentication (7-day expiry)
- **markdown** - Markdown-to-HTML rendering
- **openai >= 1.0** - AI code evaluation (OpenAI-compatible, supports Groq)
- **pymongo >= 4.6** - MongoDB driver
- **mongoengine >= 0.27** - MongoDB schema helpers (optional)

---

## Core Concepts

### The Four Pillars

Every scenario is built on four interconnected dimensions:

1. **Theory (Epistemological)** - The philosophical "why" behind the concept
2. **Anchor (Interdisciplinary)** - Connections to folklore, literature, music, pop culture
3. **Trigger (Narrative)** - Immersive case studies that challenge thinking
4. **Reality (Engineering)** - Real-world production patterns and best practices

### Scenario Structure

Each scenario directory contains:
- `scenario.json` - Core metadata and four-pillar content
- `case-study.md` - Narrative case study (rendered to HTML)
- `hints.json` - Progressive Socratic hints with level and text
- `reflection-prompts.json` - Post-exercise reflection questions
- `scoring-rubric.json` - Evaluation rubric with weights (reasoning 40%, code 30%, reflection 30%)
- `expected-constructs.json` - Optional Python constructs to assess
- `solution/solution.py` - Reference solution with domain-connected comments

### SM-2 Spaced Repetition

The platform uses the SuperMemo-2 (SM-2) algorithm for spaced repetition learning:
- Tracks repetition count, easiness factor (min 1.3), and interval
- Calculates next review date based on quality rating (0-5)
- When quality >= 3, interval increases; otherwise resets to 1

---

## API Endpoints

### Health & Info
- `GET /api/health` - Server health check with version, storage mode, MongoDB status
- `GET /` - API root info

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login by username/email (returns 7-day JWT token)
- `POST /api/auth/refresh` - Refresh token (extends by 7 more days)
- `POST /api/auth/setup-admin` - Create admin user (requires admin setup secret)

### Scenarios
- `GET /api/scenarios` - List scenarios (filterable by domain, level, type)
- `GET /api/scenarios/<id>` - Full scenario detail with rendered case-study
- `GET /api/scenarios/<id>/hints?reveal=N` - Progressive hints
- `GET /api/scenarios/<id>/solutions` - Reference solution files
- `GET /api/scenarios/<id>/reflection` - Reflection prompts
- `GET /api/scenarios/<id>/rubric` - Scoring rubric
- `GET /api/scenarios/<id>/report` - All data for PDF generation (includes user progress if authenticated)
- `GET /api/scenarios/<id>/discussions` - Discussion threads with nested replies
- `POST /api/scenarios/<id>/discussions` - Post comment (supports python_construct, domain_connection, parent_id)
- `POST /api/scenarios/<id>/discussions/<comment_id>/upvote` - Upvote
- `POST /api/scenarios/<id>/discussions/<comment_id>/accept` - Mark as exemplary
- `POST /api/scenarios` - Create new scenario (admin, multi-field)
- `POST /api/scenarios/validate` - Validate scenario data against schema
- `GET /api/scenarios/schema` - Get expected schema structure
- `POST /api/reload` - Hot-reload scenarios from disk

### User & Progress
- `POST /api/progress` - Save progress with SM-2 (auth required)
- `GET /api/progress/due` - Get scenarios due for review today (auth, returns due_scenarios array)
- `GET /api/progress/<user_id>` - Get user's progress records (auth + ownership)
- `GET /api/progress/due/<user_id>` - Get scenarios due for review (auth + ownership)
- `GET /api/users/stats` - Concept mastery data (auth required)
- `GET /api/users/domains` - Personalized domain graph (auth required)
- `GET /api/users/<user_id>/progress` - User's progress with scenario details (auth + ownership)

### Gamification
- `GET /api/gamification/profile` - XP, level, badges, progress stats (auth required)
- `GET /api/gamification/leaderboard?limit=N` - Top N users by XP

### Contributors
- `GET /api/contributors` - Leaderboard of scenario creators with impact metrics
- `GET /api/contributors/<username>` - Individual contributor profile
- `POST /api/contributors` - Create/update contributor (auth required)

### Reviews (Mentor Workflow)
- `GET /api/reviews/pending` - Get pending reviews (admin only)
- `GET /api/reviews` - Get all reviews with optional status filter (admin only)
- `GET /api/reviews/<review_id>` - Get single review (admin only)
- `POST /api/reviews/<review_id>/approve` - Approve scenario (admin only)
- `POST /api/reviews/<review_id>/request-changes` - Request changes (admin only)
- `POST /api/reviews/<review_id>/reject` - Reject scenario (admin only)
- `POST /api/reviews/submit` - Submit scenario for review (auth required)

### Notifications
- `GET /api/notifications` - Get user notifications (auth required, supports unreadOnly param)
- `POST /api/notifications/<notification_id>/read` - Mark notification as read (auth required)
- `POST /api/notifications/read-all` - Mark all notifications as read (auth required)

### AI Evaluation
- `POST /api/evaluate` - REST evaluation (code + scenario_id + optional reasoning)
- WebSocket `evaluate_code` - Streaming evaluation with status/chunks/complete
- WebSocket `request_hint` - Socratic hint request

---

## Database Models

### User
```python
id, username, email, password_hash, is_admin, created_at
```

### Progress
```python
id, user_id, scenario_id, status, score,
repetition, interval, easiness_factor, next_review_date, updated_at
```

### DiscussionComment
```python
id, scenario_id, author_id, author_name, content,
python_construct, domain_connection, upvotes, is_accepted,
parent_id, created_at
# Relationships: replies, parent
```

### DiscussionUpvote
```python
id, comment_id, user_id, created_at
```

### LearningPath
```python
id, user_id, scenario_id, domain, python_concept,
score, completed_at
# Relationships: user
```

### Contributor
```python
id, username, github, avatar_url, bio, total_impact, created_at
```

### ReviewRequest
```python
id, scenario_id, submitter_id, submitter_name, status,
reviewer_id, reviewer_name, anti_superficiality_score,
mentor_comments, change_requests, created_at, reviewed_at, scenario_data
# Relationships: submitter, reviewer
```

### Notification
```python
id, user_id, notification_type, title, message,
link, is_read, created_at
# Relationships: user
```

---

## Authentication

- JWT-based authentication (tokens expire in 7 days, JWT_SECRET required in production)
- Automatic token refresh: client detects expiry within 1 hour and proactively refreshes
- Passwords hashed with bcrypt (cost factor 12)
- Login by username or email
- `@authenticate` decorator protects user-specific endpoints
- `@admin_required` decorator checks is_admin flag (after @authenticate)
- `@require_userOwnership(param)` decorator ensures users access only their own resources
- 401 response clears client token and redirects to login
- `CORS_ORIGINS` env var for production frontend domain

---

## Key Features

1. **Scenario-Based Learning** - 26 philosophical Python scenarios (all with complete solutions)
2. **Four-Pillar Content Structure** - Theory, Anchor, Trigger, Reality
3. **Progressive Hints** - Learners reveal hints incrementally
4. **In-Browser Python Sandbox** - Execute Python code via Pyodide
5. **AI Code Evaluation** - Groq (Llama) and OpenAI-powered with streaming and mock fallback
6. **Spaced Repetition** - SM-2 algorithm for optimal review scheduling
7. **Gamification** - XP, 5 levels with colors, 20 badges with icons
8. **Discussion Threads** - Threaded comments with Python construct tagging
9. **PDF Reports** - Download scenario summaries with user progress data (client-side)
10. **Multi-Step Scenario Builder** - 5-step wizard with Socratic hint validation
11. **Personalized Domain Mapper** - D3 force-directed graph from LearningPath data
12. **Leaderboard** - Top users by XP
13. **Learning Analytics Dashboard** - Due Today panel with overdue indicators, Learning Velocity chart, personalized stats (XP, Level, Completion, Streak), Leaderboard widget
14. **Contributor Attribution** - Created By badges on scenario cards
15. **Contributor Leaderboard** - Top scenario creators ranked by learner impact
16. **JWT Refresh** - 7-day tokens with automatic client-side refresh
17. **AI Code Review Section** - Standalone AI feedback button on scenario detail page
18. **GitHub Actions CI/CD** - Automated testing, building, and security scanning
19. **Mentor Review Dashboard** - Admin-only scenario approval workflow with approve/request-changes/reject actions and in-app notifications
20. **Dark Mode + Mobile Responsive** - Full light/dark theme toggle with system preference detection, mobile hamburger menu, responsive breakpoints at 768px and 480px
21. **Case Study Template Enforcer** - Comprehensive JSON schema validation for scenario submissions with field-level errors and Socratic hint enforcement
22. **Premium Animation System** - Scroll-driven reveals, 3D card tilt effects, page transitions with blur, confetti celebrations, XP float indicators, spring-eased tab slider
23. **Docker Support** - Full Docker/Docker Compose setup for backend, frontend, MongoDB, and Redis
24. **Comprehensive Test Suite** - 152 pytest tests covering API, services, middleware, and integration
25. **API Rate Limiting** - Per-endpoint rate limits with configurable tiers (auth: 10/min, read: 60/min, write: 30/min)
26. **Response Caching** - In-memory TTL cache for scenarios, profiles, and leaderboard data
27. **Real-time WebSocket Events** - Presence tracking, live discussion updates, notification streaming
28. **Enhanced Gamification** - Daily/weekly challenges, streak bonuses, completion certificates, easter egg badges
29. **Learning Analytics** - Learning velocity, concept mastery radar, time analysis, personalized recommendations
30. **OpenAPI Documentation** - Auto-generated API docs at `/api/docs` with full schema
31. **Enhanced Python Sandbox** - Loading progress bar, execution timeout (10s), shareable code URLs, keyboard shortcuts (Ctrl+Enter)
32. **i18n Framework** - Multi-language support (English, Spanish, Hindi) with locale detection and translation utilities

---

## Running the Project

### Prerequisites
- Python 3.x with `pip`
- Node.js with `npm`

### Backend
```bash
cd server
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

### Testing
```bash
cd server
pytest tests/ -v
```

### Docker (Recommended)
```bash
# Start all services
docker compose up

# Start with MongoDB
docker compose --profile with-mongodb up

# Start with Redis
docker compose --profile with-redis up
```

### MongoDB Storage (Optional)
```bash
# Start with MongoDB
STORAGE_MODE=mongodb MONGODB_URI=mongodb://localhost:27017/pybe python app.py

# Migrate existing SQLite data to MongoDB
python scripts/migrate_to_mongodb.py --mode dry-run  # Preview first
python scripts/migrate_to_mongodb.py --mode full     # Execute migration
```

---

## Configuration

### Environment Variables

**Server:**
- `DATABASE_URL` - SQLAlchemy database URI (default: `sqlite:///pybe.db`)
- `PYBE_SCENARIOS_DIR` - Override scenarios directory path
- `PYBE_PORT` - Server port (default: 5000)
- `JWT_SECRET` - JWT signing secret (required in production)
- `FLASK_ENV` - Set to 'production' to enforce JWT_SECRET
- `CORS_ORIGINS` - Frontend domain for CORS (default: '*')
- `OPENAI_API_KEY` - For real AI evaluation (alternative to Groq)
- `OPENAI_MODEL` - Model to use (default: gpt-4o)
- `OPENAI_API_BASE` - OpenAI API base URL
- `GROQ_API_KEY` - Groq API key for fast AI evaluation (recommended)
- `GROQ_MODEL` - Groq model to use (default: llama-3.3-70b-versatile)
- `GROQ_API_BASE` - Groq API base URL (default: https://api.groq.com/openai/v1)
- `USE_AI_EVALUATION` - Set to 'false' to force mock evaluation mode (default: true when API key is set)
- `STORAGE_MODE` - `'sqlite'` (default) or `'mongodb'` for MongoDB storage
- `MONGODB_URI` - MongoDB connection URI (default: `mongodb://localhost:27017/pybe`)
- `MONGODB_DB` - MongoDB database name (default: `pybe`)

---

## Gamification System

### Level Distribution (26 scenarios)
| Level | Name | Count | Example |
|-------|------|-------|---------|
| 1 | Apprentice | 1 | The Name Ceremony |
| 2 | Craftsperson | 5 | Anicca, The Fellowship's Dependency, The Infinity Stones, The Protein Blueprint, The Social Exchange API |
| 3 | Scholar | 14 | The Buddhist Monk, Combustion Engine, DNA Helix, Newton's Prism, The Sorting Hat, The Traffic Jam, The Color State Machine, The Panchatantra Mirror, The Philosopher's Walk, The Prisoner's Dilemma, The Horcrux Pattern, The Kannada Poet, The Musical Composer, The Nashika Taal Engine |
| 4 | Architect | 5 | The Badminton Survivor, The Banana Leaf Feast, The Buddhist Garbage Collector, The Fellowship's Graph, Piaget's Ladder |
| 5 | Pythonista | 1 | Maslow's Stack |

### Levels (with XP thresholds and colors)
| Level | Name | XP Range | Color |
|-------|------|----------|-------|
| 1 | Apprentice | 0-199 | #78C257 |
| 2 | Craftsperson | 200-499 | #4A90D9 |
| 3 | Scholar | 500-999 | #9B59B6 |
| 4 | Architect | 1000-2999 | #E67E22 |
| 5 | Pythonista | 3000+ | #E74C3C |

### Badges (20 total)

**Domain Badges:**
| ID | Name | Icon | Trigger |
|----|------|------|---------|
| folklore_explorer | Panchatantra Path | 🐘 | Complete a Folklore scenario |
| biologist | Protein Thinker | 🧬 | Complete a Science/Biology scenario |
| musician | Taal Master | 🎵 | Complete a Music scenario |
| philosopher | Anicca Seeker | ☸️ | Complete a Philosophy scenario |
| literature_scholar | Fellowship Member | 📚 | Complete a Literature scenario |

**Progress Badges:**
| ID | Name | Icon | Trigger |
|----|------|------|---------|
| first_blood | First Blood | ✅ | Complete your first scenario |
| ten_scenarios | Scholar | 📚 | Complete 10 scenarios |
| all_scenarios | Philosopher King | 👑 | Complete all 26 scenarios |
| xp_master | XP Master | ⚡ | Earn 1000 XP |
| level_5_conqueror | Level 5 Conqueror | 🏔️ | Reach Level 5 |
| speed_learner | Speed Learner | 🚀 | Complete 3 scenarios in one day |
| domain_crosser | Domain Crosser | 🌉 | Complete scenarios from 4 different domains |

**Concept Badges:**
| ID | Name | Icon | Trigger |
|----|------|------|---------|
| recursion_master | Recursion Master | 🔄 | Complete a recursion scenario |
| graph_navigator | Graph Navigator | 🗺️ | Complete a graph theory scenario |
| memory_sage | Memory Sage | 🧘 | Complete a memory management scenario |

**Special Badges:**
| ID | Name | Icon | Trigger |
|----|------|------|---------|
| hardware_toucher | Hardware Toucher | ⚡ | Complete a Level 5 scenario |
| socratic_thinker | Socratic Thinker | 🧙 | Complete 5 scenarios without using hints |
| deep_thinker | Deep Thinker | 🤔 | Complete a Dilemma-type scenario |
| early_bird | Early Bird | 🐦 | Login first thing in the morning |
| night_owl | Night Owl | 🦉 | Complete a scenario after midnight |

### XP Calculation
XP is earned as: `score * 10` per completed scenario

---

## Scenario Domains

Valid domains for scenario creation (defined in `scenario_validator.py`):
- Biology
- Music
- Folklore / Folklore/Panchatantra
- Literature / Pop Culture/LOTR / Pop Culture/Harry Potter
- Philosophy / Philosophy/Buddhism
- Pop Culture / Pop Culture/Avengers
- Physics
- Psychology
- Linguistics
- Culinary
- Sports
- Science
- General
- Other

### Jonasan Types
- Structured Inquiry
- Design Thinking Problem
- Dilemma

---

## File Sizes (Current)

- `server/app.py` - 294 lines
- `server/src/engine.py` - 278 lines, scenario loading & indexing
- `server/src/storage.py` - 638 lines, dual-backend storage
- `server/src/middleware/cache.py` - 223 lines, response caching
- `server/src/middleware/rate_limit.py` - 110 lines, rate limiting
- `server/src/services/gamification_enhanced.py` - 364 lines, streaks/challenges
- `server/src/services/analytics_service.py` - 382 lines, learning analytics
- `client/src/animations.css` - 757 lines, comprehensive animation system
- `client/src/pages/dashboard.js` - 554 lines
- `client/src/pages/scenario-detail.js` - 631 lines
- `client/src/pages/gamification.js` - 177 lines
- `client/src/pages/scenario-builder.js` - Multi-step wizard
- `client/src/components/PythonSandbox.js` - 351 lines, enhanced sandbox
- `client/src/components/IntroScreen.js` - 195 lines, animated intro
- `server/tests/conftest.py` - 231 lines, test fixtures

---

## Architecture Strengths

- Clean separation: routes → services → models
- Dual-backend storage: SQLite (default) or MongoDB via `STORAGE_MODE` env var all services route through `Storage` class
- `Storage` class (src/storage.py) provides unified data access for both backends with `MongoCollection` wrapper for MongoDB operations
- `MongoCollection` class provides MongoDB-like interface with SQLite fallback
- MongoDB document schemas in `mongo_models.py` with `to_document()`/`from_document()` converters and automatic index creation
- JWT_SECRET enforced in production mode
- CORS configurable via environment variable
- All 26 scenarios loaded with complete metadata
- Discussion threads persist in database
- LearningPath enables personalized domain graph
- Thin routes delegate all business logic to services
- Contributor model tracks scenario creator impact
- Comprehensive client-side and server-side validation for scenarios

---

## File Naming Conventions

- Python files: `snake_case.py`
- JavaScript files: `kebab-case.js`
- Scenario IDs: `kebab-case`
- Components: PascalCase (legacy, despite using Vanilla JS)
- Service files: `snake_case.py`
- Middleware files: `snake_case.py`

---

## Notes

- AI evaluator uses real AI when API key is present (Groq preferred over OpenAI); falls back to mock when no key
- AI streaming uses structured `StreamEvent` events for proper WebSocket handling
- Socratic hints use AI when API key present, fall back to contextual mock otherwise
- Token stored in localStorage, sent as Bearer header
- 401 responses auto-redirect to login page
- Scenario builder hints validated for Socratic pattern (questions, no direct answers)
- LearningPath records created on progress save with quality >= 3
- Domain graph shows "You" at center connected to explored domains
- Leaderboard returns top users sorted by XP
- Contributor impact calculated from unique users completing their scenarios
- Token expiry buffer: 1 hour - client refreshes before token expires
- Client auto-refreshes token if expiring within 1 hour before any API call
- Logout clears both JWT token and user_id from localStorage, redirects to login
- PDF reports include user progress data (score, SM-2 stats) when authenticated
- User_id stored in localStorage after login/registration for API calls
- MongoDB storage mode enabled via `STORAGE_MODE=mongodb` env var all data operations automatically route through `Storage` class which handles both backends
- When MongoDB connects, `create_indexes()` is called automatically to set up all collection indexes
- SQLite-to-MongoDB migration tool (`scripts/migrate_to_mongodb.py`) supports `--mode dry-run` and `--mode full`
- Badge triggers use imperative mood ("Complete a scenario") not past tense ("completed a scenario")

---

## Recent Updates

### Header Redesign - Floating Capsule Style
- Redesigned header with floating glassmorphic capsule design
- Three-capsule layout: logo capsule (left), nav capsule (center), actions capsule (right)
- Each capsule uses `backdrop-filter: blur(16px)` for glassmorphism effect
- Pill-shaped containers with `border-radius: var(--radius-full)`
- Subtle shadows for floating depth effect
- All auth items (notifications, logout) now use `header-icon-btn` class for consistent alignment
- Notification dropdown "View all" link now properly closes dropdown before navigating
- Mobile: Full-width bar with slide-down nav overlay using glassmorphic styling
- Fixed duplicate backtick syntax error in header.js

### Scenario Data Fixes
- Removed 7 test directories (`test-*`, `test-scen`) from scenarios folder
- Created missing `scenario.json` files for 20 scenarios that only had case-study.md
- Now all 26 scenarios have proper `scenario.json` metadata
- Server reload API (`/api/reload`) confirms 26 scenarios loaded

### Level Filter Fix
- Added Level 1 to the scenarios page filter options
- Filter now shows: All, Level 1, Level 2, Level 3, Level 4, Level 5

### Badge Trigger Text Fixed
- All badge triggers changed from past tense ("completed a scenario") to imperative ("Complete a scenario")
- This makes the "Badges to Earn" section clearer - it describes what you NEED to do, not what you've already done

### Profile Page Badge Fixes
- Fixed `b.trigger` → `b.description` for locked badges (API returns `description`)
- Added fallback `'Unknown Badge'` for undefined badge names
- Changed lock icon from `?` to `🔒`
- Fixed `scholar` badge ID → `ten_scenarios` (matching actual badge key)

### Context.md Updated
- All API endpoints documented (including previously undocumented routes)
- Database models show all fields including ReviewRequest's extra fields
- Badge table updated with all 20 badges, correct IDs, icons, and imperative triggers
- Level distribution shows all 14 Level 3 scenarios
- File sizes updated to reflect actual line counts
- Scenario domains include all VALID_DOMAINS from scenario_validator.py

### Animation System Added
- Created `animations.css` (570+ lines) with comprehensive animation system
- Added custom easing curves (`--ease-out-expo`, `--ease-spring`, `--ease-out-back`)
- 30+ keyframe animations (reveal, page transitions, confetti, XP float, etc.)
- Scroll reveal system using IntersectionObserver (`.reveal-up`, `.reveal-scale`, `.reveal-fade`, `.reveal-left`)
- Page transitions with blur + scale effect (150ms out, 300ms in)
- 3D card tilt effect on scenario cards (subtle perspective shift following cursor)
- Spring-eased tab slider for pillar tabs
- Confetti celebration system (`window.showConfetti()`)
- XP float indicator (`window.showXpFloat(element, amount)`)
- Respects `prefers-reduced-motion` preference
- Fixed notification dropdown click handling via document-level event delegation

### Scenarios Page Header Fixed
- Changed from `fade-in-up` to `reveal-up` class for proper scroll reveal animation
- Added `data-delay` attributes for staggered entrance timing

### Docker & DevOps Added
- Created `Dockerfile.backend` and `Dockerfile.frontend` for containerized deployment
- Created `docker-compose.yml` with backend, frontend, MongoDB (optional), and Redis (optional) services
- Added `.dockerignore` for clean builds
- Created `DOCKER_README.md` with quick start guide
- Added health checks for all services

### Comprehensive Test Suite
- Expanded test suite to 152 tests covering all layers
- Added `test_middleware.py` for auth decorator testing
- Added `test_integration.py` for cross-endpoint workflows
- Enhanced `conftest.py` with fixtures for admin user, multiple users with progress
- Fixed engine.py `difficultyLevel` comparison to handle int values
- All tests passing with 0 failures

### Rate Limiting & Caching
- Added `src/middleware/rate_limit.py` with Flask-Limiter integration
- Configurable rate limits: auth (10/min), read (60/min), write (30/min), evaluate (10/min)
- Added `src/middleware/cache.py` with TTLCache for response caching
- Cache keys for scenarios, profiles, leaderboard, stats with configurable TTL
- Cache invalidation on scenario reload
- Graceful degradation if dependencies not installed

### WebSocket Real-time Features
- Created `src/websocket_events.py` for real-time event handling
- Presence tracking (online/offline status)
- Live discussion updates to scenario rooms
- Real-time notification delivery to user-specific rooms
- User typing indicators for discussions
- Scenario viewer presence

### Enhanced Gamification
- Created `src/services/gamification_enhanced.py` with:
  - StreakService: Daily/weekly streaks with bonus XP tiers
  - ChallengeService: Rotating daily challenges, weekly challenges
  - CertificateService: Completion certificates (scenario, domain, level, perfect score, streak)
  - BadgeEasterEggs: Special hidden badges for edge cases
- Streak bonus XP: 3-day (25), 7-day (75), 14-day (150), 30-day (500)
- Daily challenges rotate through templates based on day of year
- Certificate generation with unique IDs

### Learning Analytics
- Created `src/services/analytics_service.py` with:
  - LearningAnalytics: Learning velocity, concept mastery radar, time analysis
  - ProgressInsights: Human-readable insight summaries
- Concept mastery radar for radar charts
- Time-of-day and day-of-week learning pattern analysis
- Difficulty progression analysis
- Personalized recommendations based on user performance

### OpenAPI Documentation
- Created `src/routes/docs.py` with OpenAPI 3.0 specification
- Accessible at `/api/docs` (HTML) and `/api/openapi.json` (JSON spec)
- Full schema for all endpoints, request/response models
- Bearer token authentication documentation
- Swagger UI-style HTML documentation page

### Enhanced Python Sandbox
- Added loading progress bar with stage indicators
- Added 10-second execution timeout
- Added shareable code URLs (base64 encoded in URL)
- Added Ctrl+Enter keyboard shortcut to run code
- Added pre-loading of common packages
- Added formatted error display

### i18n Framework
- Created `src/i18n.py` with locale detection and translation utilities
- Created `src/translations/` directory with EN, ES, HI translations
- Added `/api/i18n/locales`, `/api/i18n/translations/<locale>` endpoints
- Supports English, Spanish, Hindi with easy extension

### Intro Screen Animation
- Created `client/src/components/IntroScreen.js` with animated intro screen
- Dark gradient background with floating purple orbs and perspective grid
- Animated SVG logo with circle-drawing effect and pop-in animation
- Staggered word reveal for "Philosophy × Python × Code" tagline
- Progress bar that fills over 2 seconds
- Smooth scale-up and fade-out transition to home page
- Plays only on first visit (uses sessionStorage)
- Uses inline styles for immediate rendering without waiting for CSS

### Estimated Time Field
- Added `estimatedTime` field to all scenario JSON files
- Time estimates based on difficulty level:
  - Level 1: 5-10 min
  - Level 2: 10-15 min
  - Level 3: 15-20 min
  - Level 4: 25-30 min
  - Level 5: 30-45 min
- Time badge displays on scenario cards and scenario detail pages

### Performance Optimizations
- Added 10-second timeout to all API requests - prevents indefinite hanging
- Token refresh is now non-blocking (doesn't wait before making API calls)
- Notification fetching is fire-and-forget - doesn't block UI
- Lazy-loaded NotificationDropdown component
- Intro duration shortened to 2 seconds
- Streamlined main.js initialization flow
- Removed redundant error handling that could slow down boot