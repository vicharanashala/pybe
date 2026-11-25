# Dr. Meera's Clinic: Look Closer

An interactive, story-driven Python learning experience that explores testing, boundary cases, edge cases, assertions, and unit tests through a clinic hand-washing mystery.

## Overview

Dr. Meera's Clinic puts learners in the role of the doctor's new helper. After judging five kids' hands by eye and discovering that clean-looking hands can still carry germs, learners meet a Sink Checker that tells kids "Well done!" or "Wash again." The checker seems to work, yet kids keep getting sick.

Learners investigate by choosing their own inputs, compare what the checker says with what it should say, find the hidden bugs, and fix the code. Only afterwards is the concept named. A final vitamin gummy dispenser lets learners repeat the process on their own.

## Concepts Covered

- **Testing:** Running code on chosen inputs and comparing the output with what it should be.
- **Boundary Cases:** Inputs right on the line where the answer changes (for example, exactly 20 seconds).
- **Edge Cases:** Inputs far outside what is expected (for example, -5 or 999 seconds).
- **Assertions (`assert`):** A line that states something must be true and complains if it is not.
- **Unit Tests:** One small, named test per behaviour, run together with the rest.

## Learning Experience

The study is organised into four chapters:

1. **Setting the Scene** – Meet Dr. Meera and the five kids, judge their hands by eye, and look closer with the magnifying glass.
2. **The Cleaning Station** – Try kids at the Sink Checker, choose tricky wash times, discover the mismatches, and fix the code.
3. **Look Closer** – Learn what testing was all along through flip cards for boundary cases, edge cases, assertions, and unit tests.
4. **Your Turn** – Test and fix an unfamiliar vitamin gummy dispenser without hints, then review the summary.

## Implementation

The checker code shown in the story runs as real Python in the browser through Pyodide, loaded from jsDelivr. When a learner sends a kid to the sink, the wash time is passed to the Python function and the result is compared with the answer the clinic rules require, so mismatches come from actual code execution.

Python syntax, including `assert` and named test functions, accompanies the interactive visuals to connect the story with actual Python programming concepts. No external LLM calls or AI image requests are used, and there are no scores, stars, or badges.

## Technology Stack

- React
- TypeScript and JavaScript
- Vite
- Tailwind CSS
- CSS
- Pyodide (Python in the browser)

## Running the Study

**Entry point:** `index.html` → `src/main.tsx`

Requires Node.js 20+ and npm. Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal (http://localhost:3000) to access the study. The first Python execution downloads the Pyodide runtime from jsDelivr, so an internet connection is needed.

## Attribution

Original author credits and license notices are retained in the source files.
