"""
Demonstrates absolute vs relative imports.
Note: To run relative imports correctly, this script would typically be run as a module.
"""

# Absolute import example (assuming stones_pkg is in PYTHONPATH or current directory)
try:
    from stones_pkg.space.stone import SpaceStone
    print("Absolute import successful:", SpaceStone)
except ModuleNotFoundError:
    print("Run package_builder.py first, or ensure stones_pkg is accessible.")

# Relative imports are used inside packages, e.g., 'from .stone import SpaceStone'
# in stones_pkg/space/__init__.py
