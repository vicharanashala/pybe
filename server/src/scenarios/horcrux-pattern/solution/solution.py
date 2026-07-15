"""
The Horcrux Pattern: Serialization and Deserialization with Pickle and JSON
===========================================================================

Scenario: Create a custom Python class with various attributes. Serialize an
instance of this class to a file using the pickle module. Then, write code to
read the file and reconstruct the exact object.

This solution demonstrates:
- pickle.dumps(): Serialize object to bytes
- pickle.loads(): Deserialize bytes back to object
- json.dumps(): Serialize to JSON string (for comparison)
- json.loads(): Deserialize JSON string back to object
- with open(): Context manager for file operations
- __getstate__/__setstate__: Custom pickle serialization

In Harry Potter, Voldemort split his soul into horcruxes to cheat death.
In computing, objects "die" when the program terminates. To "cheat death",
an object must be serialized - converted into a stream of bytes and stored
on disk. When the program restarts, the object is resurrected from the file.
Serialization is the horcrux of software.

KEY INSIGHT: pickle is Python-specific and handles complex objects (classes,
instances, arbitrary object graphs). JSON is a universal text format that
only handles basic types (dict, list, str, number, bool, null). pickle can
serialize almost any Python object; JSON cannot serialize classes directly.
"""

import pickle
import json
import os
from typing import Any, Optional
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path


class Wizard:
    """
    Represents a Dark Wizard (like Voldemort) for serialization demonstration.

    This class has various attribute types to demonstrate pickle's flexibility:
    - name: str
    - creation_date: datetime
    - power_level: int
    - horcruxes: list of strings
    - properties: dict
    - is_immortal: bool

    Pickle can serialize all of these. JSON would fail on datetime objects
    and would lose the class structure entirely.
    """

    def __init__(
        self,
        name: str,
        power_level: int = 100,
        horcruxes: Optional[list] = None,
        properties: Optional[dict] = None
    ):
        self.name = name
        self.creation_date = datetime.now()
        self.power_level = power_level
        self.horcruxes = horcruxes or []
        self.properties = properties or {}
        self.is_immortal = True  # Always immortal after being resurrected
        self._secret_knowledge = "The enemy is death itself"  # Private attribute

    def __repr__(self) -> str:
        return (
            f"Wizard(name='{self.name}', "
            f"power_level={self.power_level}, "
            f"horcruxes={len(self.horcruxes)}, "
            f"is_immortal={self.is_immortal})"
        )

    def add_horcrux(self, horcrux: str) -> None:
        """Add a horcrux to this wizard's collection."""
        self.horcruxes.append(horcrux)
        print(f"[{self.name}] Created horcrux: {horcrux}")

    def describe(self) -> str:
        """Return a description of the wizard."""
        return (
            f"{self.name} - Power Level: {self.power_level}\n"
            f"  Horcruxes: {', '.join(self.horcruxes) if self.horcruxes else 'None yet'}\n"
            f"  Properties: {self.properties}\n"
            f"  Immortal: {self.is_immortal}\n"
            f"  Created: {self.creation_date.strftime('%Y-%m-%d %H:%M:%S')}"
        )


