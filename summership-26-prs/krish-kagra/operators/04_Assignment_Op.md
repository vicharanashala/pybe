# 4 Assignment Operators

**The King's Growing Treasure (Vikram-Betaal)**

**Concept:** Assignment Operators (`=`, `+=`, `-=`, `*=`, `/=`, `%=`, `//=`, `**=`)
**Difficulty:** Beginner
**Source:** King Vikramaditya and Betaal 

---

## The Story

King Vikramaditya was known for his wisdom and wealth. One day, Betaal the ghost asked him a riddle: "O King, if you had a treasure that doubled every day, how would you keep track of it?"

The king replied, "I would count it each day and add the new amount to the old." He began: "Today I have 100 gold coins. Tomorrow, I will have 200. So I add 100 more. The next day, I have 400, so I add 200 more. Each day, I update my total."

Betaal laughed. "But King, you must also spend some gold on your kingdom. Each day, you subtract what you give away." The king nodded. "Yes, I must also divide my treasure among my ministers and multiply the rest through trade."

The king realized that managing wealth meant constantly updating his totals—adding, subtracting, multiplying, and dividing—always assigning the new value back to his treasury.

---

## The Bridge

The king was performing assignment operations—updating a variable with new values. Assignment operators in Python let us update variables concisely.

| In the story                            | In Python         | Why                        |
| --------------------------------------- | ----------------- | -------------------------- |
| "Today I have 100 coins"                | `treasure = 100`  | Simple assignment (`=`)    |
| "Tomorrow, I add 100 more"              | `treasure += 100` | Add and assign (`+=`)      |
| "Each day, I subtract what I give away" | `treasure -= 50`  | Subtract and assign (`-=`) |
| "The treasure doubled"                  | `treasure *= 2`   | Multiply and assign (`*=`) |
| "I divide among my ministers"           | `treasure /= 5`   | Divide and assign (`/=`)   |
| "The remainder after division"          | `treasure %= 10`  | Modulo and assign (`%=`)   |

---

## The Python Code

```python id="asgn54"
# Assignment operators in Python

# Simple assignment
treasure = 100
print("Initial treasure:", treasure)

# Add and assign
treasure += 100    # Same as: treasure = treasure + 100
print("After adding:", treasure)   # 200

# Multiply and assign
treasure *= 2      # Same as: treasure = treasure * 2
print("After doubling:", treasure)   # 400

# Subtract and assign
treasure -= 50     # Same as: treasure = treasure - 50
print("After spending:", treasure)   # 350

# Divide and assign
treasure /= 5      # Same as: treasure = treasure / 5
print("After dividing:", treasure)   # 70.0

# Floor divide and assign
treasure //= 3     # Same as: treasure = treasure // 3
print("After floor division:", treasure)   # 23.0

# Modulo and assign
treasure %= 10     # Same as: treasure = treasure % 10
print("After modulo:", treasure)   # 3.0

# Power and assign
treasure **= 2     # Same as: treasure = treasure ** 2
print("After squaring:", treasure)   # 9.0
```

---

## Check Yourself

**1. What does `x += 5` do?**

* A) Adds 5 to x and stores the result in x
* B) Checks if x is equal to 5
* C) Multiplies x by 5
* D) Subtracts 5 from x

---

**2. If `gold = 50`, what is the result of `gold *= 3`?**

* A) 53
* B) 150
* C) 47
* D) 50

---

**3. The king's treasure doubled each day. If `treasure = 100`, which operator would you use to double it?**

* A) `treasure += 2`
* B) `treasure *= 2`
* C) `treasure /= 2`
* D) `treasure **= 2`

---

## Answer Key

**1. A** — `x += 5` is shorthand for `x = x + 5`.

**2. B** — `gold *= 3` means `gold = gold * 3`, so 50 * 3 = 150.

**3. B** — `treasure *= 2` doubles the treasure (`treasure = treasure * 2`).

---
