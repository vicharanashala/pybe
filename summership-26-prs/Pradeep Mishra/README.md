# PyBe Discovery Lab — The Gates of Rajgad

> An interactive, story-driven learning module that teaches **Python Decorators** through the security protocol of Rajgad Fort (1665 CE).

---

# Overview

Most Python tutorials explain decorators using abstract examples. This project introduces the concept through a historical story inspired by **Rajgad Fort**, helping learners understand the decorator pattern before seeing any Python code.

The story follows **Subedar Yesaji Kank**, who follows a strict three-phase security protocol for every royal messenger entering Rajgad Fort. This sequence directly mirrors how a Python decorator works.

---

# Learning Objective

This project teaches the Python Decorator execution flow:

```
BEFORE → MAIN FUNCTION → AFTER
```

Example:

```python
def security(func):
    def wrapper():
        print("Before")        # Kank checks the Mudra token
        result = func()        # Messenger delivers the scroll
        print("After")         # Kank logs the exit in Rojkird
        return result
    return wrapper

@security
def deliver_message():
    print("Delivering message")
    return "Done"

deliver_message()
```

---

# Story

It is **1665 CE**.

A royal messenger arrives at **Maha Darwaja**, the main entrance of Rajgad Fort, carrying a sealed scroll for **Chhatrapati Shivaji Maharaj**.

Before allowing entry, **Subedar Yesaji Kank** verifies the Mudra token and the royal seal.

After successful verification:

1. The messenger enters the fort.
2. The message is delivered.
3. The exit is recorded in the **Rojkird** (official fort ledger).

Every mission follows the same protocol.

Learners experience this journey through an interactive story before discovering its connection to Python decorators.

---

# Screens

| Screen | Description |
|---------|-------------|
| Welcome | Introduction to Rajgad Fort |
| Maha Darwaja | Problem statement |
| Inspection by Kank | BEFORE phase |
| Audience with Maharaj | MAIN FUNCTION |
| Rojkird Log | AFTER phase |
| Python Connection | Story mapped to Python code |
| Quiz 1 | Identify the decorator |
| Quiz 2 | Identify the main function |
| Quiz 3 | Identify the AFTER phase |
| Completion | Summary and congratulations |

---

# Features

- Story-first learning approach
- Interactive quiz with guided feedback
- Story-to-code mapping
- Re-runnable Python terminal animation
- Syntax-highlighted code editor
- BEFORE / MAIN / AFTER phase visualization
- Smooth animations and transitions
- Canvas-based particle effects
- Previous/Next navigation
- Beginner-friendly explanation of Python decorators

---

# Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Canvas API
- Google Fonts
- CSS Animations

---

# Project Structure

```
pybe-discovery-lab/
│
├── index.html
└── assets/
    ├── rajgad_welcome.jpg
    ├── step1_arrival.jpg
    ├── step2_verification.jpg
    ├── step3_durbar.jpg
    └── step4_ledger.jpg
```

---

# Design Decisions

- **Single-file architecture** for simplicity and easy sharing.
- **No frameworks** to keep the project lightweight.
- **Story-first learning** to help beginners understand decorators intuitively.
- **Historical theme** to make learning engaging and memorable.

---

# Context

Developed as part of the **PyBe (Python Beginner Experience)** course project.

The target audience is beginners learning **Python Decorators** for the first time.

---

# Author

**Pradeep Mishra**

GitHub: **pradeep-code1**

Project created as part of the **PyBe Summership** program to explore story-based learning for programming education.