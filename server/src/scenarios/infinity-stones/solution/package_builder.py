import os

def build_package():
    """Builds a sample package structure for demonstrating imports."""
    base_dir = "stones_pkg"
    os.makedirs(base_dir, exist_ok=True)
    
    # Create __init__.py for the root package
    with open(os.path.join(base_dir, "__init__.py"), "w") as f:
        f.write("# Root package\n")
        
    # Create a subpackage
    sub_dir = os.path.join(base_dir, "space")
    os.makedirs(sub_dir, exist_ok=True)
    with open(os.path.join(sub_dir, "__init__.py"), "w") as f:
        f.write("from .stone import SpaceStone\n")
        
    with open(os.path.join(sub_dir, "stone.py"), "w") as f:
        f.write("class SpaceStone:\n    pass\n")

if __name__ == "__main__":
    build_package()
    print("Package structure created successfully.")
