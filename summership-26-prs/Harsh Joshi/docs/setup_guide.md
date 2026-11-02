# Setup Guide (`setup_guide.md`)

This step-by-step guide walks you through installing, configuring, and running the PyBe application and the "Antigravity" feature module locally.

---

## Prerequisites

Ensure your system meets the following requirements before proceeding:
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes bundled with Node.js)
- **Git**: For version control and branch management
- **Operating System**: Windows (PowerShell/CMD), macOS, or Linux

---

## 1. Repository Setup & Branching

If you haven't already cloned the repository and switched to the feature branch, run:

```bash
# Clone your fork of the repository
git clone https://github.com/harshjsh01/pybe.git
cd pybe

# Add upstream remote (vicharanashala/pybe)
git remote add upstream https://github.com/vicharanashala/pybe.git

# Fetch latest upstream changes and sync
git fetch upstream
git checkout main
git merge upstream/main

# Switch to the isolated feature branch for Antigravity
git checkout -b feature/personalized
```

---

## 2. Dependency Installation

PyBe is structured as a monorepo containing a React client (`/client`) and an Express API server (`/server`). Install all dependencies from the root directory:

```bash
# Installs dependencies for root, server, and client concurrently
npm run installAll
```

---

## 3. Environment Configuration

The backend Express server requires an environment configuration file. Copy the example environment file in the `/server` directory:

```powershell
# On Windows PowerShell
Copy-Item server/.env.example server/.env
```
*(On macOS/Linux, use `cp server/.env.example server/.env`)*

### Default Environment Variables (`server/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```
*Note: The default values are pre-configured to work seamlessly for local development.*

---

## 4. Database Seeding & Initialization

PyBe uses an isolated, local JSON file-based database for simplicity and zero-configuration development. Initialize and seed the database with sample scenarios and archetypes:

```bash
npm run seed
```

This command invokes `node server/src/seed.js`, populating `server/src/data/db.json` and initializing `server/src/data/personalized_templates.json`.

---

## 5. Starting Development Servers

Start both the Vite frontend development server and the Nodemon Express backend server simultaneously using the root development command:

```bash
npm run dev
```

### Accessing the Application
Once started, the services will be available at:
- **Frontend Web App (React/Vite)**: [http://localhost:5173](http://localhost:5173)
- **Personalized Journey Route**: [http://localhost:5173/personalized-journey](http://localhost:5173/personalized-journey)
- **Backend API Server**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 6. Verification & Troubleshooting

- **Port Collisions**: If port `5000` or `5173` is already in use, update `PORT` in `server/.env` or specify `--port` in `client/package.json`, ensuring `CLIENT_URL` matches accordingly.
- **No External AI Keys Needed**: All Antigravity features operate 100% locally via deterministic rule-based interpolation. You do not need to configure OpenAI, Anthropic, or Gemini API keys in `.env` to test the full 4-layer onboarding flow!
