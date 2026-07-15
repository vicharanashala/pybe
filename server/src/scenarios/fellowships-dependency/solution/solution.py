"""
The Fellowship's Dependency: Virtual Environment Detection and Management
========================================================================

Scenario: You are managing two ancient codebases. The 'Rohan' app needs
horses==1.0, but the 'Gondor' app needs horses==2.0. Task 1: Write a script
to detect if running inside a virtual environment. Task 2: Define a
requirements.txt for the Gondor app. Task 3: Write a function that prints
the terminal commands to create and set up a venv.

This solution demonstrates:
- venv: Creating isolated Python virtual environments
- pip: Package installer for Python
- requirements.txt: Specification file for reproducible dependencies
- sys.prefix: Detecting whether code runs inside a virtual environment

In software, isolating dependencies ensures that applications do not poison
each other's environments. A Fellowship cannot succeed if its members require
conflicting environments - Python's default global package installation leads
to "Dependency Hell" when Project A needs Library v1.0 and Project B needs v2.0.
A virtual environment (venv) acts as a protective bubble for each project.
"""

import sys
import os
from typing import Tuple, List, Optional
from pathlib import Path


class VirtualEnvironmentManager:
    """
    Manages virtual environment detection and generation.

    Virtual environments solve the dependency conflict problem by providing
    isolated Python contexts, each with their own:
    - Python binary (sys.executable)
    - Installed packages (site-packages)
    - pip and other tools

    The key insight: sys.prefix tells us where the current Python environment
    is rooted. In a venv, sys.prefix points to the venv directory. Outside a
    venv on Linux/Mac, it points to the system Python installation.
    """

    @staticmethod
    def is_running_in_venv() -> bool:
        """
        Detect if the current Python interpreter is running inside a venv.

        The sys.prefix value reveals the environment:
        - In a venv: sys.prefix = '/path/to/venv'
        - System Python: sys.prefix = '/usr' (Linux) or '/Library/Frameworks' (Mac)

        Additionally, sys.real_prefix is set only in venvs (legacy check).
        In Python 3.3+, venvs set sys.prefix to the venv path while
        sys.base_prefix points to the original Python installation.

        Returns:
            True if running inside a virtual environment, False otherwise
        """
        # Primary check: base_prefix was introduced in Python 3.3 for venv detection
        # If sys.prefix != sys.base_prefix, we're in a venv
        if hasattr(sys, 'real_prefix'):
            # Python 2.x or older venv-style environment
            # real_prefix is set only in virtual environments
            return True

        if hasattr(sys, 'base_prefix'):
            # Python 3.3+: base_prefix is the "real" Python installation
            # If prefix differs, we're in a venv
            return sys.prefix != sys.base_prefix

        # Fallback for very old Python versions
        return False

    @staticmethod
    def get_venv_info() -> Tuple[str, str, Optional[str]]:
        """
        Get detailed information about the current Python environment.

        Returns:
            Tuple of (sys.prefix, sys.executable, venv_path or None)
        """
        prefix = sys.prefix
        executable = sys.executable
        venv_path = None

        if hasattr(sys, 'base_prefix') and sys.prefix != sys.base_prefix:
            venv_path = sys.prefix

        return prefix, executable, venv_path

    @staticmethod
    def detect_venv_status() -> dict:
        """
        Comprehensive venv detection with detailed status.

        Returns:
            Dictionary with environment details
        """
        is_venv = VirtualEnvironmentManager.is_running_in_venv()
        prefix, executable, venv_path = VirtualEnvironmentManager.get_venv_info()

        return {
            "is_venv": is_venv,
            "venv_path": venv_path,
            "sys_prefix": prefix,
            "sys_executable": executable,
            "python_version": sys.version,
            "python_version_info": sys.version_info[:3],
        }


class RequirementsManager:
    """
    Manages requirements.txt file generation and parsing.

    requirements.txt is the standard format for specifying Python dependencies.
    It enables reproducible builds - anyone can recreate the exact environment
    by running `pip install -r requirements.txt`.

    Format options:
    - package==1.0.0 (exact version)
    - package>=1.0.0 (minimum version)
    - package~=1.0.0 (compatible version, ~=1.0.0 means >=1.0.0, <1.1.0)
    - package@https://... (URL install)
    - -e git+https://... (editable install from git)
    """

    @staticmethod
    def generate_requirements_txt(
        packages: List[Tuple[str, str]],
        include_python_version: bool = True
    ) -> str:
        """
        Generate a requirements.txt content string.

        Args:
            packages: List of (package_name, version_specifier) tuples
            include_python_version: Whether to add python_version constraint

        Returns:
            Formatted requirements.txt content string
        """
        lines = []

        if include_python_version:
            # Pin Python version for reproducibility
            lines.append(f"# Python {sys.version_info.major}.{sys.version_info.minor}")
            lines.append("")

        lines.append("# Generated requirements for Gondor application")
        lines.append("# Run: pip install -r requirements.txt")
        lines.append("")

        for package_name, version in packages:
            if version:
                lines.append(f"{package_name}{version}")
            else:
                lines.append(package_name)

        return "\n".join(lines)

    @staticmethod
    def parse_requirements_txt(content: str) -> List[Tuple[str, str]]:
        """
        Parse requirements.txt content into package specifications.

        Args:
            content: The content of requirements.txt

        Returns:
            List of (package_name, version_specifier) tuples
        """
        packages = []
        for line in content.strip().split("\n"):
            line = line.strip()
            # Skip comments and empty lines
            if not line or line.startswith("#"):
                continue

            # Handle various version specifiers
            for op in ["==", ">=", "<=", "~=", ">", "<", "@"]:
                if op in line:
                    parts = line.split(op, 1)
                    packages.append((parts[0].strip(), op + parts[1].strip()))
                    break
            else:
                # No version specifier found
                packages.append((line, ""))

        return packages


