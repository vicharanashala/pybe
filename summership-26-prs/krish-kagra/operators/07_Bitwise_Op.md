# 7 Bitwise Operators

**The Lion and the Clever Rabbit (Panchatantra)**

**Concept:** Bitwise Operators (`&`, `|`, `^`, `~`, `<<`, `>>`)
**Difficulty:** Intermediate
**Source:** Panchatantra 

---

## The Story

In a forest, a ferocious lion was terrorizing all the animals. The animals decided to send one animal each day to the lion as food. When it was the clever rabbit's turn, he had a plan.

The rabbit arrived late and told the lion, "O mighty lion, I was stopped by another lion who claimed to be stronger than you. He said he would eat me instead."

The lion roared, "Take me to this impostor!" The rabbit led the lion to a deep well. "He lives down there," said the rabbit. The lion looked into the well and saw his own reflection. He roared, and the reflection roared back. Enraged, the lion jumped into the well and drowned.

The rabbit had used the lion's own strength against him—turning each roar back at him, bit by bit.

---

## The Bridge

The lion's reflection shows how bits work. Bitwise operators in Python work on individual bits of numbers, just like the lion's roars were reflected back at him.

| In the story                      | In Python              | Why                              |                   |
| --------------------------------- | ---------------------- | -------------------------------- | ----------------- |
| The lion saw his reflection       | `a & b` (AND)          | Each bit is compared             |                   |
| The reflection roared back        | `a                     | b` (OR)                          | Bits are combined |
| The lion fought his own image     | `a ^ b` (XOR)          | Bits that differ are highlighted |                   |
| The lion was defeated by himself  | `~a` (NOT)             | Bits are inverted                |                   |
| The lion moved closer to the well | `a << 1` (Left shift)  | Bits shift left                  |                   |
| The lion moved away from the well | `a >> 1` (Right shift) | Bits shift right                 |                   |

---

## The Python Code

```python id="bit57"
# Bitwise operators in Python

# Binary representation
a = 5    # 0101 in binary
b = 3    # 0011 in binary

# Bitwise AND - both bits must be 1
print(a & b)   # 0001 = 1

# Bitwise OR - at least one bit must be 1
print(a | b)   # 0111 = 7

# Bitwise XOR - bits must be different
print(a ^ b)   # 0110 = 6

# Bitwise NOT - flips all bits
print(~a)      # -6 (in Python, ~x = -x - 1)

# Left shift - shifts bits left (multiplies by 2)
print(a << 1)  # 1010 = 10

# Right shift - shifts bits right (divides by 2)
print(a >> 1)  # 0010 = 2

# Practical example: checking if a number is even
def is_even(num):
    return (num & 1) == 0

print(is_even(4))   # True - 4 & 1 = 0
print(is_even(5))   # False - 5 & 1 = 1
```

---

## Check Yourself

**1. What is the result of `5 & 3` in Python?**

* A) 8
* B) 7
* C) 1
* D) 6

---

**2. What does the left shift operator (`<<`) do?**

* A) Shifts bits to the right
* B) Shifts bits to the left (multiplies by 2)
* C) Compares two bits
* D) Flips all bits

---

**3. If `x = 8` (1000 in binary), what is `x >> 1`?**

* A) 16
* B) 4
* C) 8
* D) 0

---

## Answer Key

**1. C** — 5 (0101) & 3 (0011) = 0001 = 1.

**2. B** — Left shift (`<<`) moves bits to the left, which multiplies the number by 2.

**3. B** — 8 (1000) >> 1 = 4 (0100), which is 8 ÷ 2.

---
