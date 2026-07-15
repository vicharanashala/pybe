"""
Piaget's Ladder: Type Protocols and Structural Subtyping Solution

This scenario explores Python's Protocol-based type system, inspired by Jean Piaget's
theory of cognitive development. Piaget observed that children form "schemas" - mental
frameworks for understanding the world. In programming, Protocols serve a similar role:
they define a structural schema that objects can satisfy without explicit inheritance.

Key concepts demonstrated:
- Structural subtyping: an object satisfies a Protocol by implementing required methods
- The `typing.Protocol` class allows static type checkers like mypy to verify compliance
- Duck typing at runtime ("if it has a climb method, it is Climbable") combined with
  static type safety ("mypy will verify this at compile time")
- Runtime vs compile-time type checking trade-offs
"""

from typing import Protocol


class Climbable(Protocol):
    """
    Protocol defining the interface for objects that can climb.

    This Protocol specifies that any type satisfying Climbable must implement
    a `climb(steps: int) -> bool` method. Unlike abstract base classes, there
    is no explicit inheritance - the object implicitly satisfies this Protocol
    just by having the required method.

    In Piaget's terms, this is like a "schema" for climbability: any object
    that has a climb() method with the right signature fits the schema,
    regardless of what class it inherits from.
    """

    def climb(self, steps: int) -> bool:
        """
        Attempt to climb a specified number of steps.

        Args:
            steps: The number of steps to climb upward.

        Returns:
            True if climbing was successful, False otherwise.
        """
        ...


class Ladder:
    """
    A physical ladder - one way to satisfy the Climbable Protocol.

    The Ladder is a concrete tool designed specifically for climbing.
    It has physical properties like material and length that affect its use.

    This class demonstrates that structural subtyping works across
    completely unrelated class hierarchies.
    """

    def __init__(self, material: str, max_height: int):
        """
        Initialize a Ladder with physical properties.

        Args:
            material: The material the ladder is made from (e.g., 'wood', 'aluminum')
            max_height: Maximum height the ladder can reach in meters
        """
        self.material = material
        self.max_height = max_height
        self.height_reached = 0

    def climb(self, steps: int) -> bool:
        """
        Climb a ladder by a number of rungs.

        A ladder provides a safe, structured way to climb. Each rung is
        a predictable distance apart, making climbing straightforward.

        Args:
            steps: Number of rungs to climb up.

        Returns:
            True if the climb was successful and safe.
        """
        # Simulate climbing - each rung adds 0.25m to height
        height_added = steps * 0.25
        if self.height_reached + height_added <= self.max_height:
            self.height_reached += height_added
            print(f"  Climbed {steps} rungs on the {self.material} ladder.")
            print(f"  Current height: {self.height_reached}m / {self.max_height}m")
            return True
        else:
            print(f"  Cannot climb {steps} rungs - would exceed maximum height!")
            return False

    def descend(self, steps: int) -> bool:
        """
        Climb down the ladder (not part of Protocol, but specific to Ladder).
        """
        self.height_reached = max(0, self.height_reached - (steps * 0.25))
        print(f"  Descended {steps} rungs. Now at {self.height_reached}m")
        return True


class Mountain:
    """
    A natural mountain formation - another way to satisfy Climbable.

    Mountains are natural structures that can be climbed, but the experience
    is quite different from using a ladder. Mountains present challenges
    like terrain variation, weather, and altitude that don't apply to ladders.

    Despite these differences, both Ladder and Mountain satisfy the same
    Climbable Protocol - they both implement climb(steps: int) -> bool.
    """

    def __init__(self, name: str, height_meters: int, difficulty: str):
        """
        Initialize a Mountain with its characteristics.

        Args:
            name: The mountain's name (e.g., 'Everest', 'Denali')
            height_meters: The peak height above sea level
            difficulty: Climbing difficulty rating (e.g., 'easy', 'moderate', 'expert')
        """
        self.name = name
        self.height_meters = height_meters
        self.difficulty = difficulty
        self.current_altitude = 0

    def climb(self, steps: int) -> bool:
        """
        Attempt to climb the mountain.

        Mountain climbing is more hazardous and less predictable than ladder climbing.
        Success depends on difficulty level and current altitude.

        Args:
            steps: Number of climbing "segments" completed.

        Returns:
            True if the segment was completed successfully.
        """
        # Mountain climbing is more challenging - altitude gained varies
        # and depends on difficulty rating
        difficulty_multipliers = {
            'easy': 1.0,
            'moderate': 0.8,
            'hard': 0.5,
            'expert': 0.3
        }
        multiplier = difficulty_multipliers.get(self.difficulty, 0.5)
        altitude_gained = steps * 100 * multiplier  # meters per segment

        # Check if we can safely continue
        if self.current_altitude + altitude_gained <= self.height_meters:
            self.current_altitude += altitude_gained
            print(f"  Climbing {self.name} ({self.difficulty}): +{altitude_gained:.0f}m")
            print(f"  Current altitude: {self.current_altitude:.0f}m / {self.height_meters}m")
            return True
        else:
            print(f"  Cannot continue - risk of altitude sickness at {self.current_altitude + altitude_gained}m!")
            return False


