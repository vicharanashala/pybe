# 4 Main Features of Python

**The Chariot with Six Special Wheels**

**Concept:** Main Features of Python
**Difficulty:** Beginner
**Source:** Indian folk tale 

---

## The Story

In a prosperous kingdom, the king commissioned a chariot that would be the best in the world. The chariot had six special wheels:

* One wheel could run on any terrain – sand, rock, water.
* One wheel never lost its grip.
* One wheel was self-repairing.
* One wheel could change size to fit any road.
* One wheel was silent and smooth.
* One wheel made the chariot easy to steer.

The chariot became famous because it was reliable, adaptable, and powerful — just like Python.

---

## The Bridge

Python has several standout features that make it a powerful and pleasant language to use.

| Feature                    | In the story                       | Why it matters                           |
| -------------------------- | ---------------------------------- | ---------------------------------------- |
| **Easy to learn and read** | The wheel that ran on any terrain  | Python syntax is simple and clear        |
| **Interpreted**            | The wheel that never lost its grip | Code runs line by line, easy to test     |
| **Dynamically typed**      | The self-repairing wheel           | You don't need to declare variable types |
| **Object-oriented**        | The wheel that changed size        | Supports classes and inheritance         |
| **Large standard library** | The silent and smooth wheel        | Built-in modules for many tasks          |
| **Extensible**             | The easy-to-steer wheel            | Can integrate with C/C++ for performance |

---

## Python Code Showing Features

```python id="t6k9pz"
# 1. Easy to read
name = "Alice"

# 2. Dynamically typed – no type declaration needed
age = 30        # integer
age = "thirty"  # now a string – no error

# 3. Object-oriented
class Student:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print("Hello, I am", self.name)

# 4. Using standard library
import math
print(math.sqrt(16))   # 4.0
```

---

## Check Yourself

**1. Which feature allows Python to run code line by line without compiling first?**

* A) Dynamically typed
* B) Interpreted
* C) Object-oriented
* D) Extensible

**2. What does "dynamically typed" mean in Python?**

* A) You must declare variable types
* B) The type of a variable can change at runtime
* C) Types are fixed forever
* D) Python does not have types

**3. Python's standard library is:**

* A) Very small and limited
* B) Large and includes many useful modules
* C) Only for web development
* D) Not included with Python

---

## Answer Key

**1. B** — Python is an interpreted language, meaning it executes code line by line.

**2. B** — In dynamically typed languages, the type is determined at runtime and can change.

**3. B** — Python comes with a large standard library covering many tasks, like math, file I/O, networking, etc.
