"""
shelve_demo.py Key-Value Persistence with shelve
====================================================
shelve is like a persistent dictionary it combines the convenience
of a dict with the durability of a file. Under the hood, it uses
pickle for serialization and dbm for key-value storage.

Perfect for when you want to store multiple "horcruxes" (checkpoints)
in a single file, accessed by key.
"""

import shelve
import os
import time
import glob


class HorcruxVault:
    """
    A vault that stores multiple horcruxes (save states) using shelve.
    Each horcrux is accessed by a key, just like a dictionary.
    """
    
    def __init__(self, vault_name='_horcrux_vault'):
        self.vault_name = vault_name
    
    def store(self, key, data):
        """
        Store data under a key. Data can be any picklable object.
        
        shelve.open() creates/opens a persistent dict-like object.
        The 'with' statement ensures it's properly closed and flushed.
        """
        with shelve.open(self.vault_name) as vault:
            vault[key] = {
                'data': data,
                'stored_at': time.time(),
                'type': type(data).__name__,
            }
        print(f"  💾 Stored '{key}' in vault")
    
    def retrieve(self, key):
        """Retrieve data by key."""
        with shelve.open(self.vault_name) as vault:
            if key in vault:
                entry = vault[key]
                print(f"  🔮 Retrieved '{key}' (stored as {entry['type']})")
                return entry['data']
            else:
                print(f"  ❌ Key '{key}' not found in vault")
                return None
    
    def list_keys(self):
        """List all keys in the vault."""
        with shelve.open(self.vault_name) as vault:
            return list(vault.keys())
    
    def delete(self, key):
        """Delete a specific horcrux."""
        with shelve.open(self.vault_name) as vault:
            if key in vault:
                del vault[key]
                print(f"  🗑️  Destroyed horcrux '{key}'")
            else:
                print(f"  ⚠️  Key '{key}' not found")
    
    def destroy_vault(self):
        """Remove all vault files from disk."""
        # shelve creates platform-dependent files (.db, .dir, .bak, .dat)
        patterns = [
            f'{self.vault_name}',
            f'{self.vault_name}.db',
            f'{self.vault_name}.dir',
            f'{self.vault_name}.bak',
            f'{self.vault_name}.dat',
        ]
        for pattern in patterns:
            for filepath in glob.glob(pattern):
                try:
                    os.remove(filepath)
                except OSError:
                    pass


def demo_basic_shelve():
    """Demonstrates basic shelve operations."""
    print("=" * 55)
    print("  shelve Basics: Persistent Dictionary")
    print("=" * 55)
    print()
    
    shelf_name = '_demo_shelf'
    
    # --- Store data ---
    print("  Writing to shelf (like dict assignment):")
    with shelve.open(shelf_name) as db:
        db['player'] = {'name': 'Harry', 'house': 'Gryffindor'}
        db['score'] = 9750
        db['inventory'] = ['wand', 'cloak', 'map']
        db['settings'] = {'difficulty': 'hard', 'music': True}
    
    print("    db['player'] = {...}")
    print("    db['score'] = 9750")
    print("    db['inventory'] = ['wand', 'cloak', 'map']")
    print("    db['settings'] = {...}")
    print()
    
    # --- Read data (in a separate open proving persistence) ---
    print("  Reading from shelf (new open data persisted!):")
    with shelve.open(shelf_name) as db:
        print(f"    Player: {db['player']}")
        print(f"    Score: {db['score']}")
        print(f"    Items: {db['inventory']}")
        print(f"    Keys: {list(db.keys())}")
    print()
    
    # --- Modify data ---
    print("  ⚠️ Gotcha: Mutable value modification")
    with shelve.open(shelf_name) as db:
        # This does NOT work by default!
        db['inventory'].append('stone')  # Modifies a copy, not the shelf
        print(f"    After append (no writeback): {db['inventory']}")
        # inventory still has 3 items!
    print()
    
    print("  ✓ Fix: Use writeback=True")
    with shelve.open(shelf_name, writeback=True) as db:
        db['inventory'].append('stone')  # Now it works!
        print(f"    After append (with writeback): {db['inventory']}")
    print()
    
    # Verify the fix persisted
    with shelve.open(shelf_name) as db:
        print(f"  Verified persistence: {db['inventory']}")
    
    # Cleanup
    for ext in ['', '.db', '.dir', '.bak', '.dat']:
        path = shelf_name + ext
        if os.path.exists(path):
            os.remove(path)
    print()


