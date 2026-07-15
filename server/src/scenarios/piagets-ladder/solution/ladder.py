from typing import Protocol

class Climbable(Protocol):
    def climb(self, steps: int) -> bool:
        ...

class Ladder:
    def __init__(self, max_steps: int):
        self.max_steps = max_steps
        
    def climb(self, steps: int) -> bool:
        if steps <= self.max_steps:
            print(f"Climbed {steps} steps up the ladder.")
            return True
        print(f"Cannot climb {steps} steps. Ladder only has {self.max_steps} steps.")
        return False

class Mountain:
    def climb(self, steps: int) -> bool:
        print(f"Trekking {steps} steps up the mountain path.")
        return True

def ascend(target: Climbable, steps: int) -> bool:
    """
    Ascend any target that conforms to the Climbable protocol.
    """
    return target.climb(steps)

if __name__ == "__main__":
    my_ladder = Ladder(max_steps=10)
    my_mountain = Mountain()
    
    # Both objects work with ascend() because they structurally match the Protocol
    ascend(my_ladder, 5)
    ascend(my_mountain, 500)
    
    # Mypy will accept this code without issue.