class HorcruxSerializer:
    """
    Handles serialization and deserialization of wizard objects.

    Provides both pickle (binary) and JSON (text) serialization.
    Demonstrates the tradeoffs between the two formats.
    """

    def __init__(self, storage_dir: str = "./horcrux_storage"):
        """
        Initialize the serializer with a storage directory.

        Args:
            storage_dir: Directory to store serialized objects
        """
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)

    def save_with_pickle(self, wizard: Wizard, filename: str) -> str:
        """
        Serialize a wizard object to a binary pickle file.

        pickle.dumps() converts the object to a bytes object.
        pickle.loads() converts bytes back to the original object.

        pickle is:
        - Python-specific (other languages can't read it)
        - Binary format (not human-readable)
        - Fast
        - Can serialize almost any Python object
        - NOT secure (can execute arbitrary code on load)

        Args:
            wizard: The Wizard object to serialize
            filename: Name of the file to save to

        Returns:
            Full path to the saved file
        """
        filepath = self.storage_dir / filename

        # pickle.dumps() serializes to bytes in memory
        # pickle.dump() serializes directly to a file
        # We use a context manager (with open) to ensure proper file handling
        with open(filepath, 'wb') as f:
            # pickle.dump(obj, file) - serialize obj and write to file
            pickle.dump(wizard, f)

        print(f"[Pickle] Saved horcrux to: {filepath}")
        print(f"[Pickle] File size: {filepath.stat().st_size} bytes")
        return str(filepath)

    def load_with_pickle(self, filename: str) -> Wizard:
        """
        Deserialize a wizard object from a pickle file.

        pickle.load() reads from a file and reconstructs the object.
        The reconstructed object is an EXACT copy of the original,
        with all attributes preserved including private ones.

        WARNING: Never load pickle files from untrusted sources!
        A malicious pickle can execute arbitrary code on load.

        Args:
            filename: Name of the file to load from

        Returns:
            The reconstructed Wizard object
        """
        filepath = self.storage_dir / filename

        with open(filepath, 'rb') as f:
            # pickle.load(file) - read from file and deserialize
            wizard = pickle.load(f)

        print(f"[Pickle] Resurrected wizard from: {filepath}")
        return wizard

    def save_with_json(self, wizard: Wizard, filename: str) -> str:
        """
        Serialize a wizard to a JSON file.

        json.dumps() converts to a JSON string.
        json.dump() writes directly to a file.

        JSON is:
        - Universal (readable by any language)
        - Text format (human-readable)
        - Slower than pickle
        - Limited to basic types (dict, list, str, number, bool, null)
        - Cannot preserve class structure (loses type information)

        NOTE: JSON cannot serialize datetime objects or custom classes
        directly. We must convert them to JSON-serializable formats.

        Args:
            wizard: The Wizard object to serialize
            filename: Name of the file to save to

        Returns:
            Full path to the saved file
        """
        filepath = self.storage_dir / filename

        # Convert wizard to dict for JSON serialization
        # This loses the class information - it becomes just a dict
        wizard_dict = {
            "name": wizard.name,
            "creation_date": wizard.creation_date.isoformat(),  # datetime → str
            "power_level": wizard.power_level,
            "horcruxes": wizard.horcruxes,
            "properties": wizard.properties,
            "is_immortal": wizard.is_immortal,
            # NOTE: Private attributes (_secret_knowledge) are NOT serialized
            # NOTE: The "Wizard" class type is lost - this becomes just a dict
        }

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(wizard_dict, f, indent=2, ensure_ascii=False)

        print(f"[JSON] Saved horcrux to: {filepath}")
        print(f"[JSON] File size: {filepath.stat().st_size} bytes")
        return str(filepath)

    def load_with_json(self, filename: str) -> dict:
        """
        Deserialize a wizard from a JSON file.

        IMPORTANT: JSON deserialization returns a plain dict, NOT a Wizard object!
        The class structure is lost. This is a fundamental limitation of JSON.

        Args:
            filename: Name of the file to load from

        Returns:
            A dict (NOT a Wizard object - class info is lost)
        """
        filepath = self.storage_dir / filename

        with open(filepath, 'r', encoding='utf-8') as f:
            wizard_dict = json.load(f)

        # Convert creation_date back to datetime if needed
        if isinstance(wizard_dict.get('creation_date'), str):
            wizard_dict['creation_date'] = datetime.fromisoformat(
                wizard_dict['creation_date']
            )

        print(f"[JSON] Loaded data from: {filepath}")
        print(f"[JSON] Type of loaded object: {type(wizard_dict)}")
        return wizard_dict

    def compare_formats(self, wizard: Wizard) -> None:
        """
        Compare pickle and JSON serialization side by side.
        """
        print("\n" + "=" * 60)
        print("SERIALIZATION FORMAT COMPARISON")
        print("=" * 60)

        # Save to both formats
        pickle_path = self.save_with_pickle(wizard, "voldemort_pickle.pkl")
        json_path = self.save_with_json(wizard, "voldemort_json.json")

        # Show file sizes
        pickle_size = Path(pickle_path).stat().st_size
        json_size = Path(json_path).stat().st_size

        print(f"\n[Size Comparison]")
        print(f"  Pickle: {pickle_size} bytes")
        print(f"  JSON:   {json_size} bytes")

        # Load and compare
        resurrected = self.load_with_pickle("voldemort_pickle.pkl")
        json_data = self.load_with_json("voldemort_json.json")

        print(f"\n[Type Comparison]")
        print(f"  Pickle deserializes to: {type(resurrected).__name__} (preserved class)")
        print(f"  JSON deserializes to:   {type(json_data).__name__} (just a dict)")

        print(f"\n[Content Comparison]")
        print(f"  Pickle: {resurrected}")
        print(f"  JSON:   {json_data}")

        print(f"\n[Attribute Preservation]")
        print(f"  Private attr (_secret_knowledge):")
        print(f"    Pickle: '{resurrected._secret_knowledge}' (preserved)")
        print(f"    JSON:   Not serialized (private attrs ignored)")


