# 6 Identity Operators

**The Two Bodies and One Soul (Vikram-Betaal)**

**Concept:** Identity Operators (`is`, `is not`)
**Difficulty:** Beginner
**Source:** King Vikramaditya and Betaal 

---

## The Story

One night, Betaal the ghost told King Vikramaditya a strange tale. "O King, there was a man who could project his soul into any body. One day, he left his own body and entered the body of a dead prince. His friend, thinking the man was truly dead, cremated his original body. The man was now trapped in the prince's body."

Betaal asked, "O King, is the man still the same person, even though his body is different? Is he the same identity or a different one?"

The king thought deeply. "The body is not the person. The soul is the person. Even though the body changed, the soul remained the same. The prince's body and the man's original body are different objects, but the soul within them is the same identity."

Betaal smiled. "You have answered correctly, O King. Just as two bodies can share one soul, two variables can point to the same object in memory."

---

## The Bridge

The king distinguished between the body (the object) and the soul (the identity). Identity operators in Python check whether two variables refer to the same object in memory.

| In the story                              | In Python                       | Why                                          |
| ----------------------------------------- | ------------------------------- | -------------------------------------------- |
| "Is the man still the same person?"       | `man is person`                 | Identity check (`is`)                        |
| "The body changed, but the soul remained" | `soul is not body`              | Different identity (`is not`)                |
| "The prince's body is a different object" | `prince_body is not man_body`   | Two different objects                        |
| "The soul within them is the same"        | `soul_in_man is soul_in_prince` | Same identity                                |
| Two bodies, one identity                  | Two variables, one object       | `is` checks if they refer to the same object |

---

## The Python Code

```python id="ident56"
# Identity operators in Python

# Two variables pointing to the same object
man_soul = {"name": "The Man", "body": "original"}
prince_soul = man_soul  # Both refer to the SAME object

# Check if they are the same object
print(man_soul is prince_soul)   # True - they are the same object

# Two different objects with the same content
man_body = {"type": "human", "status": "alive"}
prince_body = {"type": "human", "status": "alive"}

print(man_body is prince_body)   # False - different objects
print(man_body == prince_body)   # True - same content, different objects

# Using is not
print(man_body is not prince_body)   # True - they are different objects

# With simple values
a = 10
b = 10
print(a is b)   # True (Python may cache small integers)

c = [1, 2, 3]
d = [1, 2, 3]
print(c is d)   # False - different list objects
print(c == d)   # True - same content
```

---

## Check Yourself

**1. What does the `is` operator check?**

* A) If two values are equal
* B) If two variables refer to the same object
* C) If a value exists in a sequence
* D) If two values are different

---

**2. If `a = [1, 2, 3]` and `b = [1, 2, 3]`, what is `a is b`?**

* A) `True`
* B) `False`
* C) `None`
* D) Error

---

**3. Which operator would you use to check if two variables point to different objects?**

* A) `!=`
* B) `is not`
* C) `not in`
* D) `==`

---

## Answer Key

**1. B** — `is` checks object identity—whether two variables refer to the same object in memory.

**2. B** — `a` and `b` are two different list objects with the same content, so `a is b` is `False`.

**3. B** — `is not` checks if two variables point to different objects.

---
