# Case Study: Finding Your Row in a Dark Movie Theater

## Scenario

Raghav is watching a movie in a very large theater.

Suddenly, there is a complete power failure, and the theater becomes completely dark. Nothing is visible.

After a few moments, an announcement is made:

> **"Please remain seated. The emergency lights will turn on shortly."**

While waiting, Raghav becomes curious.

> **"Which row am I sitting in?"**

Unfortunately,

- Raghav cannot see anything.
- Raghav cannot leave his seat.
- Raghav cannot count the rows himself.
- The only person he can communicate with is the person sitting directly in front of him.
- Every person can communicate only with the person sitting directly in front of them.

---

## Challenge

How can Raghav find out his row number?

---

## Think

If you were in Raghav's place, how would you find your row number?

Take a moment to think before reading further.

---

## A Possible Approach

Raghav asks the person sitting directly in front of him:

> **"What row are you sitting in?"**

The person in front does not know their row number either. So they ask the person sitting directly in front of them the same question. Then, they wait. Every person who asks a question must sit and wait until they get an answer back.

This process continues until the question reaches the person sitting in the first row.

---

## Will This Process Ever Stop?

Yes.

When the process reaches the person in the very front, they reach their hand forward to tap the next shoulder, but they feel only empty air.

Because there is no chair and no person in front of them, they do not ask the question. They immediately reply:

> "I am sitting in Row 1."
---

## Getting the Answer

The answer now starts travelling backwards.

- Row 1 tells Row 2, **"I am in Row 1."**
- Row 2 says, **"Then I must be in Row 2,"** and tells Row 3.
- Row 3 says, **"Then I must be in Row 3,"** and tells Row 4.

This continues until the person sitting directly in front of Raghav says:

> **"I am in Row 11."**

Raghav immediately knows:

> **"Then I must be in Row 12."**

---
 
## Reflection
What did you notice about this solution?

- Did everyone follow the same steps?
- Did everyone solve the same kind of problem?
- What caused the process to stop?
- Why did everyone have to wait before answering?

## Summary

Every person followed exactly the same strategy:

1. Try to determine your own row number.
2. If you already know it, tell the person behind you.
3. Otherwise, ask the person sitting directly in front of you for their row number.
4. Once you know their row number, add **1** to determine your own row number.
5. Tell your answer to the person behind you.

Notice that every person solved **the same problem** in exactly the same way. The only difference was their position in the theater.