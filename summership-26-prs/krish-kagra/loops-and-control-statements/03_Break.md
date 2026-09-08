# 3 break_statement

**The Sage and the Mouse**

**Concept:** break
**Difficulty:** Beginner
**Source:** Indian folk tale 

---

## The Story

In a small village, there lived a wise sage named Gyanesh. One day, a young student came to him and said, "Guruji, I have lost my pet mouse somewhere in the village. Please help me find it."

The sage smiled and said, "Let us go search. We will visit every house in the village until we find your mouse. We don't need to visit houses after we've found it."

The sage and the student started their search. They went to the first house — no mouse. The second house — no mouse. The third, fourth, and fifth houses — still no mouse. At the sixth house, the student's eyes lit up. "There it is!" he shouted, pointing to a tiny brown mouse hiding under the bed.

The sage said, "Now that we have found the mouse, we can stop searching. There is no need to visit the remaining houses." And they stopped their search right there, without checking any more houses.

---

## The Bridge

The sage knew that once the goal was achieved, there was no reason to continue. This is exactly what `break` does in a loop — it stops the loop immediately when a condition is met.

| In the story                                        | In Python                         | Why                                             |
| --------------------------------------------------- | --------------------------------- | ----------------------------------------------- |
| "We will visit every house until we find the mouse" | The loop runs through the houses  | The loop was set up to go through all houses.   |
| At the sixth house, the mouse is found              | The `if` condition becomes True   | The condition checks if the mouse is found.     |
| "Now we can stop searching"                         | `break` is executed               | The `break` command exits the loop immediately. |
| They don't visit the remaining houses               | The loop ends right there         | The rest of the iterations are skipped.         |
| The sage had planned to visit all houses            | The loop was prepared to continue | Without the break, the search would continue.   |

---

## The Python Code

```python
houses = ["House 1", "House 2", "House 3", "House 4", "House 5", "House 6", "House 7", "House 8"]
mouse_found = False

for house in houses:
    print("Searching", house)
    if house == "House 6":  # Found the mouse!
        print("Found the mouse!")
        mouse_found = True
        break  # Stop searching immediately
    print("No mouse here.")

print("Search complete!")
```

---

## Check Yourself

**1. Why did the sage and student stop searching at the sixth house?**

* A) They were tired
* B) They found what they were looking for
* C) They ran out of houses to search
* D) They decided the mouse wasn't important

**2. In Python, what does `break` do?**

* A) It pauses the loop and waits for user input
* B) It exits the loop immediately, skipping all remaining iterations
* C) It checks if the loop should continue
* D) It restarts the loop from the beginning

**3. You are reading a long list of names to find your friend's name. Once you find it, you stop reading. Which code should you use?**

* A) `for name in names: if name == "friend": break`
* B) `while True: read_next_name()`
* C) `for name in names: read(name)`
* D) `if "friend" in names: print("found")`

---

## Answer Key

**1. B** — The student found the mouse at the sixth house, so there was no reason to continue searching.

**2. B** — `break` exits the loop immediately, skipping all remaining iterations.

**3. A** — This code searches through the list and stops as soon as the friend's name is found, exactly like the sage's search.
