# PyBe - The Royal Decoder (String Manipulation)

An interactive, story-driven Python learning module designed to teach **String Manipulation** (Methods & Mutability) through a cryptographic espionage scenario.

## 📖 Overview
In this module, the learner plays the role of the Kingdom's newly appointed Master Spy. An intercepted raven carries a scrambled scroll from the enemy camp. Through guided Socratic dialogue and real Python commands, the learner decodes the warning before it's too late.

## 🎯 Pedagogical Goals (SOLO Taxonomy)
- **Unistructural:** Learner understands that a string is a piece of text.
- **Multistructural:** Learner discovers various string methods (`.lower()`, `.upper()`, `.replace()`).
- **Relational:** Learner connects the dot notation to the concept of issuing "commands" to the string object.
- **Extended Abstract:** Learner realizes that strings are immutable in Python; methods return *new* strings, which must be reassigned (`msg = msg.replace(...)`) to take effect.

## 🛠️ Architecture
Built from the ground up using **Vanilla HTML, CSS, and JS**.
- Zero external libraries or heavy frameworks.
- State-driven architecture (`scenes.js`).
- Regex-based AST-lite terminal validation to provide contextual Socratic hints without using dangerous `eval()`.
- Responsive, cinematic UI using CSS transitions and glassmorphism.

## 🚀 How to Run
Simply open `index.html` in any modern web browser, or serve it locally:
```bash
python -m http.server 8080
```
