# 1 Arithmetic Operators

**The Brahmin's Pot (Hitopadesha)**

**Concept:** Arithmetic Operators (`+`, `-`, `*`, `/`, `%`, `**`, `//`)
**Difficulty:** Beginner
**Source:** Hitopadesha 

---

## The Story

A poor Brahmin lived in a small village. One day, a generous merchant gave him a clay pot filled with flour. The Brahmin was overjoyed. He took the pot home and hung it on a hook above his bed.

As he lay down, he began to dream. "I will sell this flour and buy two goats. The goats will give birth to more goats. I will sell the goats and buy cows. The cows will give milk, and I will sell the milk to buy buffaloes. The buffaloes will have calves, and soon I will have a whole herd!"

He calculated in his mind: *one pot of flour becomes two goats, which become four goats, which become eight goats...* He multiplied and added in his head, growing more excited with each arithmetic operation.

"In the end," he thought, "I will have so much wealth that I will build a grand house, marry a beautiful woman, and have a son. When my son misbehaves, I will scold him!" And in his excitement, he kicked his leg—striking the pot, which shattered into pieces. All his dreams, built on arithmetic, came crashing down.

---

## The Bridge

The Brahmin was performing arithmetic operations in his head—adding, multiplying, and planning. Python's arithmetic operators let us perform these same calculations on numbers.

| In the story                      | In Python                             | Why                                  |
| --------------------------------- | ------------------------------------- | ------------------------------------ |
| "One pot becomes two goats"       | `1 * 2 = 2`                           | Multiplication (`*`)                 |
| "Two goats become four goats"     | `2 * 2 = 4`                           | More multiplication                  |
| "Sell flour and buy goats"        | `goats = flour / price_per_goat`      | Division (`/`)                       |
| "Cows give milk to sell"          | `total_wealth = cows * milk_price`    | Combining operations                 |
| The Brahmin calculated totals     | `total = initial + growth - expenses` | Addition (`+`) and subtraction (`-`) |
| The pot shattered—his count ended | `remaining = total % 10`              | Modulo (`%`) gives the remainder     |

---

## The Python Code

```python
# Arithmetic operators in Python

# Basic operations
flour_pots = 1
goats = flour_pots * 2          # Multiplication: 2
cows = goats * 2                # Multiplication: 4
buffaloes = cows * 2            # Multiplication: 8

total_animals = goats + cows + buffaloes   # Addition: 14
total_animals = total_animals - 1          # Subtraction: 13 (one got sick)

# Division and modulo
animals_per_pen = 3
pens_needed = total_animals // animals_per_pen   # Floor division: 4
leftover = total_animals % animals_per_pen       # Modulo: 1

# Exponentiation
wealth_growth = 2 ** 3          # 2 to the power of 3 = 8

print("Total animals:", total_animals)
print("Pens needed:", pens_needed)
print("Leftover animals:", leftover)
```

---

## Check Yourself

**1. Which arithmetic operator would you use to find the remainder after division?**

* A) `/`
* B) `%`
* C) `*`
* D) `//`

---

**2. The Brahmin calculated `2 * 2 * 2 = 8`. What is the Python equivalent?**

* A) `2 + 2 + 2`
* B) `2 ** 3`
* C) `2 / 3`
* D) `2 % 3`

---

**3. If you have 17 apples and want to put them in bags of 5, which operator tells you how many bags you need?**

* A) `/`
* B) `%`
* C) `//`
* D) `**`

---

**4. If a farmer has 20 liters of milk and sells each liter for ₹3, then spends ₹10, what is the final amount?**

* A) `20 + 3 - 10`
* B) `20 * 3 - 10`
* C) `20 / 3 - 10`
* D) `20 % 3 - 10`

---

## Answer Key

**1. B** — The modulo operator `%` returns the remainder after division.

**2. B** — `2 ** 3` means 2 raised to the power of 3, which equals 8.

**3. C** — Floor division (`//`) gives the whole number of bags needed (17 // 5 = 3 bags, with 2 left over).

**4. B** — Multiply first, then subtract expenses: `20 * 3 - 10 = 50`.

---
