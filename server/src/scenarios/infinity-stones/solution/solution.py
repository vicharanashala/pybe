"""
The Infinity Stones Package - Python Package Organization

This scenario explores how Python packages work, using the Marvel Infinity Gauntlet
as a metaphor. Just as the Infinity Gauntlet unifies the six Infinity Stones into a
single powerful tool, a Python __init__.py file unifies scattered modules into a
cohesive, importable package.

Key Concepts:
- Python modules: Single .py files containing Python code
- Python packages: Directories containing modules and __init__.py
- __init__.py: The file that marks a directory as a Python package
- __all__: Controls what gets exported when using 'from package import *'
- Relative imports: Using .module_name to import sibling modules
"""

import math
import time
import sys
import os

# ============================================================================
# STONE MODULES (Individual modules representing each Infinity Stone)
# ============================================================================

# These would normally be separate files in the gauntlet/ directory.
# For demonstration, we define them as docstrings showing what each file contains.

SPACE_MODULE = '''
"""space.py - The Space Stone

The Space Stone allows its bearer to exist anywhere, move anything, and
compress space itself. In our package, the space module provides utilities
for spatial calculations and positioning.
"""

def create_portal(origin: tuple, destination: tuple) -> dict:
    """Create a portal connection between two spatial coordinates."""
    return {
        "origin": origin,
        "destination": destination,
        "distance": math.sqrt(
            (destination[0] - origin[0])**2 +
            (destination[1] - origin[1])**2 +
            (destination[2] - origin[2])**2
        )
    }

def compress_distance(distance: float, compression_factor: float = 1e6) -> float:
    """Compress vast distances into manageable units (light-years to meters)."""
    return distance * compression_factor
'''

TIME_MODULE = '''
"""time.py - The Time Stone

The Time Stone grants the ability to see possible futures, change past events,
and manipulate the flow of time. Our time module provides temporal utilities.
"""

def see_future(present_state: dict, steps: int = 1) -> list:
    """Simulate future states by applying steps to current state."""
    future_states = []
    current = present_state.copy()
    for i in range(steps):
        current["time"] = current.get("time", 0) + 1
        future_states.append(current.copy())
    return future_states

def slow_time(duration: float, factor: float = 0.1) -> float:
    """Slow down time by a factor (用于 time manipulation scenarios)."""
    return duration / factor
'''

MIND_MODULE = '''
"""mind.py - The Mind Stone

The Mind Stone grants the ability to think, analyze, and process information
at superhuman levels. Our mind module provides cognitive and analysis tools.
"""

def analyze_thought_pattern(pattern: list) -> dict:
    """Analyze a pattern of thoughts and return insights."""
    return {
        "pattern_length": len(pattern),
        "unique_elements": len(set(pattern)),
        "complexity": len(set(pattern)) / len(pattern) if pattern else 0,
        "recurring": len(pattern) - len(set(pattern))
    }

def process_knowledge(facts: list) -> dict:
    """Process a list of facts and generate connections."""
    return {
        "fact_count": len(facts),
        "knowledge_graph": {fact: [] for fact in facts}
    }
'''

REALITY_MODULE = '''
"""reality.py - The Reality Stone

The Reality Stone allows its bearer to alter reality itself, ignoring the
natural laws of the universe. Our reality module provides transformation tools.
"""

def alter_reality(original: dict, alterations: dict) -> dict:
    """Apply alterations to create an altered version of reality."""
    altered = original.copy()
    altered.update(alterations)
    return altered

def merge_realities(reality_a: dict, reality_b: dict) -> dict:
    """Merge two realities together (union of their properties)."""
    return {**reality_a, **reality_b}
'''

POWER_MODULE = '''
"""power.py - The Power Stone

The Power Stone grants the ability to manipulate energy, enhance physical
strength, and destroy anything. Our power module handles energy calculations.
"""

def calculate_power(energy: float, mass: float) -> float:
    """Calculate power using E = mc^2 relationship."""
    c = 299792458  # Speed of light in m/s
    return energy + (mass * c ** 2)

def amplify_power(base_power: float, amplification: float) -> float:
    """Amplify base power by a given factor."""
    return base_power * amplification
'''

SOUL_MODULE = '''
"""soul.py - The Soul Stone

The Soul Stone holds the essence of all living things. Our soul module
provides utilities for working with the essence of entities.
"""

def extract_soul(entity: dict) -> str:
    """Extract the 'soul' identifier from an entity."""
    return entity.get("name", "Unknown Soul")

def calculate_soul_age(soul_data: dict) -> int:
    """Calculate the effective age based on soul data."""
    return soul_data.get("experiences", 0) * 365
'''


# ============================================================================
# PACKAGE SIMULATION (Demonstrating how __init__.py works)
# ============================================================================

