"""
pickle_persistence.py Binary Serialization (Horcrux as Pickle)
=================================================================
While JSON is human-readable, pickle is Python's native binary
serialization. It can serialize ANYTHING Python can represent:
custom classes, nested objects, functions, and more.

The tradeoff: pickle is Python-only, not human-readable, and
has security risks (never unpickle untrusted data!).
"""

import pickle
import os
import sys


class Horcrux:
    """
    A magical container that preserves a fragment of state.
    Unlike JSON, pickle can serialize this entire class instance
    including its methods and nested objects.
    """
    
    def __init__(self, name, container, memory=None):
        self.name = name
        self.container = container  # The physical object (diary, ring, etc.)
        self.memory = memory or {}  # Complex nested data
        self.creation_order = None
        self._secret = "dark magic"  # Private attributes are also pickled
    
    def __repr__(self):
        return f"Horcrux('{self.name}' in {self.container})"
    
    def reveal(self):
        """Attempt to reveal the fragment's secrets."""
        return f"Fragment '{self.name}': {self.memory}"


class DarkWizard:
    """A wizard who creates horcruxes for immortality."""
    
    def __init__(self, name):
        self.name = name
        self.horcruxes = []
        self.power_level = 100
    
    def create_horcrux(self, horcrux):
        """Each horcrux diminishes the creator (splits the soul)."""
        horcrux.creation_order = len(self.horcruxes) + 1
        self.horcruxes.append(horcrux)
        self.power_level -= 10  # Soul splitting has a cost
        print(f"  Created Horcrux #{horcrux.creation_order}: {horcrux}")
        print(f"  Power level: {self.power_level}")
    
    def __repr__(self):
        return f"DarkWizard('{self.name}', horcruxes={len(self.horcruxes)}, power={self.power_level})"


def save_with_pickle(obj, filename):
    """
    Serialize any Python object to a binary file.
    
    pickle.dump() traverses the object graph and converts everything
    to a byte stream. It handles:
    - Custom class instances
    - Nested objects and circular references
    - Lists, dicts, sets, tuples
    - Almost any Python object
    """
    with open(filename, 'wb') as f:  # 'wb' = write binary
        pickle.dump(obj, f, protocol=pickle.HIGHEST_PROTOCOL)
    
    file_size = os.path.getsize(filename)
    print(f"  💾 Pickled to '{filename}' ({file_size} bytes)")


def load_with_pickle(filename):
    """
    Deserialize a Python object from a binary file.
    
    ⚠️ WARNING: Never unpickle data from untrusted sources!
    pickle.load() can execute arbitrary code during deserialization.
    """
    with open(filename, 'rb') as f:  # 'rb' = read binary
        obj = pickle.load(f)
    
    print(f"  🔮 Unpickled from '{filename}': {obj}")
    return obj


def demo_pickle_protocols():
    """Shows different pickle protocols and their characteristics."""
    print("=" * 55)
    print("  Pickle Protocols")
    print("=" * 55)
    print()
    
    test_data = {
        'numbers': list(range(100)),
        'text': 'Horcrux' * 50,
        'nested': {'a': [1, 2, {'b': 3}]},
    }
    
    print(f"  {'Protocol':<12} {'Size (bytes)':<15} {'Notes'}")
    print("  " + "-" * 55)
    
    for protocol in range(pickle.HIGHEST_PROTOCOL + 1):
        data = pickle.dumps(test_data, protocol=protocol)
        notes = ""
        if protocol == 0:
            notes = "ASCII, human-readable (sort of)"
        elif protocol == 2:
            notes = "Python 2 compatible"
        elif protocol == pickle.HIGHEST_PROTOCOL:
            notes = f"Latest (Python {sys.version_info.major}.{sys.version_info.minor})"
        
        print(f"  {protocol:<12} {len(data):<15} {notes}")
    
    print()
    print(f"  Highest protocol: {pickle.HIGHEST_PROTOCOL}")
    print(f"  Default protocol: {pickle.DEFAULT_PROTOCOL}")
    print()


def demo_what_pickle_can_do():
    """Shows the power of pickle things JSON can't handle."""
    print("=" * 55)
    print("  Things Pickle Can Serialize (that JSON Can't)")
    print("=" * 55)
    print()
    
    # 1. Custom class instances
    horcrux = Horcrux("diary", "Tom Riddle's Diary",
                      memory={'year': 1943, 'victim': 'Myrtle'})
    data = pickle.dumps(horcrux)
    restored = pickle.loads(data)
    print(f"  1. Custom class:    {restored}")
    print(f"     Method call:     {restored.reveal()}")
    print(f"     Private attr:    {restored._secret}")
    print()
    
    # 2. Sets (not in JSON)
    original_set = {1, 2, 3, 'four', 'five'}
    restored_set = pickle.loads(pickle.dumps(original_set))
    print(f"  2. Set:             {restored_set}")
    print()
    
    # 3. Bytes
    original_bytes = b'\x00\x01\x02\xff'
    restored_bytes = pickle.loads(pickle.dumps(original_bytes))
    print(f"  3. Bytes:           {restored_bytes}")
    print()
    
    # 4. Tuples (preserved as tuples, not lists)
    original_tuple = (1, 'two', [3, 4])
    restored_tuple = pickle.loads(pickle.dumps(original_tuple))
    print(f"  4. Tuple:           {restored_tuple} (type: {type(restored_tuple).__name__})")
    print()
    
    # 5. Nested custom objects
    wizard = DarkWizard("Voldemort")
    wizard.create_horcrux(Horcrux("diary", "Diary"))
    wizard.create_horcrux(Horcrux("ring", "Gaunt Ring"))
    print()
    
    data = pickle.dumps(wizard)
    restored_wizard = pickle.loads(data)
    print(f"  5. Nested objects:  {restored_wizard}")
    for h in restored_wizard.horcruxes:
        print(f"     Horcrux:         {h}")
    print()


def demo_full_cycle():
    """Complete pickle save/load demonstration."""
    print("=" * 55)
    print("  Full Horcrux Cycle: Create → Save → Destroy → Restore")
    print("=" * 55)
    print()
    
    save_file = '_dark_wizard.pkl'
    
    # Create
    print("  Step 1: Create the Dark Wizard")
    wizard = DarkWizard("Tom Riddle")
    wizard.create_horcrux(Horcrux("diary", "Diary", {'year': 1943}))
    wizard.create_horcrux(Horcrux("ring", "Gaunt Ring", {'stone': 'Resurrection'}))
    wizard.create_horcrux(Horcrux("locket", "Slytherin Locket", {'location': 'cave'}))
    print()
    
    # Save
    print("  Step 2: Save (split soul to disk)")
    save_with_pickle(wizard, save_file)
    print()
    
    # Destroy
    print("  Step 3: Destroy original")
    del wizard
    print("    Original wizard object destroyed.")
    print()
    
    # Restore
    print("  Step 4: Resurrect from pickle horcrux")
    restored = load_with_pickle(save_file)
    print(f"    Name: {restored.name}")
    print(f"    Power: {restored.power_level}")
    print(f"    Horcruxes: {len(restored.horcruxes)}")
    for h in restored.horcruxes:
        print(f"      #{h.creation_order}: {h.container} {h.memory}")
    
    # Cleanup
    if os.path.exists(save_file):
        os.remove(save_file)
    print()


if __name__ == '__main__':
    demo_pickle_protocols()
    demo_what_pickle_can_do()
    demo_full_cycle()
