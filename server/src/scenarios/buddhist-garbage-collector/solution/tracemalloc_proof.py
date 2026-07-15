"""
tracemalloc_proof.py Live Memory Leak Proof
===============================================
Uses tracemalloc to provide concrete evidence that circular references
cause memory leaks, and that gc.collect() reclaims the leaked memory.

Think of tracemalloc as a meditation practice: it brings awareness
to what's happening beneath the surface of your program.
"""

import gc
import tracemalloc


class Thought:
    """
    A thought that can cling to another thought (circular attachment).
    In Buddhist philosophy, clinging (upādāna) is one of the 12 links
    of dependent origination that perpetuates suffering.
    """
    def __init__(self, content):
        self.content = content
        self.clings_to = None
        # Allocate some data to make memory usage more visible
        self.mental_weight = bytearray(1024)  # 1 KB of "mental burden"
    
    def __repr__(self):
        return f"Thought('{self.content}')"


def create_clinging_thoughts(n):
    """
    Creates n pairs of mutually-clinging thoughts.
    Each pair forms a reference cycle that cannot be freed by refcounting.
    """
    for i in range(n):
        thought_a = Thought(f"desire-{i}")
        thought_b = Thought(f"aversion-{i}")
        
        # Mutual clinging a reference cycle
        thought_a.clings_to = thought_b
        thought_b.clings_to = thought_a
        
        # Both go out of scope here, but refcount never reaches 0
        # because each still references the other!


def prove_memory_leak():
    """Demonstrates the leak with tracemalloc snapshots."""
    print("=" * 60)
    print("  Memory Leak Proof: Clinging Thoughts")
    print("=" * 60)
    print()
    
    # Disable the cycle collector so leaks are visible
    gc.disable()
    
    # Start memory tracing
    tracemalloc.start()
    
    # --- Snapshot 1: Baseline ---
    snapshot_before = tracemalloc.take_snapshot()
    current_before, peak_before = tracemalloc.get_traced_memory()
    print(f"📸 Snapshot 1 (baseline):")
    print(f"   Current memory: {current_before / 1024:.2f} KB")
    print()
    
    # --- Create circular references (leaked thoughts) ---
    print("Creating 100 pairs of clinging thoughts...")
    create_clinging_thoughts(100)
    print()
    
    # --- Snapshot 2: After leak ---
    snapshot_after_leak = tracemalloc.take_snapshot()
    current_leaked, peak_leaked = tracemalloc.get_traced_memory()
    print(f"📸 Snapshot 2 (after creating 100 circular pairs):")
    print(f"   Current memory: {current_leaked / 1024:.2f} KB")
    print(f"   Memory growth:  {(current_leaked - current_before) / 1024:.2f} KB")
    print()
    
    # --- Show top memory consumers ---
    print("Top 5 memory allocations (by size):")
    stats = snapshot_after_leak.compare_to(snapshot_before, 'lineno')
    for i, stat in enumerate(stats[:5]):
        print(f"   {i+1}. {stat}")
    print()
    
    # --- Now enable GC and collect (the "letting go") ---
    print("🪷 Enabling garbage collector and collecting (letting go)...")
    gc.enable()
    collected = gc.collect()
    print(f"   GC collected {collected} objects")
    print()
    
    # --- Snapshot 3: After collection ---
    current_after_gc, peak_after_gc = tracemalloc.get_traced_memory()
    print(f"📸 Snapshot 3 (after garbage collection):")
    print(f"   Current memory: {current_after_gc / 1024:.2f} KB")
    print(f"   Memory freed:   {(current_leaked - current_after_gc) / 1024:.2f} KB")
    print()
    
    # --- Summary ---
    print("=" * 60)
    print("  Summary")
    print("=" * 60)
    print(f"  Baseline:     {current_before / 1024:>8.2f} KB")
    print(f"  After leak:   {current_leaked / 1024:>8.2f} KB  (+{(current_leaked - current_before) / 1024:.2f} KB)")
    print(f"  After GC:     {current_after_gc / 1024:>8.2f} KB  (-{(current_leaked - current_after_gc) / 1024:.2f} KB)")
    print()
    
    if current_leaked > current_before * 1.5:
        print("  ✓ PROVED: Circular references caused measurable memory leak")
    if current_after_gc < current_leaked:
        print("  ✓ PROVED: gc.collect() reclaimed the leaked memory")
    
    tracemalloc.stop()


if __name__ == '__main__':
    prove_memory_leak()
