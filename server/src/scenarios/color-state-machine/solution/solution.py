"""
The Color State Machine - Reference Solution
=============================================
Domain: Systems Engineering / Embedded Systems

Target Constructs:
- Enum class with auto()
- State machine pattern
- match/case (structural pattern matching)
- Deterministic state transitions

This solution demonstrates how a traffic light controller implements a
finite state machine. Enums ensure only valid states exist, while
match/case enforces the deterministic transition rules: Red -> Green,
Green -> Yellow, Yellow -> Red.
"""

from enum import Enum, auto
from typing import Dict, Optional


class TrafficColor(Enum):
    """
    Traffic light colors as an enumeration.

    Using Enum prevents 'magic strings' and ensures type safety.
    Each color is a valid state of the finite state machine.

    The order RED, YELLOW, GREEN matters for our state machine
    transition rules.
    """
    RED = auto()
    YELLOW = auto()
    GREEN = auto()

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}.{self.name}"


class InvalidTransitionError(Exception):
    """Raised when an invalid state transition is attempted."""
    pass


class TrafficLight:
    """
    A traffic light controller implementing a finite state machine.

    A traffic light is the classic state machine example:
    - It can only be in one state at a time (RED, YELLOW, or GREEN)
    - Transitions follow strict rules:
        RED -> GREEN (after red, traffic can go)
        GREEN -> YELLOW (preparing to stop)
        YELLOW -> RED (completing the stop)
    - No direct transitions like RED -> YELLOW are allowed

    The state machine ensures deterministic, predictable behavior
    critical for traffic safety.
    """

    VALID_TRANSITIONS: Dict[TrafficColor, TrafficColor] = {
        TrafficColor.RED: TrafficColor.GREEN,
        TrafficColor.GREEN: TrafficColor.YELLOW,
        TrafficColor.YELLOW: TrafficColor.RED,
    }

    def __init__(self, initial_state: TrafficColor = TrafficColor.RED):
        """
        Initialize the traffic light.

        Args:
            initial_state: The starting state (defaults to RED for safety)
        """
        self._state = initial_state
        self._transition_count = 0
        print(f"[TrafficLight] Initialized with state: {self._state}")

    @property
    def state(self) -> TrafficColor:
        """Get the current state of the traffic light."""
        return self._state

    def next_state(self) -> TrafficColor:
        """
        Transition to the next valid state.

        Uses match/case (structural pattern matching) to handle each
        possible state. This ensures the transition logic is exhaustive
        and compiler-checkable.

        Returns:
            The new state after transition

        Raises:
            InvalidTransitionError: If somehow an invalid state is encountered
        """
        current = self._state

        match current:
            case TrafficColor.RED:
                new_state = TrafficColor.GREEN
            case TrafficColor.GREEN:
                new_state = TrafficColor.YELLOW
            case TrafficColor.YELLOW:
                new_state = TrafficColor.RED
            case _:
                raise InvalidTransitionError(f"Unknown state: {current}")

        old_state = self._state
        self._state = new_state
        self._transition_count += 1

        print(f"[TrafficLight] Transition #{self._transition_count}: "
              f"{old_state.name} -> {new_state.name}")

        return new_state

    def get_next_states(self) -> Dict[str, Optional[TrafficColor]]:
        """
        Get all possible next states (for UI display).

        Returns:
            Dictionary mapping current state to next state
        """
        return {
            "next_state": self.VALID_TRANSITIONS.get(self._state),
            "all_transitions": self.VALID_TRANSITIONS.copy()
        }

    def reset(self) -> None:
        """Reset the traffic light to RED."""
        self._state = TrafficColor.RED
        self._transition_count = 0
        print("[TrafficLight] Reset to RED")


class PedestrianCrossing:
    """
    A pedestrian crossing signal with its own state machine.

    This extends the traffic light concept to a pedestrian crossing,
    demonstrating that state machines can be composed and extended.
    """

    class CrossState(Enum):
        DONT_WALK = auto()
        WALK = auto()
        FLASH = auto()

    def __init__(self):
        self._state = self.CrossState.DONT_WALK

    @property
    def state(self) -> CrossState:
        return self._state

    def button_pressed(self) -> CrossState:
        """
        Handle the pedestrian button press.

        State transitions:
        DONT_WALK -> WALK (when pressed)
        WALK -> FLASH (after timer)
        FLASH -> DONT_WALK (flashing complete)

        Returns:
            The new state
        """
        match self._state:
            case self.CrossState.DONT_WALK:
                self._state = self.CrossState.WALK
            case self.CrossState.WALK:
                self._state = self.CrossState.FLASH
            case self.CrossState.FLASH:
                self._state = self.CrossState.DONT_WALK

        print(f"[PedestrianCrossing] State: {self._state.name}")
        return self._state


def demonstrate_basic_traffic_light() -> None:
    """Demonstrate the basic traffic light state machine."""
    print("\n" + "=" * 60)
    print("TRAFFIC LIGHT: Basic State Machine")
    print("=" * 60)

    light = TrafficLight(TrafficColor.RED)

    print(f"\nCurrent state: {light.state.name}")

    print("\n* Simulating one full cycle: RED -> GREEN -> YELLOW -> RED *")

    light.next_state()
    print(f"  After next_state(): {light.state.name}")

    light.next_state()
    print(f"  After next_state(): {light.state.name}")

    light.next_state()
    print(f"  After next_state(): {light.state.name}")

    print(f"\nTotal transitions: {light._transition_count}")


