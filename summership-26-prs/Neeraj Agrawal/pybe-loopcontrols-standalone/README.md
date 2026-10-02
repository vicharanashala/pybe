# PyBe - Interactive Loop Controls & Nested Loops Module

A repository to log research, design, and development for a contribution to **PyBe**, a project by the **Vicharanashala Lab for Education Design, IIT Ropar** designed to teach Python by focusing on computer and programming fundamentals over syntax.

This repository contains an **Interactive Iteration Learning Module**, a full-stack React and Express application that guides learners through Loop Controls and Nested Loops using narrative case studies and interactive code challenges.

---

## 🌟 Key Features

- **Relatable Case Studies:** Teaches `break` and `continue` using a **Bank Cash Counting Machine** analogy, and Nested Loops using a **Cinema Hall Cleaning** analogy.
- **Conditional Progression Gating:** Narrative beats unlock automatically, while interactive beats (MCQs and Code Challenges) require user engagement to unlock progression.
- **Interactive Code Playgrounds:** Fill-in-the-blank code verifiers to test loop syntax understanding.
- **Backend API Integration:** Quiz questions and answer validations are securely managed by a Node.js/Express REST API.
- **Rich Aesthetics:** Modern UI utilizing Glassmorphism, Tailwind CSS styling, and Framer Motion for smooth micro-animations.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Framer Motion, Lucide React
- **Backend:** Node.js, Express, CORS

---

## 🚀 Getting Started (Running Locally)

To run this application locally, you need to start both the backend server and the frontend development server.

### 1. Start the Backend Server
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Start the server (runs on port 3001)
npm start
```

### 2. Start the Frontend Application
Open a new terminal window:
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start the Vite development server (proxies API requests to port 3001)
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 📁 Repository Structure

```text
.
├── client/                       # React frontend application
│   ├── public/                   # Images and static assets
│   └── src/                      # UI components and logic (CaseStudyOne, CaseStudyTwo)
├── server/                       # Node.js/Express backend
│   └── server.js                 # API endpoints for quizzes and validation
├── Product.md                    # Detailed documentation of architecture and team roles
└── README.md                     # You are here!
```
