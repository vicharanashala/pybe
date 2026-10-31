# 🪔 The Dasara Festival Discovery Lab: A Journey from Challenge to Victory

> **PyBe Interactive Python Learning Module**  
> *Vicharanashala — Lab for Education Design, IIT Ropar*  
> **Author Submission:** `summership-26-prs/Reddy-02`

---

## 🌟 Executive Summary

**The Dasara Festival Discovery Lab** is an interactive, narrative-driven Python learning experience designed to teach **exception handling** (`try`, `except`, `else`, `finally`, `ValueError`, and `KeyError`).

Grounding abstract runtime errors in relatable software scenarios for a cultural festival information system, the lab draws meaningful analogies from traditional Dasara / Vijayadashami narratives:
1. **The Arrogance of Certainty:** Mahishasura's boon left him vulnerable because he assumed no unexpected challenge could ever occur — mirroring programs that crash because they never planned for invalid input.
2. **Nine Nights of Vigilance:** The festival countdown encounters unexpected string inputs (`"nine"` vs `9`), demonstrating why and how `ValueError` interrupts program execution.
3. **The Uncharted Key:** Rama's mission coordination dictionary lacks an unrecorded `"bridge"` key, illustrating `KeyError` and comparing three recovery patterns (`dict.get()`, `try/except KeyError`, and `in` verification).
4. **Vijayadashami (The Victory):** Bringing all handlers together to build a complete registration pipeline utilizing `try`, `except`, `else`, and `finally`.

---

## 🏛️ Regional & Cultural Sensitivity

This module respectfully presents regional Dasara traditions:
- **Eastern & Southern India:** Goddess Durga's 9-night battle with Mahishasura, culminating in Vijayadashami and the Mysuru Jamboo Savari procession.
- **Northern, Western & Central India:** Rama's journey to Lanka, the Ramayana tradition, and Dussehra Ramlila effigy burning.
- **Living Cultural Traditions:** Household doll displays (*Bommai Kolu / Golu*), *Ayudha Puja* (honoring tools and software machines), and *Vidyarambham* (initiation into knowledge).

Neither narrative is presented as exclusive or superior; both are framed as reflections of courage, preparation, and triumph over the unexpected.

---

## 📑 10-Chapter Architecture

| Chapter | Title | Focus / Concept | Interactive Feature |
|---|---|---|---|
| **0** | **Cinematic Opening** | Festival orientation & goals | Glowing Diya, Narration toggle, Mode selector |
| **1** | **Enter the Story** | Vijayadashami traditions | Regional traditions tab viewer & cultural notes |
| **2** | **Mahishasura's Rise** | The Arrogance of Certainty | Scenario prediction challenge with instant feedback |
| **3** | **The Nine-Day Battle** | `ValueError` & Integer Parsing | 3-step animated execution trace table |
| **4** | **Building the Handler** | `try` and `except` syntax | Line-by-line stepper + interactive variant switcher |
| **5** | **Rama's Journey** | `KeyError` & Dictionary lookups | Dictionary challenge + 3 recovery strategies tab |
| **6** | **Day of Victory** | `try / except / else / finally` | Fill-in-the-blanks code challenge + dual-path trace |
| **7** | **Interactive Code Lab** | Exception Sandbox | 3 deterministic Python sandboxes with input chips |
| **8** | **Final Assessment & Reference** | Comprehensive Quiz & Concepts | 5 questions, instant feedback, retry, and Exception Cheat Sheet |

---

## 🔊 Audio & Accessibility Architecture

- **Web Audio API Synthesizer:** Pure synthesized audio for button clicks, victory chimes, fanfare melodies, and error tones (no heavy external MP3/WAV assets required).
- **Web Speech API Narration:** Built-in SpeechSynthesis reading chapter voiceovers in natural cadence.
- **Live Captions (CC):** Real-time accessible transcript box for hearing-impaired learners or quiet study environments.
- **Keyboard Navigation:** Full keyboard navigation support (`[←]` Back, `[→]` Forward, `Tab` focus management, skip-link).
- **Reduced Motion:** Fully honors `@media (prefers-reduced-motion: reduce)`.
- **High-Contrast Dark Aesthetic:** Apple-inspired layout with festival tones: midnight maroon, warm saffron, antique gold, and deep vermilion.

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Execution
```bash
# Navigate to the module directory
cd "summership-26-prs/Reddy-02"

# Install dependencies (React 18, Vite 6)
npm install

# Start local development server
npm run dev

# Run automated test suite (89 passing tests)
npm test

# Build production bundle
npm run build
```

---

## 🧪 Automated Test Suite

Run `npm test` to execute the built-in test suite:
- **89 assertions verified:**
  - Metadata completeness & learning objectives
  - 10-chapter structure, IDs, ordering, and narration texts
  - Question options, correct answer keys, and pedagogical explanations
  - Deterministic Python exception simulation accuracy (`int` conversion, dictionary lookups)
  - Blank-filling normalization and scoring thresholds (4/5 pass mark)
