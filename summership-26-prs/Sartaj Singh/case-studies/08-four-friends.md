# The Four Friends — Functions

> **Concept:** Functions · **Difficulty:** Explorer · **Source:** Panchatantra · public domain · original retelling

## The story

A deer, a crow, a mouse and a tortoise lived near the same water and were friends, which is unusual. They were friends because each of them could do one thing well and none of them could do all four.

The crow saw far, from high up. The mouse could cut through anything with its teeth. The tortoise was slow but hard to hurt. The deer could outrun anything in the forest, and did, until the afternoon it ran into a hunter's net.

The crow found it, because finding things was what the crow did. It fetched the mouse. The mouse gnawed through the net's cords, one after another, and the deer stepped out of it.

The tortoise had come too, slowly, and was still in the open when the hunter returned. So the mouse was called again, and did the same work on the sack the tortoise had been put in. It had not needed to learn anything new.

## The bridge

Each animal is one job, written down once, called by name when it is needed. The mouse's second rescue is the whole reason functions exist.

| In the story | In Python | Why |
|---|---|---|
| What one animal is good at | The function body | The steps that run when it is called. Written once, in one place. |
| Calling on that animal by name | The call — gnaw() | Naming it makes it run. The describing was done earlier and separately. |
| Telling it which trap, and where | The parameters | Called with the net, called later with the sack. Same steps, different input. |
| The freed animal walking away | The return value | What the call hands back to whoever asked for it. |

### The same rule, in Python

```python
def spot(area):
    print("the crow searches the", area)
    return "the deer, in a net"

def gnaw(trap):
    """The mouse's one skill. Written down once."""
    print("the mouse cuts through the", trap)
    return "freed"

found = spot("north field")     # the crow's job
print(found)

gnaw("net")                     # the first rescue
gnaw("sack")                    # the second, same function
```

`def gnaw(trap):` is the mouse being able to gnaw. `gnaw("net")` is somebody calling for the mouse. The last two lines are the point of the tale and the point of functions: the skill was written down once and used twice, on two different traps, with nothing rewritten in between.

**Where it breaks:** Defining a function does not run it. `def gnaw(trap):` on its own frees nobody — the body waits until some line says `gnaw("net")`. Forgetting the call, or writing `gnaw` without the brackets, is the most common way a function appears to do nothing at all: Python evaluates the name, gets the function object back, and quietly discards it.

## Check yourself

**1. Find it in the story.** What corresponds to *defining* a function, as opposed to calling one?

- A) The mouse being able to gnaw, before anyone has asked it to
- B) The crow flying off to fetch the mouse
- C) The deer stepping out of the net
- D) The four animals being friends

**2. Read the Python.** The mouse frees the deer from a net, then the tortoise from a sack. Which code says that?

- A)

  ```python
  def gnaw(trap):
      ...
  
  gnaw("net")
  gnaw("sack")
  ```

- B)

  ```python
  def gnaw_net():
      ...
  
  def gnaw_sack():
      ...
  
  gnaw_net()
  gnaw_sack()
  ```

- C)

  ```python
  def gnaw(trap):
      ...
  
  gnaw
  gnaw
  ```

- D)

  ```python
  gnaw("net")
  gnaw("sack")
  
  def gnaw(trap):
      ...
  ```

**3. Somewhere new.** A different situation: three screens in your app each format a price as ₹1,234.50, and each one has its own copy of the same three lines. What does the mouse suggest?

- A) One `format_price(amount)` function, called from all three screens
- B) Copy the three lines again when you build the fourth screen
- C) A variable holding the formatted price, shared between the screens
- D) Nothing — three lines is too short to be worth a function

<details><summary>Answer key</summary>

1. **A** — Right. The skill exists and is written down. Nothing happens until something asks for it.
2. **A** — Yes. One definition, two calls, the trap passed in as a parameter. Nothing is rewritten.
3. **A** — Yes. Write the steps once and call them wherever needed. When the format changes, it changes in exactly one place.

</details>
