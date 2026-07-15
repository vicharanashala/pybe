"""
weakref_solution.py The Non-Attachment Fix
=============================================
In Buddhism, non-attachment (nekkhamma) is the path to liberation.
In Python, weakref.ref() creates a reference that does NOT increase
the reference count it "lets go" of ownership.

This script shows how weak references break circular reference cycles,
preventing memory leaks without needing the garbage collector.
"""

import gc
import sys
import weakref


class Being:
    """A being that can form relationships with others."""
    
    def __init__(self, name):
        self.name = name
        self._friend = None       # Strong reference
        self._weak_friend = None   # Will hold a weak reference
        self.karma = bytearray(512)  # Some data to track in memory
    
    def __repr__(self):
        return f"Being('{self.name}')"
    
    def __del__(self):
        print(f"  🪷 {self.name} has been liberated (freed from memory).")
    
    # --- Strong attachment (causes cycles) ---
    def attach_strongly(self, other):
        """Creates a strong reference increases other's refcount."""
        self._friend = other
        print(f"  {self.name} strongly attached to {other.name}")
    
    # --- Weak attachment (breaks cycles) ---
    def attach_weakly(self, other):
        """Creates a weak reference does NOT increase other's refcount."""
        self._weak_friend = weakref.ref(other, self._on_friend_freed)
        print(f"  {self.name} weakly attached to {other.name}")
    
    def _on_friend_freed(self, ref):
        """Callback when the weakly-referenced friend is freed."""
        print(f"  📢 {self.name}'s weak friend was freed. Reference is now None.")
    
    def get_friend(self):
        """Safely access the weak reference."""
        if self._weak_friend is not None:
            # Calling a weakref returns the object, or None if it was collected
            friend = self._weak_friend()
            if friend is not None:
                return friend
            else:
                return None
        return self._friend


def demo_problem_strong_refs():
    """Shows the problem: strong circular refs prevent cleanup."""
    print("=" * 60)
    print("  Problem: Strong Circular References")
    print("=" * 60)
    print()
    
    gc.disable()  # Disable GC to expose the problem
    
    siddhartha = Being("Siddhartha")
    mara = Being("Mara")
    
    # Mutual strong attachment (a cycle)
    siddhartha.attach_strongly(mara)
    mara.attach_strongly(siddhartha)
    
    print(f"\n  Refcount of Siddhartha: {sys.getrefcount(siddhartha) - 1}")
    print(f"  Refcount of Mara:      {sys.getrefcount(mara) - 1}")
    
    print("\n  Deleting our references...")
    del siddhartha
    del mara
    
    print("  ❌ Neither being was freed! They are trapped by mutual attachment.")
    print()
    
    gc.enable()
    gc.collect()  # Clean up for the next demo


def demo_solution_weak_refs():
    """Shows the solution: one weak reference breaks the cycle."""
    print("=" * 60)
    print("  Solution: Weak Reference (Non-Attachment)")
    print("=" * 60)
    print()
    
    gc.disable()  # Disable GC we don't need it!
    
    siddhartha = Being("Siddhartha")
    mara = Being("Mara")
    
    # Siddhartha holds a strong ref to Mara
    siddhartha.attach_strongly(mara)
    # Mara holds only a WEAK ref to Siddhartha (non-attachment)
    mara.attach_weakly(siddhartha)
    
    print(f"\n  Refcount of Siddhartha: {sys.getrefcount(siddhartha) - 1}")
    print(f"  Refcount of Mara:      {sys.getrefcount(mara) - 1}")
    print("  (Siddhartha's refcount is lower because Mara's ref is weak!)")
    
    # Before deletion, the weak ref works
    print(f"\n  Mara's friend via weakref: {mara.get_friend()}")
    
    print("\n  Deleting Siddhartha...")
    del siddhartha
    # Siddhartha should be freed immediately (refcount → 0)
    
    print(f"  Mara's friend via weakref: {mara.get_friend()}")
    
    print("\n  Deleting Mara...")
    del mara
    # Mara should also be freed immediately
    
    print("\n  ✓ Both beings were freed without needing the GC!")
    print()
    
    gc.enable()


def demo_weakref_utilities():
    """Shows additional weakref tools: WeakValueDictionary, finalize."""
    print("=" * 60)
    print("  Bonus: weakref Utilities")
    print("=" * 60)
    print()
    
    # --- WeakValueDictionary: a cache that auto-cleans ---
    print("  WeakValueDictionary (auto-cleaning cache):")
    cache = weakref.WeakValueDictionary()
    
    obj = Being("Cached-Being")
    cache['being'] = obj
    print(f"    Cache has 'being': {'being' in cache}")
    
    del obj
    print(f"    After del, cache has 'being': {'being' in cache}")
    print()
    
    # --- finalize: guaranteed cleanup action ---
    print("  weakref.finalize (guaranteed cleanup):")
    obj2 = Being("Finalized-Being")
    
    def cleanup(name):
        print(f"    🧹 Cleanup action for {name} executed!")
    
    finalizer = weakref.finalize(obj2, cleanup, "Finalized-Being")
    print(f"    Finalizer alive: {finalizer.alive}")
    
    del obj2
    print(f"    Finalizer alive after del: {finalizer.alive}")
    print()


if __name__ == '__main__':
    demo_problem_strong_refs()
    demo_solution_weak_refs()
    demo_weakref_utilities()
