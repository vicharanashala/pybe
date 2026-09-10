# The Crows and the Serpent — Imports and built-ins

> **Concept:** Imports and built-ins · **Difficulty:** Explorer · **Source:** Panchatantra · public domain · original retelling

## The story

A pair of crows nested in a tree by a temple, and every season a black serpent came up the trunk and ate their eggs. The crows attacked it once. What they learned was that they could do nothing to it at all.

They went to a jackal they knew and told him. The jackal thought about it and said the problem was not that the serpent was strong. The problem was that they had been trying to solve it with beaks.

Fly to the lake where the king's women bathe, he said, and take the gold necklace one of them leaves on the bank. Do not be quiet about it. Let the guards see you carry it, and drop it into the hollow at the foot of your tree.

The crows did exactly that. The guards followed the necklace to the hollow, found the serpent coiled around it, and killed it with the sticks they were already carrying. The crows had not touched the snake.

## The bridge

The crows solved the problem without gaining a single new ability. They called in something that already existed and already worked.

| In the story | In Python | Why |
|---|---|---|
| What a crow can do with its own beak | The built-ins — print(), len(), max() | Always in reach, no import needed. Python hands you these the moment it starts. |
| The jackal's advice | The import statement | One line that brings a capability you did not write into reach. It does not create the guards; it points you at them. |
| The guards, already armed and trained | The module's functions | Written, tested and used by many people before you. Calling one is far cheaper than becoming one. |
| The serpent dealt with | The result of the call | The problem is solved by code you never wrote and do not have to maintain. |

### The same rule, in Python

```python
# already in reach — nothing to import
print(len([3, 1, 4, 1, 5]))      # 5
print(max([3, 1, 4, 1, 5]))      # 5

# not in reach until you say so
import math
import random

print(math.sqrt(144))            # 12.0
print(random.choice(["crow", "serpent", "jackal"]))

# or bring in one name instead of the whole module
from statistics import mean
print(mean([3, 1, 4, 1, 5]))     # 2.8
```

`import math` is the jackal telling the crows that the guards exist. `math.sqrt(144)` is the guards arriving. Keeping the dotted name is worth something: six months later it still says where that capability came from.

**Where it breaks:** `from math import *` drags every name in the module into your file at once. If any of them collide with names of your own, yours are quietly replaced and the error surfaces somewhere else entirely. Name the module, or name the one function you want. The guards will do the job — and they will also take the necklace back. A dependency arrives with everything it carries, not only the part you asked for.

## Check yourself

**1. Find it in the story.** In the story, what plays the role of an import statement?

- A) The jackal's advice — the thing that puts the guards within reach
- B) The guards killing the serpent
- C) The crows attacking the serpent themselves
- D) The necklace

**2. Read the Python.** Which line lets you write `sqrt(144)` with no `math.` in front of it?

- A) from math import sqrt
- B) import math
- C) import sqrt from math
- D) include math.sqrt

**3. Somewhere new.** A different situation: you need to generate a secure random password. You could write your own shuffling logic in about thirty lines. What should you do?

- A) Use the `secrets` module from the standard library
- B) Write the thirty lines — fewer dependencies is always safer
- C) Use `random.choice()`, since `random` is already imported in that file
- D) Copy a snippet from the first search result and move on

<details><summary>Answer key</summary>

1. **A** — Right. It does not create the capability. It connects the crows to one that already existed.
2. **A** — Yes. This brings the one name directly into your file, so you call it unqualified.
3. **A** — Yes. It is already written, and for anything security-shaped its authors have considered attacks you have not. Thirty lines of your own is thirty lines of new risk.

</details>
