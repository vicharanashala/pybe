# pyBe — Inheritance: The Bird Family 🐦

A MERN-stack lesson feature for **[pyBe](https://github.com/vicharanashala/pybe)** that teaches Object-Oriented Programming **inheritance** through a story about a Bird parent and its five very different chicks — instead of a dry syntax definition.

> Repository: **[patan-jamsheer/pybe-inheritance](https://github.com/patan-jamsheer/pybe-inheritance)**

---

## 📚 About the Project

Most learners meet inheritance as `class Child(Parent):` with a toy example, memorize it, and move on — without ever building an intuition for _why_ it exists or _when_ to reach for it.

**pyBe — Inheritance** replaces that with a single connected story: every bird in the forest is born a **Bird** first, and knows how to eat, sleep, and lay eggs. As each chick grows up, it relates to those inherited habits differently — some keep everything as-is, some replace a habit entirely, and some build on top of it. Each chick becomes its own interactive level, with a code simulator and comprehension checks at every step, so the learner is asked to predict, try, or answer before moving on rather than just reading.

The lesson is the second half of a two-part pyBe experience:

1. **Classes ("Sign the Squad")** — a prerequisite module that introduces `class`, `__init__`, and `self` through the story of a team manager who moves from handwriting a fresh player contract every time to designing one reusable signing form.
2. **Inheritance ("The Bird Family")** — this feature, which builds directly on that foundation to teach how a class can inherit, override, and extend another class's behavior.

The repository contains a **client** (the lesson UI) and a **server** (learner progress tracking).

---

## ✨ Key Features

### 🐦 Story-Based Learning

Inheritance concepts are introduced through the Bird Family narrative — a parent Bird and five chicks — before any code is shown, so the learner has a mental model to map syntax onto.

### 🃏 Story Cards

The story is presented as individual, swipeable **Story Cards** (one per bird) rather than a single wall of text, making it easier to follow and revisit.

### 🧠 Interactive Concept Reveal

After the story, the inheritance concept is explained through an interactive tree diagram, flip cards contrasting each bird's traits, a "trait splicer" activity, and a hybrid-bird challenge — not just static text.

### 🎯 Five Interactive Levels

Each bird maps to one runnable, hands-on level with a live code simulator:

| Level       | Bird       | Concept                | What changes                                                                          |
| ----------- | ---------- | ---------------------- | ------------------------------------------------------------------------------------- |
| 1 · Basic   | 🦅 Eagle   | Plain inheritance      | `class Eagle(Bird): pass` — everything is inherited, nothing changes                  |
| 2 · Medium  | 🐧 Penguin | Overriding             | `fly()` is completely replaced with new behavior                                      |
| 3 · Basic+  | 🦆 Duck    | Extending              | A brand-new method, `swim()`, is added                                                |
| 4 · Basic+  | 🐦 Sparrow | Extending              | A brand-new method, `build_nest()`, is added                                          |
| 5 · Medium+ | 🦉 Owl     | Overriding + `super()` | `sleep()` calls the parent's version via `super()`, then adds its own behavior on top |

_(This is also the exact order the birds appear in, in both the Story Cards and the level path.)_

### 🗺️ Challenge Path (Level Map)

Between levels, learners land on a hub showing which levels are completed and which is unlocked next, instead of being pushed straight from one level into the other.

### 📊 Progress, Points & Streaks

Learner progress is tracked throughout the lesson via:

- Points earned per level (XP)
- A streak counter
- Story / concept / practice / quiz completion, each shown as a percentage
- A count of completed levels

### 🏆 Achievement Badges

Four badges — **Story Explorer**, **Knowledge Builder**, **Code Apprentice**, and **Quiz Master** — unlock as the learner finishes the story, concept, build, and quiz stages respectively, and are celebrated with a popup and shown on the Recap screen.

### 🔄 Continue-Learning Prompt

After completing a level, the learner is explicitly asked whether they want to continue to the next challenge rather than being auto-advanced.

### 💾 Learner Progress Persistence

The backend exposes REST APIs for storing and resuming a learner's progress through both the Classes and the Inheritance lessons, including quiz answers, which levels are completed, and overall lesson completion — so a refresh or return visit doesn't lose progress.

### 🎨 Hand-Drawn Illustrations & Lottie Animations

All bird illustrations are hand-drawn inline SVG, with Lottie-based animations layered in for the interactive/concept screens — no external image assets needed.

---

## 🎓 Learning Flow

```text
Classes: "Sign the Squad" (prerequisite)
      ↓
Story  →  Reflect  →  Think It Through (MCQs)
      ↓
Concept Reveal (tree diagram, flip cards, trait splicer, hybrid challenge)
      ↓
Build It Quiz (map story → code)
      ↓
Code Builder (build the Bird class from scratch)
      ↓
Level 1: Eagle (basic inheritance)
      ↓
Level 2: Penguin (overriding)
      ↓
Level 3: Duck (extending)
      ↓
Level 4: Sparrow (extending)
      ↓
Level 5: Owl (overriding + super())
      ↓
Recap + Badges
```

Each level sits behind its own Challenge Path stop (level map → intro → simulator → completion) before the next one unlocks.

---

## 🛠️ Tech Stack

**Frontend (`client/`)**

- React 18
- Vite 5
- `@lottiefiles/dotlottie-react` / `@dotlottie/react-player` for animations
- Hand-drawn inline SVG illustrations

**Backend (`server/`)**

- Node.js
- Express 4
- MongoDB with Mongoose 8
- `cors`, `dotenv`
- `nodemon` for local development

---

## 📁 Project Structure

```text
pybe-inheritance/
├── client/                     React + Vite frontend
│   ├── src/
│   │   ├── classes/            "Sign the Squad" prerequisite Classes lesson
│   │   ├── components/         Story cards, concept reveal, quizzes, level UI, etc.
│   │   ├── hooks/               Points & streak logic
│   │   ├── App.jsx              Switches between the Classes and Inheritance lessons
│   │   ├── InheritanceLesson.jsx  Drives the full Bird Family lesson flow
│   │   ├── levels.js            The 5 level definitions (Eagle → Penguin → Duck → Sparrow → Owl)
│   │   └── api.js               Talks to the backend progress APIs
│   └── vite.config.js
│
├── server/                     Express + MongoDB backend
│   ├── models/                 Progress.js, ClassesProgress.js
│   ├── routes/                 progress.js, classesProgress.js
│   ├── server.js
│   └── .env.example
│
├── docs/                       Product notes and design principles
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/patan-jamsheer/pybe-inheritance.git
cd pybe-inheritance
```

### 2. Start the backend

```bash
cd server
cp .env.example .env      # set MONGO_URI to your MongoDB instance
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Start the frontend

In a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

Vite proxies all `/api` requests to `http://localhost:5000`, so no extra CORS configuration is needed in development.

---

## 🔌 API

| Method | Endpoint                           | Purpose                                                          |
| ------ | ---------------------------------- | ---------------------------------------------------------------- |
| GET    | `/api/health`                      | Health check                                                     |
| GET    | `/api/progress/:learnerId`         | Fetch (or lazily create) a learner's Inheritance-lesson progress |
| PATCH  | `/api/progress/:learnerId`         | Merge in updated Inheritance-lesson progress fields              |
| GET    | `/api/classes-progress/:learnerId` | Fetch (or lazily create) a learner's Classes-lesson progress     |
| PATCH  | `/api/classes-progress/:learnerId` | Merge in updated Classes-lesson progress fields                  |

Progress tracked includes story completion, quiz answers, which simulator levels are done, and overall lesson completion. `learnerId` is currently a random ID stored in `localStorage`, meant to be swapped for a real auth ID once pyBe has login.

---

## 👥 Team Contributions

This feature was built collaboratively, with each member owning a distinct part of the learning experience.

### 1. Arni Johry — Introduction to OOP / Classes

- Designed the "Sign the Squad" learning experience that introduces Python classes as a prerequisite before Inheritance
- Introduced the concept of a class as a reusable blueprint (the "signing form" metaphor)
- Built the progression from repeating manual variables to a class-based solution
- Developed the interactive explanations for **class**, **`__init__`**, and **self**

### 2. Patan Jamsheer — Overall Layout

- Built the overall project layout and structure that the different learning sections plug into
- Maintains the [repository](https://github.com/patan-jamsheer/pybe-inheritance)

### 3. Simran — Progress, Streak, Levels & Story Cards

- Implemented learner progress tracking to show the user's learning progress throughout the lesson.
- Added streak tracking to encourage consistent learning.
- Added level count and progress indicators to show the learner's advancement through the challenges.
- Converted the original single-story experience into interactive Story Cards, following the actual bird sequence: Eagle → Penguin → Duck → Sparrow → Owl.

### 4. Gunjan Pandey — Interactive Concepts & Animations

- Made the concept-learning section interactive rather than static text
- Added the animations that bring the concept explanations and bird illustrations to life
- Created a step-by-step concept flow to explain inheritance in an engaging way

### 5. Sumit Dhakar — Interactive Levels & Challenges

- Made the level progression interactive
- Added a challenge name to each level
- Built the flow that asks the learner whether they want to continue after completing a level
- Added and displayed the points earned for each level, and the points progression as levels are completed

---

## 🔮 Future Improvements

- Real authentication so `learnerId` is a stable, logged-in identity instead of a random local ID
- Additional levels or optional "hard mode" variants for existing concepts
- More animations and illustrations across the concept and recap screens
- Expanded progress analytics for teachers/evaluators
- Extending the same story-driven, level-based approach to other OOP concepts beyond inheritance

---

## 📌 Repository & Links

- **Code:** [github.com/patan-jamsheer/pybe-inheritance](https://github.com/patan-jamsheer/pybe-inheritance)
- **Commit history:** [github.com/patan-jamsheer/pybe-inheritance/commits/main](https://github.com/patan-jamsheer/pybe-inheritance/commits/main/)
- **Parent project:** [pyBe](https://github.com/vicharanashala/pybe)

---

## 📄 License

This project is developed as part of the pyBe interactive learning experience.
