# PyBe Developer & Reviewer Quickstart Guide

This guide provides step-by-step instructions to set up, run, test, and audit the **PyBe (CKLIS Intelligence Engine)** application locally.

---

## 📋 Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **API Keys**: Groq API Key (or optional Gemini API Key) in `.env`

---

## ⚡ 1. Local Installation & Launch

```bash
# 1. Clone or navigate to repository root
cd "Short Story Creation"

# 2. Change directory to MVP app
cd MVP

# 3. Install npm dependencies
npm install

# 4. Configure Environment Variables
# Create or edit MVP/.env file:
```

### Environment Configuration (`MVP/.env`)

```env
# Primary LLM Provider API Keys
GROQ_API_KEY=gsk_your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Secondary Multi-Keys (for Multi-Key Cooldown Rotation)
GROQ_API_KEY_1=gsk_...
GROQ_API_KEY_2=gsk_...
GROQ_API_KEY_3=gsk_...
```

```bash
# 5. Start Development Server
npm run dev
```

The server will start on `http://localhost:3000` (or `http://localhost:3001`).

---

## 🧪 2. Testing the UI Studio Workflow

1. Open `http://localhost:3000` in your browser.
2. Choose your Intake Mode:
   - **🎯 Learn a CS Concept (Topic-First)**: Enter a topic like *"What is an If-Else Statement"* and select an environment theme like *"Indian Historical Places"*.
   - **📖 Learn from Real Story / Observation**: Enter a real story like *"The Thirsty Crow Fable"* or *"Vikram and Betaal"*.
3. Click one of the **Quick Start Examples** or configure Advanced Settings (*Representation, Target Language*).
4. Click **Generate CKLIS Educational Experience**.
5. Observe the 4-Pass pipeline progress.
6. Once completed, test tab navigation:
   - **Interactive Viewer**: Carousel through visual panels. Verify dialogue, narration, and the final scene's executable Python code card.
   - **📜 Full Script**: Full markdown script output.
   - **🏛️ Full Blueprint**: Character bible, environment specifications, and story arc summary.
   - **PyBe Internal Educational Reasoning Drawer**: Inspect 7-step internal reasoning and Quality Engine audit scores.

---

## 🛠️ 3. API Verification & Testing

### Test Pipeline API Endpoint (`POST /api/cklis/generate`)

```bash
curl -X POST http://localhost:3000/api/cklis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "What is an If-Else Statement",
    "representation": "Short Comic (1-Page)",
    "programmingLanguage": "Python",
    "experienceHints": "Indian Historical Places"
  }'
```

### Test SSE Progress Streaming Endpoint (`GET /api/cklis/stream`)

```bash
curl -N "http://localhost:3000/api/cklis/stream?topic=Recursion&representation=Video%20Script"
```

---

## 🔍 4. System Verification Commands

Run these commands inside `MVP/` before pushing code or submitting a PR:

```bash
cd MVP

# Run TypeScript compilation check
npx tsc --noEmit

# Run Vite production build check
npm run build
```
