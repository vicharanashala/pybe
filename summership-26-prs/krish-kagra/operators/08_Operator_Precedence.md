# 8 Operator Precedence

**The Court of King Vikramaditya (Vikram-Betaal)**

**Concept:** Operator Precedence
**Difficulty:** Intermediate
**Source:** King Vikramaditya and Betaal 

---

## The Story

King Vikramaditya held court with his ministers, each responsible for different matters. The king had a strict order:

1. First, the royal priest would speak (parentheses).
2. Then, the prime minister would present matters of multiplication and division (wealth and army).
3. Next, the treasurer would report on addition and subtraction (income and expenses).
4. Finally, the guards would handle comparisons and decisions (judgments).

One day, a minister tried to speak out of turn. The king said, "In my court, there is a fixed order. The priest speaks first, then the prime minister, then the treasurer, and finally the guards. If you speak out of order, chaos will follow."

The minister understood. Just as the court had a hierarchy, mathematical expressions must follow a fixed order to be evaluated correctly.

---

## The Bridge

Operator precedence is like the court's hierarchy—certain operations are performed before others.

| In the court                             | In Python                        | Precedence (highest to lowest) |
| ---------------------------------------- | -------------------------------- | ------------------------------ |
| Royal priest speaks first                | `()` parentheses                 | Highest precedence             |
| Prime minister (multiplication/division) | `*`, `/`, `//`, `%`              | Second highest                 |
| Treasurer (addition/subtraction)         | `+`, `-`                         | Third highest                  |
| Guards (comparisons)                     | `==`, `!=`, `>`, `<`, `>=`, `<=` | Lower precedence               |
| Messengers (assignment)                  | `=`, `+=`, `-=`, etc.            | Lowest precedence              |

---

## The Python Code

```python id="prec58"
# Operator precedence in Python

# Example 1: Without parentheses
result = 10 + 5 * 2
print(result)   # 20 (not 30) because * happens before +

# Example 2: With parentheses
result = (10 + 5) * 2
print(result)   # 30 (parentheses first)

# Example 3: Mixed operators
result = 20 - 4 / 2 + 3 * 2
# Step 1: 4 / 2 = 2
# Step 2: 3 * 2 = 6
# Step 3: 20 - 2 + 6 = 24
print(result)   # 24.0

# Example 4: Comparison with arithmetic
x = 10
result = x + 5 > 12
# Step 1: x + 5 = 15
# Step 2: 15 > 12 = True
print(result)   # True

# Example 5: Logical with comparison
age = 25
has_license = True
can_drive = age >= 18 and has_license
# Step 1: age >= 18 = True
# Step 2: True and True = True
print(can_drive)   # True
```

---

## Operator Precedence Table (Highest to Lowest)

| Operator                                                         | Description                                      |
| ---------------------------------------------------------------- | ------------------------------------------------ |
| `()`                                                             | Parentheses                                      |
| `**`                                                             | Exponentiation                                   |
| `+x`, `-x`, `~x`                                                 | Unary positive, negative, bitwise NOT            |
| `*`, `/`, `//`, `%`                                              | Multiplication, division, floor division, modulo |
| `+`, `-`                                                         | Addition, subtraction                            |
| `<<`, `>>`                                                       | Bitwise shifts                                   |
| `&`                                                              | Bitwise AND                                      |
| `^`                                                              | Bitwise XOR                                      |
| `\|`                                                             | Bitwise OR                                       |
| `==`, `!=`, `>`, `<`, `>=`, `<=`, `is`, `is not`, `in`, `not in` | Comparisons, identity, membership                |
| `not`                                                            | Logical NOT                                      |
| `and`                                                            | Logical AND                                      |
| `or`                                                             | Logical OR                                       |
| `=`, `+=`, `-=`, etc.                                            | Assignment                                       |

---

## Check Yourself

**1. What is the result of `2 + 3 * 4`?**

* A) 20
* B) 14
* C) 24
* D) 10

---

**2. How would you change `2 + 3 * 4` to get 20?**

* A) `2 + (3 * 4)`
* B) `(2 + 3) * 4`
* C) `2 * (3 + 4)`
* D) `(2 * 3) + 4`

---

**3. Which operator has the highest precedence?**

* A) `+`
* B) `*`
* C) `()`
* D) `==`

---

## Answer Key

**1. B** — 3 * 4 = 12, then 2 + 12 = 14 (multiplication before addition).

**2. B** — `(2 + 3) * 4` = 5 * 4 = 20. Parentheses change the order.

**3. C** — Parentheses `()` have the highest precedence in Python.

---
