# PyBe MERN App — v2.0 (Production-Grade)

PyBe is a scenario-driven Python learning platform built with an enterprise-grade MERN architecture. It features a layered backend (Controller-Service-Repository), Prisma ORM, Zod validation, modular React frontend with TanStack Query, Zustand state management, Recharts analytics, and an in-browser Python execution sandbox powered by Pyodide.

> **Note:** This repository serves as the core engine for PyBe's interactive learning scenarios. It does not currently implement user authentication/login flows.

📚 **View the project wiki:** [WIKI.md](WIKI.md)

---

## 🎯 Project Philosophy & Methodology

PyBe goes beyond traditional syntax-focused coding platforms. It focuses on:
1. **Scenario-Driven Learning:** Users are given real-world problems (scenarios) rather than abstract puzzles.
2. **Interactive Reasoning:** Before writing code, users must explain their approach. The system analyzes this reasoning using a heuristic (or AI) engine.
3. **Abstraction Mapping:** The engine maps user reasoning to specific Python concepts (e.g., recognizing that "I need to keep track of items" implies a `list` or `dictionary`).
4. **Scaffolding:** Based on the reasoning, PyBe generates boilerplate code to help the user get started.
5. **Reflection:** After solving the problem, users are prompted to reflect on their learning, which is tracked via mastery signals.

---

## 🏗 Architecture Highlights

- **Backend Architecture:** Strict Controller → Service → Repository (CSR) pattern for maximum decoupling and testability.
- **ORM & Database:** Prisma ORM connected to SQLite out-of-the-box for easy local setup (easily swappable to PostgreSQL via `DATABASE_URL`).
- **Validation:** Zod schema enforcement on all incoming API requests to guarantee type safety and payload integrity at the boundaries.
- **State Management:** Zustand for lightweight, un-opinionated global client state (e.g., dark mode, active scenario session).
- **Data Fetching:** TanStack Query (React Query) wrapped around Axios for caching, background refetching, and stale-while-revalidate logic.
- **Analytics Visualization:** Recharts for rendering dynamic, responsive SVGs showing learning progress over time.
- **Code Highlighting:** `react-syntax-highlighter` providing a rich IDE-like reading experience with a dark theme.
- **Client-Side Code Execution:** **Pyodide (WebAssembly)** runs Python directly in the browser. No server-side code execution risks or latency!
- **AI Integration:** Toggleable modes via `.env`:
  - `MEMENTO_MODE=LOCAL_HEURISTIC`: Uses a robust local regex/keyword-matching engine (Default, offline-friendly).
  - `MEMENTO_MODE=GEMINI_LIVE`: Designed for future integration with the Google Gemini API for advanced natural language processing.
- **DX Tooling:** Pre-configured with ESLint, Prettier, Husky pre-commit hooks, and `lint-staged` to enforce code quality before every commit.

---

## ✨ Core Features

*   **🦴 Interactive Skeleton Code Scanner:** A 3-column pedagogical story scanner mapping real-world case studies (The Royal Bakery, Thirsty Crow, Data L7 Teach-Back) to Python code logic for Class 9/10 students.
*   **🤖 Dual-Engine AI System (Gemini & MiniMax):** Integrated Google Gemini 3.6 Flash & MiniMax APIs with automatic fallbacks for non-stop learning availability.
*   **🎓 Saksham Interactive Case Study Player:** Guided 3-stage interactive learning engine featuring logic tests, concept reveals, and Pyodide WebAssembly Python execution.
*   **🌳 Concept Graph & Tree Visualizers:** Interactive modals visualizing multi-page learning structures and concept hierarchies.
*   **Scenario Browser:** Filter and search through scenarios by difficulty and core programming concepts.
*   **Interactive Learning Session:** A multi-step wizard guiding the user through reasoning, code generation, execution, and reflection.
*   **In-Browser Sandbox:** Write and execute Python code safely and instantly using WebAssembly.
*   **Dynamic Analytics Dashboard:** Visual charts tracking problem-solving speed, abstraction accuracy, and prompt scoring over time.
*   **Roadmap View:** A visual timeline showing the planned evolution of the platform.
*   **Misconception Detection:** The heuristic engine detects common beginner mistakes and offers immediate corrections.
*   **Mastery Tracking:** Derives "mastery signals" based on the depth of the user's reasoning and reflection.

---

