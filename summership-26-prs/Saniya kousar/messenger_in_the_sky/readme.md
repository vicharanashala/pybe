

`summership-26-prs/saniya-kousar/README.md`

````markdown
# The Royal Messengers of Oakhaven 🕊️

An interactive, story-driven Python learning chapter built around a medieval fantasy narrative. This submission covers **Part 1–4** of the *Royal Messengers of Oakhaven* chronicle — a scenario-based prototype that teaches Python's `print()` function through the metaphor of trained carrier pigeons delivering messages across an impassable mountain range.

---

## 📖 Story Premise

Two kingdoms — **Oakhaven** (home of brilliant scholars) and **Riverbend** (waiting across foggy, uncrossable mountains) — are separated by geography.

Oakhaven's discoveries stay locked behind castle walls until the **Royal Keeper of the Birds** trains carrier pigeons to bridge the divide.

Each chapter maps a Python concept to a story element:

| Story Element | Python Concept |
|---|---|
| Oakhaven's castle | Your running Python program |
| The hidden vaults (RAM) | Variable storage in memory |
| The royal pigeon | The `print()` function |
| The Flight Pouch | The Output Buffer |
| Riverbend's Magic Mirror | Your screen / console |
| The shredded scroll | A `SyntaxError` |

---

## 📚 Chapter Breakdown

### Part 1: The Messenger in the Sky

**Python Concept:** Introduction to `print()` as a built-in function

Oakhaven's scholars hold knowledge that cannot cross the mountains. The Royal Keeper reveals his trained pigeons — messengers that can carry words over the peaks.

This introduces the core analogy: your Python program holds data, and `print()` is the built-in messenger that delivers it to your screen.

**Key takeaway:** `print()` is a **built-in function** — already trained and ready to use when your Python program runs.

---

### Part 2: The Endless Flock

**Python Concept:** Built-in functions and repeated use

The King worries: how many pigeons must be trained?

The Keeper whistles, and hundreds of pigeons descend from the clouds — an endless supply.

You never need to build or train `print()`. You can call it once, five times, or repeatedly inside a loop.

**Key takeaway:** `print()` can be called repeatedly, either in sequence or inside loops, without additional setup.

---

### Part 3: The Coder's Clumsy Mistake

**Python Concept:** Quotes, parentheses, and `SyntaxError`

In his haste, the King throws a naked sheet of paper out the window without a protective scroll or leather backpack. The wind shreds it.

This maps to incorrectly writing:

```python
print Hello
````

instead of:

```python
print("Hello")
```

Python reports an error because the statement does not follow the expected syntax.

**Key takeaway:**

* **Quotes `""`** → the protective scroll (String Literal)
* **Parentheses `()`** → the leather backpack (Function Call)
* Missing required syntax → `SyntaxError`

---

### Part 4: The Instant Scroll and the Royal Delivery

**Python Concept:** String Literals, Output Buffer, and Flushing

With his mistakes fixed, the King sends a simple, direct message:

```python
print("Hello")
```

The Keeper explains the delivery process through three story beats.

#### 🔑 Step 1: The Direct Message — String Literals

Quotation marks tell Python that `"Hello"` is a **string literal** — a sequence of characters written directly in the program.

The value does not need to be obtained from a variable.

#### 🎒 Step 2: Loading the Flight Pouch — Output Buffer

Output can be temporarily buffered before being sent to the destination.

The **output buffer** can be thought of as a temporary holding area for output data.

#### 🪞 Step 3: Flushing to the Magic Mirror — Console Output

When output is flushed, buffered characters are sent to the underlying output stream, such as the console.

In Python, `print()` normally writes to standard output, and its behavior can be controlled using parameters such as `end` and `flush`.

For example:

```python
print("Hello", flush=True)
```

**Key takeaway:** `print("Hello")` demonstrates the journey from a string literal to output, with buffering and flushing explaining how output reaches the console.

---

## 🎮 Interactive Features

* **Cinematic Story Slides** — 4 chapters with layered backgrounds, ambient particles, and typewriter dialogue
* **Dialogue Theater** — Character portraits, speaker roles, and animated speech
* **Chapter Navigation** — Jump between Part 1, 2, 3, and 4 using top-bar navigation
* **Keyboard Controls** — `Space` / `→` to advance and `←` to go back
* **Auto-Play Mode** — Hands-free dialogue advancement
* **Sound Effects** — Web Audio API synthesized chimes, whistles, and wind effects
* **Python Slide** — Concept explanations with analogy cards and preset code snippets
* **Live Code Sandbox** — In-browser Python execution using Pyodide (WebAssembly)
* **Error Handling** — Friendly `SyntaxError` / `NameError` feedback connected to the story metaphor
* **Responsive Layout** — Designed to work across desktop and mobile screen sizes

---

## 🗂️ Project Structure

```text
summership-26-prs/
└── saniya-kousar/
    ├── README.md
    ├── index.html
    └── assets/
        ├── oakhaven_king_throne.jpg
        ├── misty_mountains_border.jpg
        ├── keeper_carrier_pigeon.jpg
        ├── pigeon_flying_peaks.jpg
        ├── riverbend_king_scene.jpg
        ├── python_print_pigeon.jpg
        ├── aviary_king_worried.jpg
        ├── massive_pigeon_flock.jpg
        ├── multiple_pigeon_dispatch.jpg
        ├── endless_code_flock.jpg
        ├── king_rushing_mistake.jpg
        ├── scroll_falling_sky.jpg
        ├── riverbend_empty_pigeon.jpg
        ├── royal_vault_ram.jpg
        ├── flight_pouch_buffer.jpg
        └── magic_mirror_display.jpg
