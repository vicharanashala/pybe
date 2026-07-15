"""
json_persistence.py JSON Checkpoint Pattern (Horcrux as JSON)
================================================================
Like Voldemort splitting his soul into objects for immortality,
json.dump() splits your program's state into a file that survives
after the process dies. json.load() resurrects it.

JSON is human-readable, language-agnostic, and safe but limited
to basic types (no custom classes, no bytes).
"""

import json
import os
import time


class GameState:
    """
    Represents game progress that needs to be saved/loaded.
    Think of each save as a "horcrux" a piece of state that
    lets the game resurrect from exactly where it left off.
    """
    
    def __init__(self, player_name, level=1, health=100, inventory=None, score=0):
        self.player_name = player_name
        self.level = level
        self.health = health
        self.inventory = inventory or []
        self.score = score
        self.save_timestamp = None
    
    def to_dict(self):
        """Convert state to a JSON-serializable dictionary."""
        return {
            'player_name': self.player_name,
            'level': self.level,
            'health': self.health,
            'inventory': self.inventory,
            'score': self.score,
            'save_timestamp': time.time(),
        }
    
    @classmethod
    def from_dict(cls, data):
        """Resurrect a GameState from a dictionary."""
        state = cls(
            player_name=data['player_name'],
            level=data['level'],
            health=data['health'],
            inventory=data['inventory'],
            score=data['score'],
        )
        state.save_timestamp = data.get('save_timestamp')
        return state
    
    def __repr__(self):
        return (f"GameState(player='{self.player_name}', level={self.level}, "
                f"health={self.health}, items={len(self.inventory)}, score={self.score})")


def save_checkpoint(state, filename):
    """
    Save game state to a JSON file (create a horcrux).
    
    json.dump() serializes Python objects → JSON text → file.
    indent=2 makes it human-readable (useful for debugging).
    """
    data = state.to_dict()
    
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"  💾 Horcrux created: '{filename}'")
    print(f"     State: {state}")


def load_checkpoint(filename):
    """
    Load game state from a JSON file (resurrect from horcrux).
    
    json.load() reads file → JSON text → Python objects.
    """
    if not os.path.exists(filename):
        print(f"  ❌ No horcrux found at '{filename}'")
        return None
    
    with open(filename, 'r') as f:
        data = json.load(f)
    
    state = GameState.from_dict(data)
    print(f"  🔮 Resurrected from '{filename}'")
    print(f"     State: {state}")
    return state


def demo_json_types():
    """Shows what types JSON can and cannot serialize."""
    print("=" * 55)
    print("  JSON Serializable Types")
    print("=" * 55)
    print()
    
    # Types that work
    serializable = {
        'string': 'hello',
        'integer': 42,
        'float': 3.14,
        'boolean': True,
        'null': None,
        'list': [1, 2, 3],
        'nested_dict': {'a': {'b': 'c'}},
    }
    
    print("  ✓ Types JSON handles natively:")
    result = json.dumps(serializable, indent=4)
    print(f"  {result}")
    print()
    
    # Types that DON'T work
    print("  ✗ Types JSON CANNOT serialize (and workarounds):")
    
    problematic = [
        ("set({1, 2, 3})", {1, 2, 3}, lambda s: list(s)),
        ("bytes(b'hello')", b'hello', lambda b: b.hex()),
        ("tuple((1, 2))", (1, 2), lambda t: list(t)),
    ]
    
    for name, obj, converter in problematic:
        try:
            json.dumps(obj)
            print(f"    {name}: ✓ (unexpected)")
        except TypeError as e:
            converted = converter(obj)
            print(f"    {name}: ✗ {e}")
            print(f"      Workaround: convert to {type(converted).__name__} → {json.dumps(converted)}")
    print()


def demo_save_load_cycle():
    """Demonstrates the complete save/load checkpoint pattern."""
    print("=" * 55)
    print("  Horcrux Pattern: JSON Save/Load Cycle")
    print("=" * 55)
    print()
    
    save_file = '_horcrux_save.json'
    
    # --- Create initial state ---
    print("  Phase 1: Initial game state")
    state = GameState("Tom Riddle", level=1, health=100, inventory=["wand"], score=0)
    print(f"    {state}")
    print()
    
    # --- Play and save ---
    print("  Phase 2: Player progresses and saves")
    state.level = 5
    state.health = 73
    state.inventory.extend(["diary", "ring", "locket"])
    state.score = 4200
    save_checkpoint(state, save_file)
    print()
    
    # --- Simulate program death ---
    print("  Phase 3: Program 'dies' (del state)")
    del state
    print("    State object destroyed!")
    print()
    
    # --- Resurrect ---
    print("  Phase 4: Resurrection from horcrux")
    restored = load_checkpoint(save_file)
    print()
    
    # --- Verify ---
    if restored:
        print("  Phase 5: Verification")
        print(f"    Player: {restored.player_name}")
        print(f"    Level: {restored.level}")
        print(f"    Health: {restored.health}")
        print(f"    Inventory: {restored.inventory}")
        print(f"    Score: {restored.score}")
        
        # Show what the JSON file looks like
        print(f"\n  Raw JSON contents of '{save_file}':")
        with open(save_file, 'r') as f:
            print(f"    {f.read()}")
    
    # Cleanup
    if os.path.exists(save_file):
        os.remove(save_file)


if __name__ == '__main__':
    demo_json_types()
    demo_save_load_cycle()
