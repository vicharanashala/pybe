The Fellowship's applications are crashing! The "Rohan" app strictly requires `horses==1.0`, but the newer "Gondor" app has just been updated to require `horses==2.0`. When installing both globally, one overwrites the other, causing a dependency conflict.

To fix this, you must containerize the Gondor app in its own virtual environment.

Task 1: Write a Python function `is_in_venv()` that checks if the current script is running inside a virtual environment. You can determine this by checking if `sys.prefix` is different from `sys.base_prefix`.

Task 2: Create a multi-line string representing the `requirements.txt` file for the Gondor app. It needs `horses` at exactly version 2.0, and `swords` at version 1.5 or higher.

Task 3: Write a function `print_venv_commands()` that outputs the exact terminal commands (for a Linux/Mac system) to:
1. Create a virtual environment named `.venv` using the built-in module.
2. Activate the virtual environment.
3. Install the dependencies from `requirements.txt`.
