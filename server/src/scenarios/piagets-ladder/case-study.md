In Piaget's theory of cognitive development, humans learn to group objects by their structural properties. To a child, a ladder, a staircase, and a mountain might all belong to a schema called "Things I can climb".

In modern Python, we represent this schema using a `Protocol` for structural subtyping.

Task 1: Import `Protocol` from the `typing` module. Define a protocol named `Climbable`. It should specify a single method signature: `climb(self, steps: int) -> bool`.

Task 2: Create a class `Ladder` and a class `Mountain`. They should **not** inherit from `Climbable` or any other base class. However, they must both implement the `climb` method with the exact signature specified.

Task 3: Write a standalone function `ascend(target: Climbable, steps: int) -> bool` that calls the `climb` method on the target and returns the result.

Task 4: Add type hints to all methods and functions so that a static type checker like `mypy` can verify that `Ladder` and `Mountain` are indeed `Climbable`.