class Stairs:
    """
    A building's staircase - yet another Climbable implementation.

    Stairs are architecturally designed for climbing, similar to ladders but
    with different physical properties (fixed step height, enclosed space, etc.)

    This demonstrates that many seemingly different things share the common
    "climbability" property defined by our Protocol.
    """

    def __init__(self, building_name: str, floor_count: int):
        """
        Initialize a staircase.

        Args:
            building_name: The building containing these stairs
            floor_count: Number of floors the stairwell spans
        """
        self.building_name = building_name
        self.floor_count = floor_count
        self.current_floor = 0
        self.HEIGHT_PER_FLOOR = 3.5  # meters

    def climb(self, steps: int) -> bool:
        """
        Climb a number of stairs.

        Args:
            steps: Number of individual stairs to climb.

        Returns:
            True if successful.
        """
        FLOORS_PER_STAIR = 0.02  # Approximately 50 stairs per floor
        floors_gained = steps * FLOORS_PER_STAIR
        new_floor = self.current_floor + floors_gained

        if new_floor <= self.floor_count:
            self.current_floor = new_floor
            print(f"  Climbed {steps} stairs in {self.building_name}")
            print(f"  Now at floor {self.current_floor:.1f} of {self.floor_count}")
            return True
        else:
            print(f"  Cannot climb more - reached top floor!")
            return False


def ascend(target: Climbable, steps: int) -> bool:
    """
    Generic climbing function that works with ANY Climbable object.

    This function demonstrates the power of structural subtyping:
    we don't care what type the object is, only that it has a climb() method
    with the correct signature. Ladder, Mountain, and Stairs are all
    completely different classes, yet we can treat them uniformly.

    In Piaget's cognitive development theory, this is akin to "assimilation":
    new experiences are interpreted through existing schemas. Here, our
    ascend() function has a schema for "things that can be climbed", and
    any object fitting that schema can be used.

    Args:
        target: Any object satisfying the Climbable Protocol
        steps: Number of steps/segments/rungs to climb

    Returns:
        True if the climbing operation was successful.
    """
    print(f"\nAttempting to ascend a {type(target).__name__}...")
    return target.climb(steps)


def demonstrate_structural_subtyping():
    """
    Demonstrate how different classes satisfy the same Protocol.
    """
    print("=" * 70)
    print("PIAGET'S LADDER: Structural Subtyping with Protocols")
    print("=" * 70)

    # Create various climbable objects
    ladder = Ladder(material="aluminum", max_height=10.0)
    mountain = Mountain(name="Mont Blanc", height_meters=4808, difficulty="moderate")
    stairs = Stairs(building_name="Empire State Building", floor_count=102)

    # Collect them in a list - this works because they're all Climbable!
    climbables: list[Climbable] = [ladder, mountain, stairs]

    # Now we can iterate and climb ANY of them with the same function
    print("\n--- Using generic ascend() function with different Climbable types ---")

    for climbable in climbables:
        ascend(climbable, steps=20)

    print("\n--- All objects satisfied the Climbable Protocol! ---")


def show_mypy_verification():
    """
    Information about mypy static type checking for Protocol verification.
    """
    print("\n" + "=" * 70)
    print("MYPY TYPE CHECKING VERIFICATION")
    print("=" * 70)
    print("""
To verify type safety with mypy, run:

    mypy piagets_ladder_solution.py --strict

The Protocol definition ensures that:
1. Any object passed to ascend() must have climb(steps: int) -> bool
2. The type checker catches violations BEFORE runtime
3. Documentation is enforced through the Protocol signature

Example mypy output for INVALID code:
    error: Argument 1 to "ascend" has incompatible type "str"; expected "Climbable"

This static verification is the key advantage of using Protocols over
pure duck typing at runtime.
""")


class InvalidClimber:
    """
    A class that does NOT satisfy Climbable - demonstrates Protocol enforcement.

    This class has a 'climb' method but with the WRONG signature
    (different parameter name and no return type annotation), so mypy
    would correctly flag it as not satisfying the Protocol.
    """

    def climb(self, number_of_steps: int) -> str:  # Wrong return type!
        return "climbed"


if __name__ == "__main__":
    demonstrate_structural_subtyping()
    show_mypy_verification()

    print("\n" + "=" * 70)
    print("PROTOCOL VS ABSTRACT BASE CLASS COMPARISON")
    print("=" * 70)
    print("""
Key Differences:

1. INHERITANCE:
   - ABC: Requires explicit inheritance from the ABC
   - Protocol: No inheritance needed, just implement the methods

2. STATIC TYPE CHECKING:
   - ABC: mypy can verify inheritance relationships
   - Protocol: mypy verifies structural compliance (more flexible)

3. RUNTIME BEHAVIOR:
   - ABC: isinstance() checks work
   - Protocol: No runtime type checking (purely static)

4. USE CASE:
   - ABC: When you control the class hierarchy
   - Protocol: When working with unrelated classes or external libraries

Example where Protocol shines:
    # Ladder and Mountain come from different libraries
    # You can't make them both inherit from your ABC
    # But you CAN create a Climbable Protocol and use both!

    def ascend_all(objects: list[Climbable]) -> None:
        for obj in objects:
            obj.climb(10)
""")