class InfinityGauntlet:
    """
    Simulates the Infinity Gauntlet - a collection of stone modules unified
    into a single interface. This demonstrates the role of __init__.py in
    providing a clean public API for a package.
    """

    def __init__(self):
        # In a real package, these would be imported from sibling modules:
        # from .space import create_portal
        # from .time import see_future
        # etc.
        self.stones = {
            "space": {"imported": True, "function": "create_portal"},
            "time": {"imported": True, "function": "see_future"},
            "mind": {"imported": True, "function": "analyze_thought_pattern"},
            "reality": {"imported": True, "function": "alter_reality"},
            "power": {"imported": True, "function": "calculate_power"},
            "soul": {"imported": True, "function": "extract_soul"}
        }
        self.wielder = None

    def wield(self, wielder_name: str):
        """Set the wielder of the gauntlet."""
        self.wielder = wielder_name
        return f"{wielder_name} now wields the complete Infinity Gauntlet!"

    def snap(self) -> str:
        """Execute the snap - ultimate power demonstration."""
        if not self.wielder:
            return "No wielder. The gauntlet lies dormant."
        return f"{self.wielder} snaps their fingers... HALF OF ALL LIVING THINGS CEASE TO EXIST."


def demonstrate_package_structure():
    """
    Demonstrates how a properly structured Python package works.
    Shows the difference between importing individual modules vs.
    using the package's __init__.py to expose a unified API.
    """
    print("=" * 70)
    print("PYTHON PACKAGE DEMONSTRATION: The Infinity Gauntlet")
    print("=" * 70)

    # Create a mock package structure
    gauntlet = InfinityGauntlet()

    print("\n1. THE PROBLEM: Scattered Modules")
    print("-" * 40)
    print("""
    Without an __init__.py, using individual stone modules is messy:

        import space
        import time
        import mind
        import reality
        import power
        import soul

        space.create_portal(...)
        time.see_future(...)
    """)

    print("\n2. THE SOLUTION: Unified Package API")
    print("-" * 40)
    print("""
    With __init__.py providing clean exports, users get a unified API:

        from gauntlet import gauntlet  # The Gauntlet class

        guantlet = gauntlet()
        gauntlet.wield("Thanos")
        gauntlet.snap()
    """)

    print("\n3. REAL PACKAGE STRUCTURE")
    print("-" * 40)
    print("""
    A proper Python package structure looks like:

        gauntlet/
        ├── __init__.py      # Controls what gets exported
        ├── space.py         # Space Stone module
        ├── time.py          # Time Stone module
        ├── mind.py          # Mind Stone module
        ├── reality.py       # Reality Stone module
        ├── power.py         # Power Stone module
        └── soul.py          # Soul Stone module

    The __init__.py might contain:

        from .space import create_portal
        from .time import see_future
        # ... etc

        __all__ = ['create_portal', 'see_future', ...]
    """)

    print("\n4. WORKING WITH THE GAUNTLET")
    print("-" * 40)

    # Demonstrate the gauntlet interface
    print(f"Stones in gauntlet: {list(gauntlet.stones.keys())}")

    result = gauntlet.wield("Thanos")
    print(f"  {result}")

    print(f"  Snap result: {gauntlet.snap()}")

    print("\n5. __all__ CONTROL")
    print("-" * 40)
    print("""
    __all__ defines the public API when users run:
        from gauntlet import *

    Without __all__, ALL public names are exported.
    With __all__ = ['create_portal', 'Gauntlet'], only those are exported.

    This is the Gauntlet's way of controlling which stones are
    accessible to the outside world.
    """)


def demonstrate_import_system():
    """
    Demonstrates Python's import system and how package initialization works.
    """
    print("\n" + "=" * 70)
    print("PYTHON IMPORT SYSTEM DEMONSTRATION")
    print("=" * 70)

    print("\n1. IMPORT VARIATIONS")
    print("-" * 40)
    print("""
    # Import entire module (access via module.function)
    import gauntlet.space
    gauntlet.space.create_portal(...)

    # Import specific function (direct access)
    from gauntlet.space import create_portal
    create_portal(...)

    # Import with alias (avoid name conflicts)
    from gauntlet.space import create_portal as make_portal
    make_portal(...)

    # Import everything (uses __all__ if defined)
    from gauntlet import *
    create_portal(...)  # Only if in __all__
    """)

    print("\n2. RELATIVE VS ABSOLUTE IMPORTS")
    print("-" * 40)
    print("""
    # Absolute import (works from anywhere)
    from gauntlet.space import create_portal

    # Relative import (only works within the package)
    from .space import create_portal      # Same directory
    from ..parent_module import something # Parent directory

    # __init__.py typically uses relative imports for internal modules
    from . import space
    from .space import create_portal
    """)

    print("\n3. PYTHONPATH AND PACKAGE DISCOVERY")
    print("-" * 40)
    print(f"Current sys.path: {sys.path[:3]}...")
    print("""
    Python searches these directories when resolving imports.
    The directory containing your script is always first.
    """)


if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                    THE INFINITY STONES PACKAGE                       ║
    ║              Python Package Organization Demonstration               ║
    ╚══════════════════════════════════════════════════════════════════════╝
    """)

    demonstrate_package_structure()
    demonstrate_import_system()

    print("\n" + "=" * 70)
    print("KEY TAKEAWAYS")
    print("=" * 70)
    print("""
    1. __init__.py makes a directory a Python package (like the Gauntlet)

    2. It controls the public API via __all__ (like the Stone holders)

    3. Relative imports (from .module import) work within packages
       (like how Stones work together in the Gauntlet)

    4. Package structure enables scalable, maintainable codebases
       (like how the MCU scaled with organized movie franchises)

    5. Every major Python library (Django, Pandas, Requests) is a package
       (each Stone represents a different library's functionality)
    """)

    print("\nDemonstration complete. The Infinity Stones are united!\n")