## 💻 Tech Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19, Vite 6 | UI Library and fast build tool |
| **State & Data** | Zustand, TanStack Query | Client state & server state caching |
| **Data Viz** | Recharts | Analytics and progress charts |
| **Backend** | Node.js, Express 4 | Server runtime and API framework |
| **Database/ORM** | SQLite, Prisma | Data persistence and type-safe querying |
| **Validation** | Zod | Runtime type checking for API inputs |
| **Python Engine** | Pyodide (WASM) | Client-side Python execution |
| **Code Quality** | ESLint, Prettier, Husky | Linting, formatting, and commit hooks |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/en/) (Version 18 or higher)
- Git

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vicharanashala/pybe.git
   cd pybe
   ```

2. **Install all dependencies:**
   This command installs dependencies for both the root folder, the client, and the server simultaneously.
   ```bash
   npm run installAll
   ```

3. **Initialize the Database:**
   This generates the Prisma client and pushes the schema to your local SQLite database.
   ```bash
   npm run prisma:setup
   ```

4. **Seed the Database:**
   Populate the database with sample scenarios (8 scenarios across various difficulties) and roadmap phases.
   ```bash
   npm run seed
   ```

5. **Start the Development Servers:**
   This uses `concurrently` to run both the Express backend and the Vite frontend at the same time.
   ```bash
   npm run dev
   ```

Once running, you can access the application at:
- **Client App:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## ⚙️ Environment Variables

The server requires an `.env` file in the `/server` directory. A default fallback is provided in the code, but you can create `server/.env` to customize:

| Variable | Default Fallback | Description |
|---|---|---|
| `PORT` | `5000` | The port the Express server listens on. |
| `CLIENT_ORIGIN` | `http://localhost:5173` | The allowed CORS origin (your frontend URL). |
| `DATABASE_URL` | `file:./dev.db` | The connection string for Prisma. |
| `MEMENTO_MODE` | `LOCAL_HEURISTIC` | Determines the AI engine. Use `LOCAL_HEURISTIC` or `GEMINI_LIVE`. |
| `GEMINI_API_KEY` | *None* | Required only if `MEMENTO_MODE` is set to `GEMINI_LIVE`. |

---

## 📂 Project Structure

```text
pybe-mern-app/
├── package.json              # Root package: scripts for concurrently, husky, lint-staged
├── README.md
├── WIKI.md
│
├── client/                   # ⚛️ React + Vite frontend
│   ├── package.json
│   ├── vite.config.js        # Configured to proxy /api requests to backend
│   ├── index.html
│   └── src/
│       ├── main.jsx          # QueryClientProvider & strict mode wrapper
│       ├── App.jsx           # Main orchestrator component
│       ├── styles.css        # Global CSS design system
│       ├── lib/api.js        # Axios instance configured with base URL
│       ├── store/            # Zustand global state (useAppStore.js)
│       ├── hooks/            # Custom React Query hooks (useScenarios, useSessions, etc.)
│       └── components/       # Reusable UI components (Sidebar, PythonSandbox, AnalyticsPanel, etc.)
│
└── server/                   # 🟢 Express backend (CSR pattern)
    ├── .env                  # Environment variables
    ├── package.json
    ├── prisma/
    │   └── schema.prisma     # Database models and relations
    └── src/
        ├── index.js          # Entry point & Express app configuration
        ├── prisma.js         # Singleton Prisma client instance
        ├── routes/           # API Route definitions
        ├── controllers/      # Request handling & HTTP response logic
        ├── services/         # Core business logic (Learning heuristics, Analytics aggregation)
        ├── repositories/     # Direct database interaction layers
        ├── middleware/       # Express middlewares (errorHandler, Zod validation)
        └── scripts/          # Utility scripts (seed.js)
```

---

## 🔌 Switching to PostgreSQL (Optional)

If you wish to move away from the default SQLite database to a more robust PostgreSQL instance for production or advanced development:

1. Open `server/.env` and update the `DATABASE_URL` to your Postgres connection string:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/pybe_db?schema=public"
   ```
2. Open `server/prisma/schema.prisma` and change the provider block:
   ```prisma
   datasource db {
     provider = "postgresql" // Changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Regenerate the client and push the schema:
   ```bash
   npm run prisma:setup
   ```

---

## 🤝 Contributing

We welcome contributions! If you are a student or developer looking to add features or fix bugs:

1. **Fork** the repository.
2. **Clone** your fork locally.
3. Create a **new branch** (`git checkout -b feature/amazing-feature`).
4. Make your changes and test them thoroughly.
5. **Commit** your changes (`git commit -m 'feat: add amazing feature'`).
6. **Push** to the branch (`git push origin feature/amazing-feature`).
7. Open a **Pull Request** targeting the `main` branch of this repository. Tag the maintainers for review!

Please ensure your code passes the linter and formatter checks (Husky will automatically run `lint-staged` on your commits).

---

## 📄 License

This project is licensed under the **MIT License**.
