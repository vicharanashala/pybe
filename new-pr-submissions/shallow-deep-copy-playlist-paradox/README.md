# The Playlist Paradox: Who Hijacked the Jam?

An interactive, story-driven Python learning experience that explores list assignment, shallow copying, and deep copying through a music playlist mystery.

## Overview

The Playlist Paradox puts learners in the middle of a farewell-party playlist mystery involving Ahaana and Reyansh. When Reyansh modifies his remix setlist, unexpected changes appear in Ahaana's original playlist.

Learners investigate what went wrong through interactive experiments, visual comparisons, and guided explanations, gradually discovering how Python handles nested lists and object references.

## Concepts Covered

- **List Assignment (`=`):** Understanding how multiple variables can reference the same list.
- **Shallow Copy (`list.copy()`):** Creating a new outer list while retaining references to nested lists.
- **Deep Copy (`copy.deepcopy()`):** Creating independent copies of the outer list and its nested elements.
- **Object Identity and Equality (`is` and `==`):** Understanding the difference between object identity and value equality.

## Learning Experience

The study is organised into four chapters:

1. **Setting the Scene** – Meet the characters and discover the playlist mystery.
2. **The Paradox** – Investigate unexpected changes and explore possible explanations.
3. **Sound Lab** – Perform nine interactive experiments covering assignment, shallow copy, and deep copy, with different playlist modifications.
4. **The Reveal** – Connect observations to Python concepts through visual explanations, code examples, and a final assessment.

## Implementation

The study uses a JavaScript-based simulation to demonstrate Python's nested-list assignment and copying behaviour. Each experiment starts with a fresh baseline, allowing learners to observe how changes affect the original and modified playlists.

Python syntax and code examples accompany the interactive visualisations to connect the simulation with actual Python programming concepts.

## Technology Stack

- React
- TypeScript and JavaScript
- Vite
- Tailwind CSS
- CSS

## Running the Study

**Entry point:** `index.html` → `src/main.tsx`

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal to access the study.

## Attribution

Original author credits and license notices are retained in the source files.