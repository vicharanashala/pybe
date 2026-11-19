# Royal Heritage Museum — Encapsulation Mission

## Overview

Royal Heritage Museum — Encapsulation Mission is an interactive educational case study designed to introduce Python encapsulation and data hiding through a museum-themed learning experience.

Learners explore how classes protect internal data and how controlled access helps maintain the integrity of an object's state.

## Concepts Covered

- Classes and objects
- Encapsulation
- Data hiding
- Public and private attributes
- Controlled access to object data
- Encapsulation in practical Python examples

## Project Structure

```text
src/
├── assets/
├── components/
├── game/
│   ├── assets.ts
│   ├── missionLogic.ts
│   └── missionLogic.test.ts
├── App.tsx
├── index.css
└── main.tsx

index.html
metadata.json
package.json
package-lock.json
README.md
tsconfig.json
vite.config.ts
```

## Prerequisites

- Node.js compatible with the project's Vite version
- npm

## Installation

Clone or download the project and open its root directory in the terminal.

Install dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## Build

Create a production build:

```bash
npm run build
```

## TypeScript Validation

Run the TypeScript check:

```bash
npm run lint
```

## Testing

The mission logic tests are located in:

```text
src/game/missionLogic.test.ts
```

## Local-only Policy

The case study must operate without external LLM provider calls, cloud-based AI generation services, or provider API keys.

## Author Credits

Preserve the original author and contributor credits from the original submission.