def demo_horcrux_vault():
    """Demonstrates the HorcruxVault pattern."""
    print("=" * 55)
    print("  Horcrux Vault: Multiple Save States")
    print("=" * 55)
    print()
    
    vault = HorcruxVault('_horcrux_vault')
    
    # --- Create multiple horcruxes ---
    print("  Creating horcruxes...")
    vault.store('diary', {
        'owner': 'Tom Riddle',
        'year': 1943,
        'location': 'Malfoy Manor',
        'destroyed_by': 'Basilisk Fang',
    })
    
    vault.store('ring', {
        'owner': 'Marvolo Gaunt',
        'stone': 'Resurrection Stone',
        'location': 'Gaunt Shack',
        'destroyed_by': 'Sword of Gryffindor',
    })
    
    vault.store('locket', {
        'owner': 'Salazar Slytherin',
        'location': 'Cave',
        'destroyed_by': 'Sword of Gryffindor',
    })
    print()
    
    # --- List all horcruxes ---
    print("  Horcruxes in vault:")
    keys = vault.list_keys()
    for key in keys:
        print(f"    🔑 {key}")
    print()
    
    # --- Retrieve specific horcrux ---
    print("  Retrieving 'ring':")
    ring_data = vault.retrieve('ring')
    if ring_data:
        for k, v in ring_data.items():
            print(f"    {k}: {v}")
    print()
    
    # --- Delete a horcrux ---
    print("  Destroying 'diary':")
    vault.delete('diary')
    print(f"  Remaining: {vault.list_keys()}")
    print()
    
    # Cleanup
    vault.destroy_vault()


def demo_shelve_vs_alternatives():
    """Compare shelve with json and pickle."""
    print("=" * 55)
    print("  Comparison: shelve vs json vs pickle")
    print("=" * 55)
    print()
    print("  ┌──────────────────┬──────────┬──────────┬──────────┐")
    print("  │ Feature          │ JSON     │ pickle   │ shelve   │")
    print("  ├──────────────────┼──────────┼──────────┼──────────┤")
    print("  │ Human readable   │ ✓ Yes    │ ✗ No     │ ✗ No     │")
    print("  │ Custom classes   │ ✗ No     │ ✓ Yes    │ ✓ Yes    │")
    print("  │ Key-value access │ ✗ No*    │ ✗ No     │ ✓ Yes    │")
    print("  │ Partial read     │ ✗ No     │ ✗ No     │ ✓ Yes    │")
    print("  │ Cross-language   │ ✓ Yes    │ ✗ No     │ ✗ No     │")
    print("  │ Security         │ ✓ Safe   │ ✗ Unsafe │ ✗ Unsafe │")
    print("  │ Speed            │ Medium   │ Fast     │ Fast     │")
    print("  │ File format      │ .json    │ .pkl     │ .db      │")
    print("  └──────────────────┴──────────┴──────────┴──────────┘")
    print()
    print("  * JSON can be loaded into a dict, but you must load the entire file.")
    print("    shelve lets you access individual keys without loading everything.")
    print()
    print("  When to use shelve:")
    print("    • Multiple named save slots (like game save files)")
    print("    • Configuration storage with complex Python objects")
    print("    • Quick prototyping (when you don't need a real database)")
    print()


if __name__ == '__main__':
    demo_basic_shelve()
    demo_horcrux_vault()
    demo_shelve_vs_alternatives()
