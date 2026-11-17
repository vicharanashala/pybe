# PyBe — Mahi's Pull Request Submission

This pull request introduces the **Story Learning Hub** as a standalone learning module for PyBe.

📖 **Product Documentation:** [product.md](./product.md)

---

## 🎯 PR Overview

### Added Feature: 📖 Story Learning Hub

Story Learning Hub provides a dedicated interface where learners can choose and explore interactive Python learning chapters.

The current submission includes:

- 🌼 **Loops — Robo and the Magic Loop**
- 🧳 **Variables — Doraemon's Magical Memory Pockets**

The Loops chapter also supports live Python execution directly in the browser using Pyodide.

---

## ✨ Highlights

- Story-driven Python learning
- Interactive learning scenes
- Visual explanations of concepts
- Hands-on coding activities
- Live Python execution for Loops
- Independent chapter navigation
- Standalone Vite + React application

---

## 🛠️ Tech Stack

- **React 18**
- **Vite**
- **Pyodide**
- **Web Workers**
- **lucide-react**
- **CSS**

---

## 🚀 Quick Start

### 1. Install Dependencies

```
npm install
```

### 2. Start the Application

```
npm run dev
```

The application will run on the Vite development URL shown in the terminal, typically:

```
http://localhost:5173
```

### 3. Create Production Build

```
npm run build
```

### 4. Preview Production Build

```
npm run preview
```

---

## 🐍 Python Execution

The **Loops** chapter uses **Pyodide** to execute Python directly in the browser.

Python execution runs inside a **Web Worker**, keeping the main learning interface responsive.

---

## 📖 Documentation

For detailed information about the product, implementation, architecture, key changes, contribution, and future expansion:

**See [`product.md`](./product.md)**