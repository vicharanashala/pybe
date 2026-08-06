# The Frog in the Well — Scope: local and global

> **Concept:** Scope: local and global · **Difficulty:** Explorer · **Source:** Indian parable · public domain · original retelling

## The story

A frog was born in a well and lived its whole life there. It knew the wall, the water, the ring of sky overhead, and the insects that fell in. It had measured the well end to end and found it large.

One day a frog from the sea fell in. The well frog asked where it had come from. The sea, said the visitor. The well frog leapt from one wall to the other and asked whether the sea was that big.

Bigger, said the visitor. The well frog swam a full circle around the water and asked whether the sea was that big. Bigger, said the visitor, and could not explain how much bigger, because there was nothing in the well to compare it to.

The well frog decided its guest was a liar and went back to counting insects. It was not stupid. It had simply never been given a name for anything outside its own walls.

## The bridge

The frog was not wrong about the well. It was wrong about the well being everything. Every name it had was a name that only existed inside those walls.

| In the story | In Python | Why |
|---|---|---|
| The inside of the well | A function's local scope | Names created in here exist in here. They are made when the function runs and gone when it returns. |
| The world outside the well | The global (module) scope | Names defined at the top level of the file. They exist for the whole run of the program. |
| The frog can hear about the sea | A function can read a global | Looking outward is allowed. Python checks local names first, then enclosing ones, then globals. |
| The sea cannot see into the well | Code outside cannot read a local | Ask for a name that only ever existed inside the function and you get a NameError. Out here it was never created. |

### The same rule, in Python

```python
sea = "very large"              # global — the world outside the well

def in_the_well():
    wall_to_wall = "two hops"   # local — made when this runs, gone when it ends
    print("I have heard of the", sea)     # looking outward is allowed
    print("the well is", wall_to_wall)

in_the_well()

print(sea)                      # very large
print(wall_to_wall)             # NameError: name 'wall_to_wall' is not defined
```

`wall_to_wall` is created when `in_the_well()` starts and destroyed when it ends. The last line is the sea trying to look down into the well: from out here, that name never existed at all.

**Where it breaks:** Assigning to a name anywhere inside a function makes it local for the *whole* function, including lines above the assignment. So `def f(): print(sea); sea = "small"` raises `UnboundLocalError` on the print — Python decided `sea` was local the moment it saw the assignment, and the global became unreachable from inside. If you genuinely mean to change the outer one, say `global sea`; usually you want to return a value instead.

## Check yourself

**1. Find it in the story.** What does the inside of the well correspond to?

- A) A function's local scope — names that exist only while it is running
- B) The whole program
- C) A single variable
- D) A comment at the top of the file

**2. Read the Python.** What happens when this runs?

- A)

  ```python
  def well():
      depth = 3
      print(depth)
  
  well()
  print(depth)
  
  # prints 3, then raises NameError
  ```

- B)

  ```python
  def well():
      depth = 3
      print(depth)
  
  well()
  print(depth)
  
  # prints 3, then 3
  ```

- C)

  ```python
  def well():
      depth = 3
      print(depth)
  
  well()
  print(depth)
  
  # raises NameError on the first print
  ```

- D)

  ```python
  def well():
      depth = 3
      print(depth)
  
  well()
  print(depth)
  
  # prints nothing; both lines are skipped
  ```

**3. Somewhere new.** A different situation: you write a function that reads a config file and sets `api_key` inside it. Code at the bottom of the file then uses `api_key` and crashes with NameError. Why?

- A) The function created `api_key` in its own local scope, so it never existed outside
- B) The config file was empty, so `api_key` was never assigned
- C) You must declare `api_key` at the top of the file before any function can use it
- D) Functions cannot create variables, only read them

<details><summary>Answer key</summary>

1. **A** — Right. The well is a world with its own names, created when you enter it and gone when you leave.
2. **A** — Right. `depth` exists only while `well()` is running. Outside it, that name was never created.
3. **A** — Yes. Assigning inside a function makes a local name. To get the value out, `return` it and bind it to a name outside.

</details>
