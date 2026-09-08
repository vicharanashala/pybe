# 6 else with Loops

**The Merchant and the Golden Necklace**

**Concept:** else with Loops
**Difficulty:** Intermediate
**Source:** Indian folk tale 

---

## The Story

In a bustling marketplace, a wealthy merchant named Dhanraj lost his precious golden necklace. He announced to his servants, "Search every room of my house thoroughly. If you find the necklace, bring it to me. But if you search all the rooms and do not find it, come back and report that it is truly lost."

The servants began searching. They searched the kitchen — no necklace. The bedroom — no necklace. The courtyard — no necklace. The dining hall — no necklace. Room after room, they searched.

Finally, they had searched every single room in the house. The necklace was nowhere to be found. When they finished the search without finding it, they returned to the merchant and said, "Sir, we have searched every room, but the necklace is not here. It is truly lost."

The merchant sighed, "Then it must have been stolen. Let us report it to the king's guards."

---

## The Bridge

The servants had a clear plan: search all rooms, and if they find it, stop and report. But if they search all rooms and find nothing, then report that it's lost. This is exactly how `else` works with a loop — the `else` block runs only when the loop completes without encountering a `break`.

| In the story                                     | In Python                            | Why                                            |
| ------------------------------------------------ | ------------------------------------ | ---------------------------------------------- |
| "Search every room"                              | The loop                             | The loop goes through each room.               |
| "If you find it, bring it to me"                 | `break` when found                   | Stop searching when found.                     |
| "If you search all rooms and don't find it"      | The loop completes without `break`   | All iterations run without interruption.       |
| "Come back and report it is lost"                | The `else` block runs                | This runs only when no `break` occurred.       |
| The servants searched all rooms before reporting | The `else` runs after all iterations | It only runs when the loop finishes naturally. |

---

## The Python Code

```python id="n8q2vk"
rooms = ["Kitchen", "Bedroom", "Courtyard", "Dining Hall", "Garden"]
necklace_found = None

for room in rooms:
    print("Searching", room)
    if room == "Garden":  # If found in Garden
        print("Found the necklace in the garden!")
        necklace_found = True
        break
else:
    # This runs if the loop completes without finding the necklace
    print("Searched all rooms. The necklace is truly lost.")

if necklace_found:
    print("Report: Necklace found!")
else:
    print("Report: Necklace is lost. Contact the king's guards.")
```

---

## Check Yourself

**1. When did the servants report that the necklace was lost?**

* A) When they found it in the garden
* B) After searching all rooms and not finding it
* C) Before they started searching
* D) After searching only half the rooms

**2. In Python, when does the `else` block run with a loop?**

* A) Always, after every loop
* B) Only when a `break` occurs
* C) Only when the loop completes without a `break`
* D) Never — `else` doesn't work with loops

**3. You are checking a list of students to see if any have scored 100%. If you find one, stop and announce the winner. If you check everyone and no one has 100%, announce that no one got a perfect score. Which structure should you use?**

* A) A for loop with `else` for the "no one" case
* B) Two separate loops
* C) A while loop with `break`
* D) An if statement after the loop

---

## Answer Key

**1. B** — The servants reported the necklace was lost only after searching every room and finding nothing.

**2. C** — The `else` block runs only when the loop completes all iterations without encountering a `break`.

**3. A** — The for loop with `else` is perfect for this: the `else` runs if no perfect score is found and no `break` occurs.