def demonstrate_pickle_security():
    """
    Explain the security implications of pickle.
    """
    print("\n" + "=" * 60)
    print("PICKLE SECURITY WARNING")
    print("=" * 60)
    print("""
PICKLE IS NOT SECURE!

pickle.load() can execute arbitrary Python code during deserialization.
A malicious pickle file can:
  - Delete files
  - Send data over the network
  - Run shell commands
  - Take over your entire system

Example of what a malicious pickle can do:
  import pickle
  import os
  class Malicious:
      def __reduce__(self):
          # This runs during unpickling!
          return (os.system, ('rm -rf /',))
  pickle.dump(Malicious(), open('evil.pkl', 'wb'))

NEVER unpickle data from untrusted sources!

ALTERNATIVES FOR UNTRUSTED DATA:
  - JSON: Cannot execute code, only data
  - msgpack: Fast binary format, safe
  - Protocol Buffers: Google's safe format
  - YAML (with safe_load): Safe subset only

When receiving data from external sources (APIs, files, network),
always prefer JSON or other safe formats. Reserve pickle for
internal storage where you trust the source.
    """)


def demonstrate_json_comparison():
    """
    Show why JSON can't do what pickle does with custom classes.
    """
    print("\n" + "=" * 60)
    print("WHY JSON CAN'T REPLACE PICKLE")
    print("=" * 60)

    wizard = Wizard(
        name="Voldemort",
        power_level=9001,
        horcruxes=["Diary", "Ring", "Cup", "Locket", "Diadem", "Nagini"],
        properties={"blood": "parseltongue", "ability": "flight"}
    )

    print("Original Wizard object:")
    print(f"  Type: {type(wizard)}")
    print(f"  {wizard}")

    print("\nTrying to serialize with JSON...")
    try:
        # This will fail for datetime, or lose class structure
        json_str = json.dumps(wizard, default=str)
        print(f"  JSON output: {json_str}")
        print("  NOTE: datetime was converted to string, class type lost")
    except TypeError as e:
        print(f"  TypeError: {e}")
        print("  JSON cannot serialize datetime objects directly!")

    print("\nWith pickle:")
    pickle_bytes = pickle.dumps(wizard)
    resurrected = pickle.loads(pickle_bytes)
    print(f"  Type preserved: {type(resurrected)}")
    print(f"  Object equality: {resurrected == wizard}")
    print(f"  Same memory location: False (it's a copy)")