```

> **Note:** If some images are missing, the story and interactive functionality can still run. The affected backgrounds may fall back to a solid dark panel.

---

## 🚀 How to Run

### Option 1: Open Directly

Open `index.html` directly in a modern web browser.

### Option 2: Run Using a Local Server

A local server is recommended when using Pyodide.

From the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### No Build Step Required

The project uses plain HTML, CSS, and JavaScript, so no `npm install` or build command is required.

---

## 🧪 Testing the Code Sandbox

Navigate to the **Python Connection** slide and try the available presets.

| Preset              | Expected Result                                 |
| ------------------- | ----------------------------------------------- |
| `Greeting`          | Prints: `Good morning, Kingdom of Riverbend!`   |
| `Secret Math`       | Displays the computed total of stars catalogued |
| `Royal Scroll`      | Displays a formatted multi-line dispatch        |
| `❌ Both Missing`    | Demonstrates an invalid Python function call    |
| `⚠️ Missing Quotes` | Demonstrates a name-related error               |
| `✅ Perfect Fix`     | Prints: `Hello`                                 |
| `Direct Hello`      | Prints: `Hello`                                 |

---

## 🛠️ Tech Stack

* **HTML5** — Application structure
* **CSS3** — Styling, animations, and responsive layout
* **Vanilla JavaScript** — Application logic and interactions
* **Pyodide v0.26.4** — Python runtime compiled to WebAssembly
* **Web Audio API** — Synthesized sound effects
* **Canvas API** — Floating particle ambience
* **Google Fonts**

  * Cinzel
  * Fraunces
  * JetBrains Mono
  * Plus Jakarta Sans

---

## ✨ Learning Objectives

Through the story-driven experience, learners are introduced to:

1. What Python's built-in `print()` function does
2. How functions are called using parentheses
3. How strings are represented using quotation marks
4. The difference between valid and invalid Python syntax
5. How Python reports common errors
6. How repeated function calls work
7. How program output reaches the console
8. The basic idea of output buffering and flushing

---

## 📋 Submission Checklist

* [x] Submission folder follows the existing `summership-26-prs/` naming convention
* [x] All project files are placed inside `summership-26-prs/saniya-kousar/`
* [x] Part 1–4 story content is complete and interactive
* [x] Part 4 images are mapped to their corresponding story beats
* [x] Python sandbox includes multiple example programs
* [x] Error scenarios are demonstrated
* [x] Responsive layout supports desktop and mobile
* [x] No changes are required outside the submission folder

---

## 👤 Author

**Saniya Kousar**

Summership 2026 — PyBe Submission

---

## 🔗 Related Repository

**PyBe — Scenario-Driven Python Learning Prototype**

[https://github.com/vicharanashala/pybe](https://github.com/vicharanashala/pybe)

````

### Then save it

From your `pybe` folder in **Windows CMD/PowerShell**:

```cmd
notepad summership-26-prs\saniya-kousar\README.md
````

Paste the README, save, then:

```cmd
git add summership-26-prs/saniya-kousar/README.md
git commit -m "Add README documenting Parts 1-4 of the Royal Messengers chronicle"
git push origin saniya-kousar
```
