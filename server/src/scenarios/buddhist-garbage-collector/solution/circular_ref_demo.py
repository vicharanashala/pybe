"""
circular_ref_demo.py Circular Reference Memory Leak
======================================================
In Buddhism, attachment (upādāna) causes suffering. In Python, circular
references cause memory leaks when the garbage collector is disabled.

This script demonstrates how two objects that reference each other cannot
be freed by reference counting alone they are "attached" and neither
can "let go" even when no external references exist.
"""

import gc
import sys


class Monk:
    """A monk who can be attached to another monk."""
    def __init__(self, name):
        self.name = name
        self.attached_to = None  # Will hold a reference to another Monk
    
    def __repr__(self):
        return f"Monk('{self.name}')"
    
    def __del__(self):
        # This is called when the object is actually garbage collected
        print(f"  🪷 {self.name} has been freed (let go).")


def demo_no_circular_ref():
    """Without circular references, objects are freed immediately."""
    print("=== No Circular Reference (Clean Detachment) ===")
    print()
    
    gc.disable()  # Disable the cycle collector
    
    monk_a = Monk("Ananda")
    monk_b = Monk("Bodhi")
    
    # One-way reference only no cycle
    monk_a.attached_to = monk_b
    
    print(f"Refcount of Bodhi: {sys.getrefcount(monk_b) - 1}")  # -1 for getrefcount's own ref
    print(f"Refcount of Ananda: {sys.getrefcount(monk_a) - 1}")
    
    print("\nDeleting both references...")
    del monk_a
    del monk_b
    # Both should be freed immediately by reference counting
    
    print("(If you saw '🪷 freed' messages above, reference counting worked!)")
    print()
    gc.enable()


def demo_circular_ref_leak():
    """With circular references, objects LEAK when GC is disabled."""
    print("=== Circular Reference (Attachment → Suffering) ===")
    print()
    
    gc.disable()  # Disable the cycle collector
    
    monk_a = Monk("Ananda")
    monk_b = Monk("Bodhi")
    
    # Create circular attachment: A → B → A (a cycle!)
    monk_a.attached_to = monk_b
    monk_b.attached_to = monk_a
    
    print(f"Refcount of Ananda: {sys.getrefcount(monk_a) - 1}")  # 2: monk_a + monk_b.attached_to
    print(f"Refcount of Bodhi:  {sys.getrefcount(monk_b) - 1}")  # 2: monk_b + monk_a.attached_to
    
    print("\nDeleting our references (but the cycle remains)...")
    del monk_a
    del monk_b
    
    # Neither monk is freed! Their mutual attachment keeps refcount at 1.
    print("Neither monk was freed! They are trapped by mutual attachment.")
    print(f"Uncollectable garbage objects: {gc.garbage}")
    
    print("\nNow enabling GC and forcing collection (the 'letting go')...")
    gc.enable()
    collected = gc.collect()
    print(f"GC collected {collected} objects.")
    print()


def demo_growing_leak():
    """Shows how circular references accumulate and leak memory."""
    print("=== Growing Leak: Many Circular Pairs ===")
    print()
    
    gc.disable()
    
    # Create many circular pairs none will be freed!
    for i in range(5):
        a = Monk(f"Monk-{i}A")
        b = Monk(f"Monk-{i}B")
        a.attached_to = b
        b.attached_to = a
        # When 'a' and 'b' go out of scope at end of loop iteration,
        # they should be freed... but they won't be, due to the cycle.
    
    print("Created 5 circular pairs. None were freed!")
    print("In a real application, this would be a slow memory leak.")
    
    gc.enable()
    collected = gc.collect()
    print(f"\nGC cleanup collected {collected} objects.")
    print()


if __name__ == '__main__':
    demo_no_circular_ref()
    demo_circular_ref_leak()
    demo_growing_leak()
