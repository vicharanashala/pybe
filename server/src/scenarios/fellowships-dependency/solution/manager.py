import sys

# Task 1
def is_in_venv():
    """
    Checks if the script is currently running inside a virtual environment.
    If sys.prefix matches sys.base_prefix, we are in the global environment.
    """
    return sys.prefix != getattr(sys, "base_prefix", sys.prefix)

# Task 2
gondor_requirements = """\
horses==2.0
swords>=1.5
"""

# Task 3
def print_venv_commands():
    """Prints the bash commands to setup and use a virtual environment."""
    print("1. Create the virtual environment:")
    print("   python -m venv .venv")
    print("2. Activate it (Linux/Mac):")
    print("   source .venv/bin/activate")
    print("3. Install dependencies:")
    print("   pip install -r requirements.txt")

if __name__ == "__main__":
    if is_in_venv():
        print("You are safely inside a virtual environment.")
    else:
        print("WARNING: You are in the global environment!")
        
    print("\nGondor Requirements File:")
    print(gondor_requirements)
    
    print("Terminal Commands needed:")
    print_venv_commands()
