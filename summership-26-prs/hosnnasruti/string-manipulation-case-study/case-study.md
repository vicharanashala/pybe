# Case Study: The Messy Attendance List

## Scenario

Priya is a class representative. Every week, she has to send the final
attendance list to her professor.

The list starts out fine — but by the time it reaches her, it's been
forwarded through three different WhatsApp groups, copy-pasted twice,
and edited by four different people on four different phones.

By the time it lands in her hands, it looks like this:

```
priya sharma,   Rohit KUMAR ,ANEESH nair,  Divya Menon,rohit kumar ,
  Aneesh Nair,Priya Sharma
```

---

## Challenge

The professor wants one thing: a clean, alphabetically sorted list of
every unique student name, properly capitalized, with no duplicates and
no stray spaces.

Priya could open the message and fix it by hand — deleting extra
spaces, retyping names so the capitalization matches, and manually
checking for repeats. For a class of 8 people, that's tedious but
doable. For a class of 80, it's a nightmare, and she'll definitely
make a mistake somewhere.

---

## Think

Before reading on — if you were Priya, and you could only fix this by
hand, what exact steps would you follow to clean it up? Try to name
each step separately, in order, the way you'd explain it to someone
else doing it for you.

Take a moment to think before reading further.

---

## A Possible Approach

Priya realizes the messy list is really just **one long piece of
text** that needs to go through a few clear, repeatable steps — not
one big fix, but several small, boring, exact operations done one
after another:

1. **Split it apart.** The names are separated by commas, so the
   first step is breaking the one long string into a list of
   individual name-pieces.
2. **Trim each piece.** Each name-piece might have extra spaces stuck
   to the front or back (from someone hitting the spacebar twice), so
   each piece needs its edges cleaned.
3. **Fix the capitalization.** "ANEESH nair" and "Aneesh Nair" need to
   become the *same* text before Priya can compare them — otherwise
   the computer will treat them as two different people.
4. **Remove duplicates.** Once every name looks the same regardless of
   how it was originally typed, repeated names can be dropped.
5. **Put it back in order.** Finally, the cleaned, duplicate-free list
   gets sorted alphabetically and stitched back together into a single
   line, ready to send.

Each of those steps, on its own, is small and mechanical. Python has a
built-in tool for almost every one of them — these are called
**string methods**, and a few of the most common ones map directly
onto what Priya just did by hand:

| What Priya did | Python string method |
|---|---|
| Split the text into pieces by comma | `.split(",")` |
| Remove extra spaces from a piece | `.strip()` |
| Make capitalization consistent | `.title()` (or `.lower()`) |
| Drop duplicates | `set(...)` |
| Put it back together as one line | `", ".join(...)` |

---

## The Code

```python
raw_message = "priya sharma,   Rohit KUMAR ,ANEESH nair,  Divya Menon,rohit kumar ,\n  Aneesh Nair,Priya Sharma"

# Step 1: split the one long string into individual name-pieces
pieces = raw_message.split(",")

# Step 2 + 3: strip stray whitespace, then make capitalization consistent
cleaned_names = [piece.strip().title() for piece in pieces if piece.strip()]

# Step 4: drop duplicates by putting everything into a set
unique_names = set(cleaned_names)

# Step 5: sort alphabetically and join back into one clean line
final_list = ", ".join(sorted(unique_names))

print(final_list)
```

**Output:**
```
Aneesh Nair, Divya Menon, Priya Sharma, Rohit Kumar
```

Four names in, four names out — but now every duplicate, every stray
space, and every inconsistent capitalization has been resolved by five
short, exact operations instead of Priya squinting at a messy WhatsApp
forward and hoping she didn't miss anything.

---

## Why This Matters

This is a common shape of problem in real code: it doesn't look like a
"loop" or an "if statement" at first — it looks like *messy input that
needs cleaning up*. Recognizing that a wall of inconsistent text can
be broken into small, mechanical operations — split, trim, normalize,
deduplicate, reassemble — is a skill that shows up constantly, whether
you're parsing a spreadsheet, reading a log file, or cleaning up form
submissions.
