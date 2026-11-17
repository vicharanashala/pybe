# PyBe — Project Context & Architecture

This document serves as the absolute source of truth for the PyBe frontend interactive module. If an LLM needs to recreate, expand, or modify this module, it must follow these exact philosophies, architectural choices, and constraints.

## 1. Core Philosophy (The "Betal" Method)
PyBe is **not** a Python syntax course. It is a concept discovery platform.
The learner must almost never feel like they are learning syntax. The ideal flow:
1. **Interesting, relatable situation** (e.g., Tapri, Papa's Wallet).
2. **Friction appears naturally** (e.g., A wrong UPI payment, dead phone).
3. **Learner makes a decision** (Interactive choices).
4. **Learner discovers the pattern** (e.g., "I shouldn't check if I already know the answer").
5. **Python says:** "We call this Short-Circuit Evaluation."

## 2. Strict Constraints for AI / Contributors
- **No Em Dashes:** The use of em dashes (—) or classic AI-generated conversational markers is strictly banned in the UI text.
- **No Generic AI Dark Themes:** The UI must be minimalistic, bright, playful, and built entirely using Vanilla CSS. Use pastel backgrounds (e.g., `#fdfbf7`), soft borders, and vibrant accents. Tailwind CSS is not allowed.
- **Relatable Scenarios:** Stories must map to Indian daily life. Do not use generic textbook examples like `Animal -> Dog`.
- **Zero Backend Dependencies:** The project must remain a purely frontend React + Vite app using local `data.json`. No `.env` files, no databases.

## 3. Project Architecture
The project is built inside a specific contributor folder using **Vite + React**. 
- **`src/App.jsx`**: Renders a scalable, full-page grid (`.case-studies-grid`) of available case studies pulled from `data.json`.
- **`src/Scenario.jsx`**: The core interactive engine. It reads the steps, tracks a `history` array of visited step IDs, and provides `⌂ Home`, `← Back`, and `Next →` navigation.
- **`src/data.json`**: The heart of the application. It contains an array of objects. Each object is a case study with `id`, `title`, `description`, and a `steps` dictionary.
- **`src/index.css`**: The central design system containing CSS variables, animations, and the critical `white-space: pre-wrap;` property for `.python-snippet` to ensure code blocks render correctly.

## 4. The JSON Data Structure (Reference)
Every case study must follow this format:
```json
{
  "id": "scenario-id",
  "title": "Scenario Title",
  "description": "Short teaser",
  "steps": {
    "start": {
      "image": "/assets/image_name.jpg",
      "text": "The story text here.",
      "options": [
        { "label": "Wrong Choice", "next": "start", "feedback": "Gentle, playful explanation of why it's wrong." },
        { "label": "Right Choice", "next": "next_step_id" }
      ]
    },
    "aha": {
      "text": "You naturally discovered X. Python calls this Y.",
      "snippet": "if x and y:\n    print('Hello')",
      "teaser": "What's next?",
      "options": [ { "label": "Finish", "next": "end" } ]
    }
  }
}
```

## 5. Existing Case Studies (Do not duplicate)
1. **The Smart Shortcut**: Papa's missing wallet (OR logic) & Dead phone outdoors with no socket (AND logic). Teaches Short-Circuit Evaluation.
2. **The UPI Mistake**: Accidentally sending ₹500 to Raju Tea Stall and being unable to edit the past transaction. Teaches Tuples & Immutability.
3. **Sharma Ji's Address**: An exhausted shopkeeper writing an address on a blackboard to avoid repeating it to male customers all day. Teaches Memoization & Caching.

## 6. How to Extend
To add a new case study, an LLM should:
1. Brainstorm a deeply relatable scenario.
2. Formulate a 4-5 step decision tree.
3. Generate 2D cartoony images and save them to `public/assets`.
4. Append the new JSON object to `data.json`. No React code changes are required!