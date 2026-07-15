from enum import Enum, auto

class TrafficColor(Enum):
    RED = auto()
    YELLOW = auto()
    GREEN = auto()

class TrafficLight:
    def __init__(self):
        self.current_color = TrafficColor.RED

    def next_state(self):
        match self.current_color:
            case TrafficColor.RED:
                self.current_color = TrafficColor.GREEN
            case TrafficColor.GREEN:
                self.current_color = TrafficColor.YELLOW
            case TrafficColor.YELLOW:
                self.current_color = TrafficColor.RED
            case _:
                raise ValueError(f"Unknown state encountered: {self.current_color}")

if __name__ == "__main__":
    light = TrafficLight()
    print("Initial State:", light.current_color.name)
    
    for _ in range(4):
        light.next_state()
        print("Transitioned to:", light.current_color.name)
