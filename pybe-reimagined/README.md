---
sdk: react
app_port: 5173
emoji: 🐍
colorFrom: green
colorTo: blue
pinned: true
license: mit
short_description: A problem-first Python teaching tool powered by case studies and philosophical metaphors.
---

# Pybe

> **A teaching tool that helps people understand the paradigms of a programming language — through case studies, philosophical metaphors, and free exploration.**

Pybe is an open-source web app that teaches Python the way Prakash sir (IIT Roorkee, Engineering Education Research) envisioned: problems first, syntax last; rhizomatic navigation; the learner picks their own metaphor world.

## ✨ Features

- **Problem-Based Learning:** Every construct is introduced through a vivid, real-world case scenario.
- **Rhizomatic Exploration:** Learners build their own trajectory without a fixed curriculum.
- **Philosophical Storytelling:** Users can explore topics through the lens of metaphors (e.g., Avengers, Harry Potter, Panchatantra).
- **In-Browser Code Editor:** Write and test code using Pyodide right within the app.
- **Socratic Reveal:** Hints guide the learner, but the actual syntax is only revealed when they decide.
- **Accessible Learning:** Includes audio transcription, auto-complete, and a UI tailored to Piaget's cognitive development stages.

---

## 🚀 Try it

### Locally

```bash
git clone <this-repo> pybe
cd pybe/pybe-app
npm install
npm run validate-content   # checks all case studies
npm test                   # runs 168 tests
npm run dev                # starts Vite at http://localhost:5173
```

## 🏗 How it works

```
[Metaphor Selector] ──► [Rhizome Graph] ──► [Select Node]
                                                  │
                                                  ▼
                                       [Case Study Scenario]
                                                  │
                                                  ▼
                             [Socratic Nudges & Learner Reasoning]
                                                  │
                                                  ▼
                                       [Reveal Syntax/Code]
                                                  │
                                                  ▼
                                      [Try-it Code Editor (Pyodide)]
```

The full architecture, invariants, and design rationale live in [`project_blueprint.md`](./project_blueprint.md).

---

## ⚙️ Configuration & Scripts

Pybe uses an LLM to generate case studies. You can use the mock generator or configure a real one via environment variables:

- `PYBE_LLM_KEY` — your API key (OpenAI, Anthropic, or Ollama bearer)
- `PYBE_LLM_ENDPOINT` — chat-completions URL
- `PYBE_LLM_MODEL` — model id

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server at http://localhost:5173 |
| `npm run build` | `tsc --noEmit && vite build` → `dist/` |
| `npm run generate-cases` | Produces new case-study drafts (`cs_NNN.json`) from hook-words |
| `npm test` | Runs the full test suite (168 tests) |

---

## 📚 Documentation

- [`project_blueprint.md`](./project_blueprint.md) — single source of truth for vision, curriculum, and architecture
- [`context.md`](./context.md) — living state tracker and AI handoff notes
- [`future_scope.md`](./future_scope.md) — stretch goals and future roadmap (Horcruxes, Sorting Hat, Firmware)

## 📄 License

MIT. Free to use, modify, and deploy. Every feature ships with attribution.
