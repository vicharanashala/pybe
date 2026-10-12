# 5 Membership Operators

**The Golden Mallard (Jataka Tales)**

**Concept:** Membership Operators (`in`, `not in`)
**Difficulty:** Beginner
**Source:** Jataka Tales 

---

## The Story

In a beautiful lake, there lived a magnificent golden mallard duck with feathers of pure gold. Every day, the mallard would pluck one golden feather and leave it for a poor widow and her two daughters who lived nearby.

The widow collected the feathers and sold them. But one day, greed overcame her. She thought, "If the mallard has golden feathers, surely there must be a treasure inside the lake. I will catch the duck and take all its feathers at once!"

She searched the lake. Was the mallard in the reeds? *No.* Was it behind the lotus flowers? *No.* Was it swimming near the shore? *No.* She looked everywhere, but the mallard was not in any of those places.

When she finally found the mallard, it said, "Greed has made you lose what you had. Since you wanted everything at once, you shall have nothing." And with that, the mallard flew away, never to return. The widow checked her basket—there were no golden feathers in it anymore. The mallard was no longer in the lake, and her golden feathers were no longer in her possession.

---

## The Bridge

The widow checked whether the mallard was in various locations. Membership operators in Python check whether a value exists in a collection.

| In the story                                  | In Python                  | Why                               |
| --------------------------------------------- | -------------------------- | --------------------------------- |
| "Was the mallard in the reeds?"               | `mallard in reeds`         | Checking membership (`in`)        |
| "Was it behind the lotus flowers?"            | `mallard in lotus_flowers` | More membership checks            |
| "No, it was not in any of those places"       | `mallard not in reeds`     | Not in (`not in`)                 |
| "There were no golden feathers in the basket" | `feather not in basket`    | Checking absence                  |
| "The mallard was no longer in the lake"       | `mallard not in lake`      | Membership check returns False    |
| The widow checked each possible location      | Loop with `in` operator    | Iterating and checking membership |

---

## The Python Code

```python id="memb55"
# Membership operators in Python

# A list of locations
locations = ["reeds", "lotus_flowers", "shore", "deep_water"]
mallard_location = "deep_water"

# Checking if mallard is in a location
print(mallard_location in locations)   # True - "deep_water" is in the list

# Checking if mallard is NOT in a location
print(mallard_location not in locations)   # False - it IS in the list

# Checking specific locations
if mallard_location == "reeds":
    print("Mallard is in the reeds!")
elif mallard_location in ["lotus_flowers", "shore"]:
    print("Mallard is near the shore or flowers!")
else:
    print("Mallard is somewhere else")

# Checking for golden feathers in a basket
basket = ["copper", "silver", "bronze"]   # No gold here
if "gold" not in basket:
    print("No golden feathers in the basket!")

# Membership with strings
sentence = "The golden mallard lives in the lake"
print("golden" in sentence)   # True
print("treasure" in sentence)   # False
```

---

## Check Yourself

**1. What does the `in` operator do in Python?**

* A) Checks if a value exists in a sequence
* B) Adds a value to a sequence
* C) Removes a value from a sequence
* D) Compares two values

---

**2. If `basket = ["gold", "silver", "bronze"]`, what is `"gold" in basket`?**

* A) `True`
* B) `False`
* C) `None`
* D) Error

---

**3. Which operator would you use to check if a mallard is NOT in the lake?**

* A) `mallard in lake`
* B) `mallard not in lake`
* C) `mallard == lake`
* D) `mallard != lake`

---

## Answer Key

**1. A** — `in` checks if a value exists in a sequence (list, tuple, string, etc.).

**2. A** — `"gold" in basket` returns `True` because "gold" is in the list.

**3. B** — `mallard not in lake` checks if the mallard is NOT present in the lake.

---