def demonstrate_match_case() -> None:
    """Demonstrate the match/case pattern matching in state transitions."""
    print("\n" + "=" * 60)
    print("MATCH/CASE: Structural Pattern Matching")
    print("=" * 60)

    print("\n* Match expressions handle each state explicitly *")

    states = [TrafficColor.RED, TrafficColor.GREEN, TrafficColor.YELLOW]

    for state in states:
        match state:
            case TrafficColor.RED:
                print(f"  {state.name}: Stop! All vehicles must halt.")
            case TrafficColor.YELLOW:
                print(f"  {state.name}: Caution! Prepare to stop.")
            case TrafficColor.GREEN:
                print(f"  {state.name}: Go! Traffic may proceed.")

    print("\n* State transition logic via match/case *")

    def describe_transition(from_state: TrafficColor, to_state: TrafficColor) -> str:
        """
        Describe a state transition using pattern matching.

        Args:
            from_state: Starting state
            to_state: Ending state

        Returns:
            Human-readable description
        """
        match (from_state, to_state):
            case (TrafficColor.RED, TrafficColor.GREEN):
                return "Red light ending, traffic may now proceed"
            case (TrafficColor.GREEN, TrafficColor.YELLOW):
                return "Green ending, prepare to stop"
            case (TrafficColor.YELLOW, TrafficColor.RED):
                return "Yellow ending, light is now red"
            case _:
                return f"Transition from {from_state.name} to {to_state.name}"

    transitions = [
        (TrafficColor.RED, TrafficColor.GREEN),
        (TrafficColor.GREEN, TrafficColor.YELLOW),
        (TrafficColor.YELLOW, TrafficColor.RED),
    ]

    for from_s, to_s in transitions:
        print(f"  {from_s.name} -> {to_s.name}: {describe_transition(from_s, to_s)}")


def demonstrate_state_machine_safety() -> None:
    """
    Demonstrate how the state machine prevents invalid transitions.

    Unlike a simple counter that could go 0->1->2->3->0->etc,
    a state machine enforces valid transitions only.
    """
    print("\n" + "=" * 60)
    print("STATE MACHINE SAFETY: Preventing Invalid Transitions")
    print("=" * 60)

    light = TrafficLight()

    print("\n* Valid transition sequence: *")
    print("  RED -> GREEN (valid: red allows traffic to go)")
    print("  GREEN -> YELLOW (valid: green precedes yellow)")
    print("  YELLOW -> RED (valid: yellow precedes red)")

    print("\n* What the state machine prevents: *")
    print("  RED -> YELLOW would be INVALID (skipping green)")
    print("  GREEN -> RED would be INVALID (skipping yellow)")
    print("  YELLOW -> GREEN would be INVALID (skipping red)")

    print("\n* The state machine only allows one path: *")
    print("  RED -> GREEN -> YELLOW -> RED -> (repeat)")

    light.reset()
    print("\n* Running 6 transitions to show the cycle repeats: *")
    for i in range(6):
        light.next_state()

    print(f"\nCurrent state after 6 transitions: {light.state.name}")
    print("  (6 mod 3 = 0, so we're back to RED)")


def demonstrate_pedestrian_crossing() -> None:
    """Demonstrate a second state machine for pedestrian crossing."""
    print("\n" + "=" * 60)
    print("PEDESTRIAN CROSSING: Composed State Machine")
    print("=" * 60)

    crossing = PedestrianCrossing()

    print(f"\nInitial state: {crossing.state.name}")
    print("  (Pedestrians must wait)")

    print("\n* Pedestrian presses button... *")
    crossing.button_pressed()

    print("\n* Timer expires... *")
    crossing.button_pressed()

    print("\n* Flashing complete... *")
    crossing.button_pressed()

    print(f"\nBack to: {crossing.state.name}")


def demonstrate_enum_benefits() -> None:
    """Show why Enums are valuable for state machines."""
    print("\n" + "=" * 60)
    print("ENUM BENEFITS: Type Safety in State Machines")
    print("=" * 60)

    print("\n* Without Enum (magic strings): *")
    print('  state = "RED"  # Typo would go unnoticed')
    print('  state = "BLUE"  # Invalid but no error')

    print("\n* With Enum: *")
    print("  state = TrafficColor.RED  # Always valid")
    print("  state = TrafficColor.YELLOW  # Compiler/checker catches typos")

    colors = list(TrafficColor)
    print(f"\n* All valid states: {[c.name for c in colors]} *")

    print(f"\n* Enum comparison: TrafficColor.RED == TrafficColor.RED: "
          f"{TrafficColor.RED == TrafficColor.RED}")

    print(f"* Hashable for dict keys: {TrafficColor.RED in {TrafficColor.RED: 'stop'}}")

    print("\n* Iteration over all states: *")
    for color in TrafficColor:
        print(f"  - {color.name} = {color.value}")


if __name__ == "__main__":
    print("=" * 60)
    print("COLOR STATE MACHINE: Traffic Light Controller")
    print("=" * 60)

    demonstrate_basic_traffic_light()

    demonstrate_match_case()

    demonstrate_state_machine_safety()

    demonstrate_pedestrian_crossing()

    demonstrate_enum_benefits()

    print("\n" + "=" * 60)
    print("KEY INSIGHT: A state machine constrains a system to valid")
    print("states and transitions. The Enum ensures only RED, YELLOW,")
    print("GREEN exist. The match/case statement enforces the rules:")
    print("RED->GREEN, GREEN->YELLOW, YELLOW->RED. No skipping allowed.")
    print("This determinism is critical for safety-critical systems.")
    print("=" * 60)