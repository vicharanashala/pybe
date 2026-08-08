# PyBe — Ansh's Pull Request Submission

This pull request introduces the **Sorting & Searching Basics** topic into the **PyBe Case Study Learning Engine**.

📚 View the project wiki: [WIKI.md](WIKI.md) | Product Spec: [product.md](product.md)

---

## 🎯 PR Overview (Ansh's Contribution)

### Added Topic: 🔍 Sorting & Searching Basics
This PR contains the standalone **Sorting & Searching Basics** topic, following the 3-stage engine (**Logic Test → Concept Reveal → Guided Code Build**) across **5 Levels** and **8 Case Studies** mapped to the SOLO taxonomy:

1. **Level 1 — Prestructural**: *The Missing Shelf* (Trophy Shelf) — Linear Search intuition on unsorted data.
2. **Level 2 — Unistructural**:
   - 2A: *Lost ID Card* (Linear search with early return pattern)
   - 2B: *Leaderboard Sort* (Non-mutating `sorted()` function)
   - 2C: *Countdown Reverse* (Descending order via `reverse=True`)
3. **Level 3 — Multistructural**:
   - 3A: *Phonebook Split* (Binary search $O(\log N)$ on sorted list)
   - 3B: *Custom Sort by Priority* (Custom key sorting via `key=lambda`)
4. **Level 4 — Relational**: *Library Catalog Rush* (Combining `sorted()` + `binary_search`)
5. **Level 5 — Extended Abstract**: *System Trade-Off Design* (Architectural teach-back comparing read vs write costs)

---

## 🛠️ Tech Stack & Architecture

- **Backend**: Express.js + Node.js (Running on Port `5002`)
- **Frontend**: React + Vite (Running on Port `5174`)
- **Storage**: JSON File-backed API (`content.json` & `db.json`)
- **Styling**: Vanilla CSS with dark mode glassmorphism

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm run installAll
```

### 2. Configure Environment

Server environment (`server/.env`):
```env
PORT=5002
CLIENT_ORIGIN=http://localhost:5174
```

Client environment (`client/.env`):
```env
VITE_API_URL=http://localhost:5002/api
```

### 3. Run Development Servers

```bash
npm run dev
```

- **Frontend App**: [http://localhost:5174](http://localhost:5174)
- **Case Study Learning Interface**: [http://localhost:5174/learn](http://localhost:5174/learn)
- **Backend API**: [http://localhost:5002/api](http://localhost:5002/api)