class VenvCommandGenerator:
    """
    Generates terminal commands for virtual environment operations.

    This demonstrates the bash commands needed to:
    1. Create a new virtual environment
    2. Activate it (platform-specific)
    3. Install packages from requirements.txt

    The commands differ by OS:
    - Linux/Mac: source venv/bin/activate
    - Windows: venv\\Scripts\\activate.bat or venv\\Scripts\\Activate.ps1
    """

    @staticmethod
    def get_creation_command(venv_path: str) -> str:
        """
        Generate command to create a virtual environment.

        Args:
            venv_path: Path where the venv should be created

        Returns:
            Bash command string
        """
        return f"python -m venv {venv_path}"

    @staticmethod
    def get_activation_command(venv_path: str) -> dict:
        """
        Generate activation commands for different shells/platforms.

        Returns:
            Dictionary with shell-specific activation commands
        """
        # Get just the directory name for the activate script path
        venv_name = Path(venv_path).name
        venv_dir = Path(venv_path).parent

        return {
            "bash (Linux/Mac)": f"source {venv_path}/bin/activate",
            "Windows CMD": f"{venv_path}\\Scripts\\activate.bat",
            "Windows PowerShell": f"{venv_path}\\Scripts\\Activate.ps1",
            "Fish shell": f"source {venv_path}/bin/activate.fish",
            "Zsh": f"source {venv_path}/bin/activate",
        }

    @staticmethod
    def get_installation_command(requirements_file: str = "requirements.txt") -> str:
        """
        Generate command to install packages from requirements.txt.

        Args:
            requirements_file: Path to requirements file

        Returns:
            pip install command string
        """
        return f"pip install -r {requirements_file}"

    @staticmethod
    def print_full_workflow(
        venv_path: str,
        requirements_file: str = "requirements.txt"
    ) -> None:
        """
        Print complete setup workflow with all commands.

        This is the function the scenario asks for: a clear printout
        of all commands needed to set up a virtual environment and
        install dependencies.
        """
        print("\n" + "=" * 60)
        print("VIRTUAL ENVIRONMENT SETUP WORKFLOW")
        print("=" * 60)
        print(f"\nProject: Gondor Application")
        print(f"Venv location: {venv_path}")
        print(f"Requirements: {requirements_file}")
        print("\n" + "-" * 60)
        print("STEP 1: Create the virtual environment")
        print("-" * 60)
        print(f"$ python -m venv {venv_path}")
        print("\nThis creates a new Python installation in the specified directory,")
        print("isolated from the system Python and other projects.")

        print("\n" + "-" * 60)
        print("STEP 2: Activate the virtual environment")
        print("-" * 60)

        activation_commands = VenvCommandGenerator.get_activation_command(venv_path)
        print("\nChoose the command for your shell/OS:\n")
        for shell, cmd in activation_commands.items():
            print(f"  {shell}:")
            print(f"    $ {cmd}")
            print()

        print("After activation, your prompt will change to show the venv name,")
        print("and 'python' and 'pip' will refer to the venv's versions.")

        print("\n" + "-" * 60)
        print("STEP 3: Install dependencies")
        print("-" * 60)
        print(f"\n$ pip install -r {requirements_file}")
        print("\nThis installs all packages listed in requirements.txt into the")
        print("virtual environment, isolated from other projects.")

        print("\n" + "-" * 60)
        print("STEP 4: Verify installation")
        print("-" * 60)
        print("\n$ pip list")
        print("\nThis shows all installed packages in the current environment.")
        print("You can also verify using Python:")
        print("  >>> import sys")
        print(f"  >>> sys.prefix")
        print(f"  '{venv_path}'")


