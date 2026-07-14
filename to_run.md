# How to Run PyBe

This document covers everything needed to get the project running locally:
prerequisites, environment setup, seeding, and start commands.

---

## 1. Prerequisites (install before anything else)

| Requirement | Notes |
|---|---|
| Node.js (v18+) | Runs both backend and frontend |
| npm | Comes with Node |
| MongoDB | Local install, or a free MongoDB Atlas cluster (connection string) |
| Python 3 | Required on the machine running the backend — used to execute submitted code in the Practice Questions feature |
| Groq API key | Free key from https://console.groq.com/keys — needed for the AI-powered Discovery Learning explanations |

---

## 2. Clone and install dependencies

```bash
npm run install:all
```
This installs dependencies for both `backend/` and `frontend/`.

---

## 3. Set up environment variables

Copy the example env file:
```bash
cd backend
cp .env.example .env
```

Then fill in `.env`:

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Backend port (default `5000`) |
| `MONGO_URI` | Yes | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Yes | Any long random string, used to sign auth tokens |
| `NODE_ENV` | Yes | `development` or `production` |
| `FRONTEND_URL` | Yes | Frontend URL, used for CORS (`http://localhost:5173` for local dev) |
| `GROQ_API_KEY` | Yes (for AI features) | Needed for the AI-generated Discovery Learning explanations |
| `GROQ_API_URL` | Yes | Default already set to Groq's endpoint |
| `GROQ_MODEL` | Yes | Default already set (`llama-3.3-70b-versatile`) |
| `REASONING_PASS_THRESHOLD` | No | Optional tuning value, default `0.32` |
| `PYTHON_BIN` | Yes | Path/command for Python 3 (default `python3`) |
| `EXEC_TIMEOUT_MS` | No | Max time a practice code run is allowed, default `5000` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | No | Only needed if creating an admin account via `seed:admin` |

**Note:** Do not commit your real `.env` file.

---

## 4. Seed the database

Run these once before first use (and again any time seed data changes):

```bash
npm run seed:concepts     # loads core learning concepts
npm run seed:challenges   # loads themed scenarios/challenges per concept
npm run seed:practice     # loads Practice Questions problems
npm run seed:admin        # creates an admin account (optional, uses ADMIN_* env vars)
```

Or run concepts + challenges together:
```bash
npm run seed:all
```

---

## 5. Run the app

Open two terminals from the project root:

```bash
npm run dev:backend
```
```bash
npm run dev:frontend
```

- Backend runs at `http://localhost:5000`
- Frontend runs at `http://localhost:5173` (proxies `/api` requests to the backend)

Open `http://localhost:5173` in your browser.

---

## 6. Logging in

- Register a new account through the UI to use the app as a regular learner.
- To access the admin dashboard, log in with the account created by `npm run seed:admin` (`ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env`).

---

## 7. Common issues

| Problem | Fix |
|---|---|
| Backend won't start / DB errors | Check `MONGO_URI` is correct and MongoDB is reachable |
| Discovery Learning explanations don't generate | Check `GROQ_API_KEY` is set and valid |
| Practice Questions code won't run | Check Python 3 is installed and `PYTHON_BIN` points to it correctly |
| CORS errors in browser console | Check `FRONTEND_URL` in backend `.env` matches the actual frontend URL |
| Modules page shows nothing | Make sure you've run the seed scripts (step 4) |
