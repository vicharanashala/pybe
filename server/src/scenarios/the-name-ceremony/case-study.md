# The Name Ceremony

## A Namakarana for Variables

---

### Part 1: Before the Name

Before the naming ceremony, the newborn exists. They breathe, they cry, they are. The name does not create the child — it only gives the world a way to address them.

In Python, before we write:

```python
x = 10
```

The integer `10` does not exist yet? No — Python creates it on the right side first. The sequence is:

1. Python creates an integer object with value `10` in memory
2. Python binds the name `x` to that object

The object exists before the name. The name is a label for the object.

---

### Part 2: Task 1 — Create Named Objects

Write code that demonstrates:

```python
# Create a variable named 'child_name'
child_name = "Arjun"

# Print the object that child_name refers to
print(child_name)        # Arjun
print(type(child_name))  # <class 'str'>
print(id(child_name))    # a large integer (memory address)
```

The variable `child_name` is not the string `"Arjun"` — it is a label that refers to the string `"Arjun"`.

---

### Part 3: Many Names, One Child

At the naming ceremony, multiple relatives may call the child by the same name simultaneously. They are all referring to the same child. If the child laughs, everyone who called the child's name sees the laugh.

In Python:

```python
a = [1, 2, 3]
b = a  # b is another name for the same list
b.append(4)
print(a)  # [1, 2, 3, 4] — a also changed!
print(a is b)  # True — same object
```

**Key insight**: `a` and `b` are two names for the same list in memory. Modifying through one name affects what both names see.

---

### Part 4: Task 2 — Identity vs Equality

```python
x = 10
y = 10

print(x == y)  # True — same value
print(x is y)  # ??? — are they the same object?

# For small integers, Python interns values
# meaning it reuses the same object for efficiency
# but you cannot rely on this behavior
```

```python
x = [1, 2, 3]
y = [1, 2, 3]

print(x == y)  # True — same value
print(x is y)  # False — different objects in memory
```

---

### Part 5: Rebinding

A child can earn a new title as they grow — "boy", "student", "scholar". The child does not change; only the referring labels change.

In Python:

```python
x = 10      # x refers to 10
print(x)    # 10
x = 20      # x now refers to 20, but 10 still exists
print(x)    # 20
```

The object `10` still exists in memory (until Python's garbage collector reclaims it). `x` was rebound to a different integer `20`.

---

### Part 6: Task 3 — None and Naming

What does it mean for a name to have no child? `None` represents the absence of a reference — a name that points to nothing.

```python
child = None
print(child)  # None
```

In the naming ceremony, if the child has not yet been named, the record shows `child = None` — not as an insult, but as a placeholder before the name is given.

---

### Part 7: Naming Conventions — The Ceremonial Rules

Python has traditions for names, just as Indian naming ceremonies follow rules:

```python
# Snake case for variables (lowercase with underscores)
child_name = "Priya"
family_title = "Sharma"

# Constants are SCREAMING_SNAKE_CASE
DAYS_OF_WEEK = 7  # unchangeable by convention

# Names to avoid (reserved for Python internals)
# _private_var — convention says internal use only
# __dunder__ — Python special methods
# __var — name mangling for inheritance
```

The underscore is not a rule of Python syntax — it is a ceremony of intention. By prefixing `_`, you signal that this name is not for external use.

---

### Part 8: The Name Survives the Object?

What happens when all names for an object are removed? In the ceremony, if everyone who knew a child's name dies, the child still existed — but no one can refer to them by name.

In Python:

```python
x = [1, 2, 3]
y = x
del x      # removed one name
# y still refers to the list
# the list is not garbage collected while y exists
del y
# now no names refer to the list
# Python's garbage collector may reclaim it
print([1, 2, 3])  # a new list — the old one is gone
```

---

### Summary

| Ceremony | Python Concept | Meaning |
|----------|---------------|---------|
| The name given to a child | `x = 10` | Binding an identifier to an object |
| Many calling the same name | `a = b = []` | Multiple references to same object |
| Rebinding to a new name | `x = 20` | Identifier now points to different object |
| The child's existence before the name | Object created before variable assigned | Objects exist independently of names |
| Title without a child | `x = None` | Reference to nothing |
| Last person knowing the name dies | `del x` | Removing a reference |

---

### The Philosophical Core

The Namakarana does not create the child. The name is not the child. The name is a relationship between the child and the world. When we understand this — that variables are not containers but relationships — we understand the nature of reference itself.

This is Python's truth: **names are not objects; names refer to objects; an object can have many names; renaming a name does not change the object.**