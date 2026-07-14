"""Few-shot anchor for case-study generation (locked content).

Pulled from PROJECT_BLUEPRINT.md §12.5 verbatim. The fun-fact was
fact-checked during the Phase-0 patch:
- @ syntax landed in Python 2.4 via PEP 318 (2004)
- The community weighed ``[[decorate]]``, ``|decorate|``,
  ``def foo() as bar:``, and ``apply decorate``
- Guido settled on ``@`` because it reads as "at" and sits above the
  line like a hat.
"""

from __future__ import annotations

# --- begin: few-shot-case-study ------------------------------------------
FEW_SHOT_CASE_STUDY = """Example of a pass-grade case study (for tone, NOT content):
{
  "title": "The Saree Loom That Wove Itself",
  "concept": "Decorators",
  "difficulty": "novice",
  "scenario": "In Varanasi, master weavers finish a Banarasi silk by weaving a
   zari border AROUND the existing cloth — they never unravel a single thread.
   Python decorators work the same way: they wrap a function with extra behaviour
   without touching its source.",
  "task": "Wrap `greet(name)` with a `@border` decorator that prints '=' * 20
   before and after the call. Write the decorator yourself — do not use
   `functools.wraps` yet.",
  "starter_code": "def greet(name):\n    print(f\"hello {name}\")",
  "expected_output": "====================\nhello aditya\n====================",
  "real_world_analogy": "A saree's zari border is woven last. The body of the
   cloth is never torn open. Decorators add a 'border' to a function without
   editing its body. The Python core team chose the @ syntax deliberately —
   it reads as 'this function, but dressed up'.",
  "fun_fact": "The @ syntax landed in Python 2.4 via PEP 318 (2004) after a
   four-month python-dev debate. The community weighed [[decorate]],
   |decorate|, the `def foo() as bar:` form, and `apply decorate` before
   Guido settled on @. His stated reason (on the python-dev list):
   it reads as 'at' and visually sits ABOVE the line, like a hat — a
   small symbol that doesn't crowd the function signature.",
  "hints": [
    "A decorator is just a function that takes a function and returns a function.",
    "Inside your decorator, define an inner function and call the original there.",
    "Print '=' * 20 before and after you call the original function."
  ],
  "learning_objective": "Understand that a decorator is a higher-order function
   that transparently augments another function's behaviour."
}
"""

# --- end: few-shot-case-study --------------------------------------------