def demonstrate_venv_detection():
    """
    Show how to detect the current Python environment.
    """
    print("=" * 60)
    print("VIRTUAL ENVIRONMENT DETECTION")
    print("=" * 60)

    status = VirtualEnvironmentManager.detect_venv_status()

    print(f"\nCurrent Environment Status:")
    print(f"  Running in venv: {status['is_venv']}")
    print(f"  Venv path: {status['venv_path'] or 'N/A (system Python)'}")
    print(f"  sys.prefix: {status['sys_prefix']}")
    print(f"  sys.executable: {status['sys_executable']}")
    print(f"  Python version: {status['python_version']}")

    if status['is_venv']:
        print(f"""
You are currently running inside a virtual environment!
This means:
  - Packages you install will go to: {status['venv_path']}
  - They will NOT affect the system Python
  - Other projects on this system remain unaffected
        """)
    else:
        print("""
You are running in the SYSTEM Python.
This means:
  - Packages you install go to system site-packages
  - This may conflict with other projects' needs
  - Consider creating a venv for isolation!
        """)


def demonstrate_dependency_conflict():
    """
    Explain the dependency hell problem that venvs solve.
    """
    print("\n" + "=" * 60)
    print("THE DEPENDENCY CONFLICT PROBLEM")
    print("=" * 60)
    print("""
Imagine you have two projects:

  PROJECT ROHAN (old codebase):
    - Needs: horses==1.0 (original breed)
    - Status: Production, stable, no changes allowed

  PROJECT GONDOR (new project):
    - Needs: horses==2.0 (improved breed)
    - Status: Development, actively working on it

If you install horses==2.0 globally:
  - Rohan breaks (API changed between v1 and v2)

If you downgrade Gondo to horses==1.0:
  - Gondor loses new features
  - You can't develop new functionality

THE SOLUTION: Virtual Environments

Each project gets its own isolated Python environment:
  ~/projects/rohan/venv  → has horses==1.0
  ~/projects/gondor/venv → has horses==2.0

Now both projects work perfectly, with no conflicts!
The Fellowship succeeds because each member has their own space.
    """)


def demonstrate_requirements_file():
    """
    Show how to create and use requirements.txt.
    """
    print("\n" + "=" * 60)
    print("REQUIREMENTS.TXT GENERATION")
    print("=" * 60)

    # Example packages for the Gondor application
    gondor_packages = [
        ("flask", ">=2.3.0"),          # Web framework
        ("sqlalchemy", "~=2.0.0"),     # ORM (~= means compatible release)
        ("bcrypt", "==4.0.1"),         # Password hashing (exact version)
        ("pyjwt", ">=2.8.0"),          # JWT tokens
        ("markdown", ""),              # No version constraint
    ]

    requirements_content = RequirementsManager.generate_requirements_txt(
        gondor_packages,
        include_python_version=True
    )

    print("\nGenerated requirements.txt:\n")
    print(requirements_content)

    # Show what happens when you parse it
    print("\n" + "-" * 60)
    print("Parsed packages:")
    parsed = RequirementsManager.parse_requirements_txt(requirements_content)
    for name, version in parsed:
        print(f"  {name}{version}")

    print("\n" + "-" * 60)
    print("BEST PRACTICES:")
    print("-" * 60)
    print("""
1. Pin exact versions (==) for production reproducibility
2. Use minimum versions (>=) when flexibility is acceptable
3. Use compatible versions (~=) when API changes matter
4. Always include python_version for environment matching
5. Use pip freeze > requirements.txt to capture exact state
6. Consider pip-tools for more sophisticated resolution
    """)


if __name__ == "__main__":
    print("The Fellowship's Dependency - Virtual Environment Management")
    print("=" * 60)

    # Demonstrate venv detection
    demonstrate_venv_detection()

    # Explain the problem
    demonstrate_dependency_conflict()

    # Show requirements.txt generation
    demonstrate_requirements_file()

    # Print the full workflow (the main task)
    VenvCommandGenerator.print_full_workflow(
        venv_path="~/projects/gondor/venv",
        requirements_file="requirements.txt"
    )

    print("\n" + "=" * 60)
    print("KEY CONCEPTS")
    print("=" * 60)
    print("""
1. sys.prefix:
   Path to the current Python installation's root.
   In a venv: /home/user/projects/myproject/venv
   System Python: /usr (Linux) or /Library/Frameworks (Mac)

2. sys.base_prefix:
   The "real" Python installation (only differs in venvs).
   Used to detect if we're running inside a virtual environment.

3. requirements.txt:
   Text file listing packages and version constraints.
   pip install -r requirements.txt recreates the environment.

4. venv vs conda vs poetry vs uv:
   - venv: Built into Python stdlib, simplest option
   - conda: More complex, includes non-Python packages
   - poetry: Modern, dependency resolution + packaging
   - uv: Ultra-fast, modern alternative to pip

5. Modern Tools:
   - pyenv: Manages multiple Python versions
   - poetry/uv: Modern dependency management with lock files
   - docker: Complete environment isolation at container level
    """)