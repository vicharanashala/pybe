# 5 pass_statement

**The Potter's Unfinished Pots**

**Concept:** pass
**Difficulty:** Beginner
**Source:** Indian folk tale 

---

## The Story

In a pottery workshop, a master potter named Kumbhar was teaching his apprentice how to make clay pots. He showed the apprentice the different steps: preparing the clay, shaping the pot, drying it, painting it, and finally firing it in the kiln.

But one day, the apprentice asked, "Master, how do we handle special decorative pots? They need extra care and attention."

The wise potter replied, "For now, just leave a space for that step. We will fill it in later when we learn more about decorating. For regular pots, do everything normally. For decorative pots, do nothing now — but remember to put something there later."

The apprentice continued making pots. For each regular pot, he went through all the steps. For decorative pots, he simply said, "This will be decorated later," and moved on to the next step.

---

## The Bridge

The potter needed to have something in place for future work, even though he wasn't ready to implement it yet. This is what `pass` does in Python — it's a placeholder that does nothing, allowing the code to run without errors.

| In the story                                     | In Python                                    | Why                                                 |
| ------------------------------------------------ | -------------------------------------------- | --------------------------------------------------- |
| "Do nothing now, but we'll add decoration later" | `pass` statement                             | Does nothing, but allows the code to run.           |
| For regular pots, do all the steps               | Normal loop body                             | Regular action runs normally.                       |
| For decorative pots, skip the decoration step    | The `if` statement with `pass`               | Tells Python to do nothing and continue.            |
| The loop continues to the next pot               | The loop continues normally                  | After `pass`, the loop moves to the next iteration. |
| The apprentice remembers to fill it later        | The placeholder reminds us where to add code | Indicates intentional "do nothing" for future work. |

---

## The Python Code

```python id="k2pz7m"
pots = ["regular", "regular", "decorative", "regular", "decorative"]

for pot in pots:
    print("Preparing clay for", pot, "pot")
    
    if pot == "decorative":
        print("This pot needs special decoration later")
        pass  # Placeholder — we'll add decoration code here later
    else:
        print("Adding regular decoration to", pot, "pot")
    
    print("Firing pot in kiln")
    print("---")
```

---

## Check Yourself

**1. Why did the potter use a placeholder for decorative pots?**

* A) He didn't know how to make decorative pots
* B) He needed to fill the space with proper decoration steps later
* C) He wanted to skip all decorative pots
* D) He didn't care about decorative pots

**2. In Python, what does `pass` do?**

* A) It skips the current iteration and moves to the next one
* B) It exits the loop immediately
* C) It does absolutely nothing
* D) It restarts the loop from the beginning

**3. You are writing a program and want to handle a special case, but you don't know how to implement it yet. You need to test your code. What should you use?**

* A) `pass` as a placeholder
* B) `break` to stop the loop
* C) `continue` to skip that case
* D) Remove the special case completely

---

## Answer Key

**1. B** — The potter needed a placeholder for future decoration steps, just like `pass` is a placeholder for future code.

**2. C** — `pass` does nothing — it's a placeholder that allows code to run without errors.

**3. A** — `pass` is perfect as a placeholder for code you plan to implement later.
