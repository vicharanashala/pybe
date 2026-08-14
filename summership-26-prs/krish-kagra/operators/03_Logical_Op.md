# 3 Logical Operators

**The Four Friends and the Hunter (Panchatantra)**

**Concept:** Logical Operators (`and`, `or`, `not`)
**Difficulty:** Beginner
**Source:** Panchatantra 

---

## The Story

In a forest, four friends lived together: a deer, a crow, a turtle, and a mouse. They had promised to protect one another.

One day, the deer was caught in a hunter's net. The crow flew to warn the others. "The deer is trapped!" he cried. The mouse said, "I can chew through the net, BUT I need to reach the deer first." The turtle said, "I can distract the hunter, OR I can carry the mouse on my back to the deer."

They decided: "We will succeed IF the mouse chews the net AND the hunter is distracted." The crow flew above the hunter, cawing loudly. The turtle crawled near the hunter's feet. The hunter chased the turtle, leaving the deer alone. The mouse chewed through the net, and the deer escaped.

They all survived because they used their combined abilities—NOT because of luck, but because of careful planning and teamwork.

---

## The Bridge

The friends combined conditions to make decisions. Logical operators let us combine multiple conditions in Python.

| In the story                                              | In Python                              | Why                          |
| --------------------------------------------------------- | -------------------------------------- | ---------------------------- |
| "I can chew the net, BUT I need to reach the deer"        | `can_chew and can_reach`               | Both must be true (`and`)    |
| "I can distract the hunter, OR carry the mouse"           | `can_distract or can_carry`            | Either one is enough (`or`)  |
| "They succeeded NOT because of luck"                      | `not luck`                             | Negation (`not`)             |
| "We will succeed IF mouse chews AND hunter is distracted" | `mouse_chews and hunter_distracted`    | Both conditions must be true |
| "The hunter chased the turtle, leaving the deer"          | `if hunter_distracted: deer_escapes()` | Condition leads to action    |

---

## The Python Code

```python id="l0gic5"
# Logical operators in Python

mouse_can_chew = True
mouse_can_reach = True
hunter_distracted = True
luck = False

# AND - both must be True
deer_escapes = mouse_can_chew and mouse_can_reach and hunter_distracted
print("Deer escapes:", deer_escapes)   # True - all conditions met

# OR - at least one must be True
turtle_can_distract = True
turtle_can_carry = False
turtle_helps = turtle_can_distract or turtle_can_carry
print("Turtle helps:", turtle_helps)   # True - at least one is True

# NOT - reverses the condition
print(not luck)   # True - it was NOT luck
print(not mouse_can_chew)   # False - mouse CAN chew

# Combining multiple conditions
if mouse_can_chew and (hunter_distracted or turtle_helps):
    print("The deer escapes successfully!")
else:
    print("The deer is caught.")
```

---

## Check Yourself

**1. Which logical operator requires BOTH conditions to be true?**

* A) `or`
* B) `and`
* C) `not`
* D) `==`

---

**2. The friends succeeded because mouse chewed AND hunter was distracted. How would you write this in Python?**

* A) `mouse_chews or hunter_distracted`
* B) `mouse_chews and hunter_distracted`
* C) `not mouse_chews`
* D) `mouse_chews == hunter_distracted`

---

**3. If `x = True` and `y = False`, what is the result of `x or y`?**

* A) `True`
* B) `False`
* C) `None`
* D) Error

---

## Answer Key

**1. B** — `and` requires both conditions to be True.

**2. B** — `and` combines both conditions; both must be True for the deer to escape.

**3. A** — `True or False` evaluates to `True` because `or` only needs one condition to be True.

---
