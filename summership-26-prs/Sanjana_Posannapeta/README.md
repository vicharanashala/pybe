# The Campus Fest: Scope in Python

A browser-based interactive learning experience built with React and Vite to teach Python scope through the story of a campus festival.

## Project Overview

This project turns an abstract programming topic into a visual, story-driven experience. Instead of presenting scope as a dry definition, the app creates a scenario where students follow festival organizers, meet characters like Kabir and Priya, and observe how information moves across different parts of a system.

The core concept is that Python variables are not all equally accessible everywhere in a program. Some variables are visible globally, while others are limited to specific functions or blocks. The app explains this through a narrative that gradually reveals the idea of scope as a boundary for visibility and access.

## What It Teaches

The experience teaches the fundamentals of Python scope, especially:

- global scope
- local scope
- variable visibility inside and outside functions
- scope boundaries and access rules
- how code execution changes depending on where variables are declared
- why understanding scope is important for writing predictable and bug-free programs

The project focuses on helping beginners understand that scope is about where a variable exists and which parts of the program can see or modify it.

## Concept as a Story

The story is set around a campus festival, where organizers coordinate schedules, communicate across different zones, and manage live information from multiple stations. Each scene mirrors the flow of a Python program:

- the festival is the overall system
- each station represents a different part of code
- information shared across the whole event resembles global variables
- information seen only within one area resembles local variables
- the story introduces boundaries, lookup behavior, and the idea of restricted access

As the user moves through the scenes, they discover that not all information is visible everywhere. The narrative gradually builds toward the idea that scope acts like a structured system of access and control.

## How the Experience Flows

The app follows a guided 11-scene structure:

1. Welcome to the campus festival and introduction to the setting
2. Meet Kabir and the coordination challenge
3. Enter Lab 101 and observe the working environment
4. Priya needs a bigger picture of what is happening
5. Kabir asks a key question about how information is shared
6. The searchlight moment reveals the hidden pattern
7. A reverse situation helps the learner think from another angle
8. The scope boundary is introduced clearly
9. The user explores the concept of global behavior
10. The user explores the concept of local behavior
11. Final challenge and concept reinforcement

Each scene builds on the previous one so the learner can gradually connect a real-world analogy to Python’s scope rules.

## Learning Goals

By the end of the experience, the user should be able to:

- distinguish between global and local variables
- explain how scope controls access to information
- identify where a variable can be used safely
- reason about common scope-related errors
- connect real-world systems to Python program structure

## Features

- 11-step interactive narrative flow
- story-driven visual explanation of Python scope
- progress navigation with numbered scene dots
- previous/next scene controls
- keyboard navigation support
- persistent progress using browser local storage
- responsive single-page learning experience
- no backend required

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Lucide React icons

## Project Structure

```text
Sanjana_Posannapeta/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── scope.css
│   ├── components/
│   └── scenes/
├── index.html
├── package.json
├── vite.config.js
├── style.css
├── script.js
├── assets/
└── dist/
```

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js (recommended LTS)
- npm

## Installation

1. Open a terminal in the project folder.
2. Install dependencies:

```bash
npm install
```

## Run the Project

Start the development server:

```bash
npm run dev
```

The app will run on:

```text
http://localhost:5174
```

## Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Usage

- Open the app in the browser.
- Move through the story with the Next and Previous controls.
- Use the numbered scene dots to jump between sections.
- Read the narrative carefully and follow the explanations as the concept becomes clearer step by step.

## Why This Project Matters

This project is valuable because it helps learners move from memorizing definitions to understanding behavior. By using a story and a visual progression, it makes scope less intimidating and easier to connect to real coding situations.

## Notes

This project is designed for:

- beginner Python learners
- classroom demonstrations
- interactive teaching sessions
- assignment and hackathon presentation work

## Author

Sanjana Posannapeta

## License

This project does not include a formal license file. Please confirm with the repository owner or team before reusing it for production or public distribution.

