# 2 Comparison Operators

**The Wise Judge and the Two Mothers (Jataka Tales)**

**Concept:** Comparison Operators (`==`, `!=`, `>`, `<`, `>=`, `<=`)
**Difficulty:** Beginner
**Source:** Jataka Tales

---

## The Story

A woman was bathing her child in a river when a demoness, disguised as a woman, stole the baby. Both women claimed the child was theirs and brought their dispute before the wise Bodhisattva, who served as the village judge.

The judge said, "I will settle this fairly. Each of you will pull the child toward yourself. The one who pulls harder will be the true mother."

The women began to pull. The real mother, seeing her child cry in pain, could not bear it. She let go, weeping. The demoness pulled the child toward herself triumphantly.

The judge declared, "Stop! The one who let go is the true mother. A real mother compares her child's pain to her own happiness and chooses her child's well-being above all."

The demoness was exposed and fled. The mother and child were reunited.

---

## The Bridge

The judge compared the actions of the two women to determine the truth. Comparison operators in Python let us compare values and make decisions based on those comparisons.

| In the story                          | In Python                           | Why                          |
| ------------------------------------- | ----------------------------------- | ---------------------------- |
| "Is this woman the real mother?"      | `woman1 == real_mother`             | Equality check (`==`)        |
| "The demoness is not the mother"      | `woman2 != real_mother`             | Inequality check (`!=`)      |
| "Who pulled harder?"                  | `pull_strength1 > pull_strength2`   | Greater than (`>`)           |
| "The real mother's love was stronger" | `love_real > love_fake`             | Comparison of values         |
| "The child's pain was too great"      | `pain > 10`                         | Checking a condition         |
| The judge declared the winner         | `if mother == real: return_child()` | Decision based on comparison |

---

## The Python Code

```python
# Comparison operators in Python

real_mother = "Rama"
woman1 = "Rama"
woman2 = "Demoness"

# Equality and inequality
print(woman1 == real_mother)   # True - woman1 is the real mother
print(woman2 == real_mother)   # False - woman2 is not

# Greater than / Less than
pull_strength_rama = 5
pull_strength_demon = 8
print(pull_strength_rama > pull_strength_demon)   # False
print(pull_strength_rama < pull_strength_demon)   # True

# Greater than or equal to / Less than or equal to
love_real = 100
love_fake = 20
print(love_real >= love_fake)   # True
print(love_fake <= 30)          # True

# Making a decision
if woman1 == real_mother:
    print("Return the child to woman1!")
else:
    print("Woman1 is not the mother.")
```

---

## Check Yourself

**1. Which operator checks if two values are equal?**

* A) `=`
* B) `==`
* C) `!=`
* D) `>=`

---

**2. The judge compared pull strengths. Which operator would check if Rama pulled harder than the demoness?**

* A) `rama < demon`
* B) `rama == demon`
* C) `rama > demon`
* D) `rama != demon`

---

**3. Which comparison would be TRUE if the demoness is NOT the real mother?**

* A) `demoness == mother`
* B) `demoness != mother`
* C) `demoness > mother`
* D) `demoness < mother`

---

## Answer Key

**1. B** — `==` is the equality operator. `=` is for assignment.

**2. C** — `rama > demon` checks if Rama's strength is greater.

**3. B** — `demoness != mother` means "demoness is not equal to mother," which is true.

---
