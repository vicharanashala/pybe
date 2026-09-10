# The Talkative Tortoise — Compound conditions

> **Concept:** Compound conditions · **Difficulty:** Beginner · **Source:** Panchatantra · public domain · original retelling

## The story

A tortoise lived in a lake with two geese for company, and they talked all day, which the tortoise was better at than anything else. Then the rains failed. The lake shrank to mud, and the geese said they would have to leave.

The tortoise could not fly and would not be left behind. So the geese fetched a stick. They would hold each end in their beaks; the tortoise would bite the middle and not let go. One more thing, they said: whatever happens, do not open your mouth.

They rose over the fields. People came out of their houses to look, because a tortoise in the sky is not a thing anyone sees twice. Some of them laughed. Some called up that the geese were clever birds to have thought of it.

The tortoise held the stick and held its tongue for three villages. In the fourth, someone shouted that the geese must have caught their supper. The tortoise opened its mouth to say whose idea it had been.

## The bridge

The tortoise was safe only while two things were true at the same time. Losing either one was enough.

| In the story | In Python | Why |
|---|---|---|
| Its jaws stay clamped on the stick | The first condition | True or false on its own, evaluated independently of anything else. |
| Its mouth stays shut | The second condition | Also true or false on its own — and here, unusually, the same jaws serve both. |
| Both at once, or nothing | and | `A and B` is true only when both parts are. One false part settles the whole expression. |
| It opens its mouth to answer | The condition turns False and the else branch runs | No partial credit. The flight ends the instant the expression stops being true. |

### The same rule, in Python

```python
holding_stick = True
mouth_shut = True

if holding_stick and mouth_shut:
    print("still flying")
else:
    print("falling")

# the fourth village
mouth_shut = False

if holding_stick and mouth_shut:
    print("still flying")
else:
    print("falling")            # falling
```

Read `and` as *both*, and read the `else` as the ground. Python also stops early: if `holding_stick` is False it never bothers to check `mouth_shut`, because the answer is already settled. A tortoise that has let go is falling whether or not it kept quiet.

**Where it breaks:** Writing `or` where you meant `and` gives you a program that mostly works, which is worse than one that fails. `holding_stick or mouth_shut` is true when only the mouth is shut — a tortoise gripping nothing, silently, in the air. Nothing crashes. The answer is simply wrong.

## Check yourself

**1. Find it in the story.** The geese gave the tortoise two conditions. What joins them?

- A) `and` — both had to hold at every moment
- B) `or` — either one was enough
- C) `not` — it only had to avoid one thing
- D) Nothing — they were separate rules, checked at different times

**2. Read the Python.** Which expression describes when the tortoise is safe?

- A)

  ```python
  if holding_stick and mouth_shut:
      print("still flying")
  ```

- B)

  ```python
  if holding_stick or mouth_shut:
      print("still flying")
  ```

- C)

  ```python
  if holding_stick and not mouth_shut:
      print("still flying")
  ```

- D)

  ```python
  if holding_stick and mouth_shut == False:
      print("still flying")
  ```

**3. Somewhere new.** A different situation: a door should unlock only when the badge is valid and the time is within office hours. A colleague writes `if badge_valid or in_office_hours:`. What happens?

- A) It opens for a valid badge at midnight, and for anyone at all during office hours
- B) It never opens, because `or` requires neither condition
- C) It behaves correctly — `and` and `or` are interchangeable here
- D) It raises an error, because two conditions must be joined with `and`

<details><summary>Answer key</summary>

1. **A** — Right. Either one failing ends the flight, which is exactly what `and` means.
2. **A** — Yes. Both parts true, or the else branch runs.
3. **A** — Yes. `or` needs only one part to hold, so each condition alone becomes sufficient. That is two separate holes, not one.

</details>
