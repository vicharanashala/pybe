You are writing the firmware for a Smart Traffic Light. The city requires the system to be flawlessly deterministic—it must never transition from Green straight to Red, nor can it hold invalid states like "Blue".

Task 1: Define an Enumeration called `TrafficColor` using Python's `enum` module. It should contain `RED`, `YELLOW`, and `GREEN`. Use `auto()` for the values if you wish, or assign them string names.

Task 2: Create a `TrafficLight` class that tracks its `current_color`. It must start at `TrafficColor.RED`.

Task 3: Implement the `next_state()` method. It should transition the light following the standard cycle: RED -> GREEN -> YELLOW -> RED. Use Python's `match/case` statement (or standard if/elif) to handle the transitions. If the light is somehow in an unrecognized state, raise a `ValueError`.