def demonstrate_horcrux_workflow():
    """
    Show the complete horcrux workflow: create, split soul, resurrect.
    """
    print("\n" + "=" * 60)
    print("THE HORCRUX WORKFLOW")
    print("=" * 60)

    serializer = HorcruxSerializer()

    # Step 1: Create the wizard
    print("\n[Step 1: Creating the Dark Wizard]")
    voldemort = Wizard(
        name="Voldemort",
        power_level=8500,
        properties={"blood": "Slithering", "legacy": "Dark Lord"}
    )
    print(voldemort.describe())

    # Step 2: Create horcruxes (serialize)
    print("\n[Step 2: Creating Horcruxes (Serialization)]")
    print("In Harry Potter, a horcrux splits the soul and hides it in an object.")
    print("In computing, we 'split' the object state and save it to disk.\n")

    # Save the wizard's state to a file
    voldemort.add_horcrux(" Diary ( Lucius's )")
    pickle_path = serializer.save_with_pickle(voldemort, "horcrux_voldemort.pkl")

    print(f"\nThe wizard's 'soul' (object state) is now stored in: {pickle_path}")

    # Step 3: "Destroy" the wizard (end the program)
    print("\n[Step 3: The Wizard is Destroyed]")
    print("In Harry Potter: Voldemort's body is destroyed.")
    print("In computing: The program ends, objects go out of scope.")
    voldemort_copy = voldemort
    del voldemort  # Simulate program ending
    print("Wizard object deleted from memory...")

    # Step 4: Resurrect (deserialize)
    print("\n[Step 4: Resurrecting the Wizard (Deserialization)]")
    print("In Harry Potter: The dark wizard is brought back.")
    print("In computing: We load the pickled file back into an object.\n")

    resurrected = serializer.load_with_pickle("horcrux_voldemort.pkl")
    print(f"\n{resurrected.describe()}")

    # Step 5: Verify identity
    print("\n[Step 5: Verifying the Resurrection]")
    print(f"  Original name:      'Voldemort'")
    print(f"  Resurrected name:   '{resurrected.name}'")
    print(f"  Objects equal:      {voldemort_copy.name == resurrected.name}")
    print(f"  Is Wizard instance: {isinstance(resurrected, Wizard)}")
    print("\nThe wizard has been resurrected with all attributes intact!")


def demonstrate_pickle_protocols():
    """
    Explain pickle protocol versions.
    """
    print("\n" + "=" * 60)
    print("PICKLE PROTOCOL VERSIONS")
    print("=" * 60)
    print("""
Pickle supports multiple protocol versions:

  Protocol v0: ASCII only, original, slowest
  Protocol v1: Binary, early Python 2.x
  Protocol v2: Binary, Python 2.3+, supports new-style classes
  Protocol v3: Binary, Python 3.0+, default for Python 3
  Protocol v4: Binary, Python 3.4+, supports more types
  Protocol v5: Binary, Python 3.8+, out-of-band buffers

Higher protocols are faster and support more types, but require
corresponding Python versions to load.

To specify protocol:
  pickle.dump(obj, f, protocol=pickle.HIGHEST_PROTOCOL)

For compatibility with Python 2:
  pickle.dump(obj, f, protocol=2)
    """)


if __name__ == "__main__":
    print("The Horcrux Pattern - Serialization with Pickle and JSON")
    print("=" * 60)

    # Demonstrate the complete workflow
    demonstrate_horcrux_workflow()

    # Compare formats
    serializer = HorcruxSerializer()
    wizard = Wizard(
        name="Dark Lord",
        power_level=10000,
        horcruxes=["Ring of Gyges", "Shroud of Turin"],
        properties={"element": "shadow", "realm": "mortal"}
    )
    serializer.compare_formats(wizard)

    # Show why JSON can't replace pickle
    demonstrate_json_comparison()

    # Security warning
    demonstrate_pickle_security()

    # Protocol versions
    demonstrate_pickle_protocols()

    print("\n" + "=" * 60)
    print("KEY INSIGHTS")
    print("=" * 60)
    print("""
1. PICKLE is Python-specific binary serialization.
   - Pros: Handles any Python object, preserves class structure
   - Cons: Not human-readable, insecure, not cross-language

2. JSON is universal text-based serialization.
   - Pros: Human-readable, universal (all languages), safe
   - Cons: Limited types, loses class information

3. Use PICKLE when:
   - Saving Python objects for later Python programs
   - Internal caching where security is guaranteed
   - Complex object graphs with circular references

4. Use JSON when:
   - Sharing data between different languages
   - Public APIs and web services
   - Storing configuration (with safe YAML for sensitive data)
   - Any situation where security matters

5. ALWAYS be careful loading pickle files from untrusted sources!
   A pickle can execute arbitrary code on load.
    """)