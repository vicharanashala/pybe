"""
embedded_context.py MicroPython Simulation
=============================================
MicroPython runs on microcontrollers with very limited RAM (e.g., 256 KB).
It uses ONLY reference counting there is NO cycle collector (gc.collect
exists but only does a mark-and-sweep, which is expensive and manual).

This simulation shows why understanding reference counting is critical
in embedded contexts, and demonstrates manual memory management patterns.
"""

import gc
import sys


# ==============================================================
# Simulated MicroPython Environment
# ==============================================================

class MicroPythonVM:
    """
    Simulates a MicroPython runtime with limited heap memory.
    In real MicroPython, you'd have 32-256 KB of RAM total.
    """
    
    HEAP_SIZE = 4096  # Simulate 4 KB heap (tiny!)
    
    def __init__(self):
        self.allocated = 0
        self.objects = []
        self.freed_count = 0
        print(f"  MicroPython VM started. Heap: {self.HEAP_SIZE} bytes")
    
    def malloc(self, name, size):
        """Simulate memory allocation."""
        if self.allocated + size > self.HEAP_SIZE:
            print(f"  ❌ MemoryError: Cannot allocate {size} bytes for '{name}'")
            print(f"     ({self.allocated}/{self.HEAP_SIZE} bytes used)")
            raise MemoryError(f"Heap exhausted allocating '{name}'")
        
        self.allocated += size
        self.objects.append((name, size))
        print(f"  ✓ Allocated '{name}': {size} bytes ({self.allocated}/{self.HEAP_SIZE} used)")
        return True
    
    def free(self, name):
        """Simulate memory deallocation."""
        for i, (obj_name, size) in enumerate(self.objects):
            if obj_name == name:
                self.allocated -= size
                self.objects.pop(i)
                self.freed_count += 1
                print(f"  🗑️  Freed '{name}': {size} bytes ({self.allocated}/{self.HEAP_SIZE} used)")
                return True
        print(f"  ⚠️  '{name}' not found in heap")
        return False
    
    def status(self):
        """Print heap status."""
        free = self.HEAP_SIZE - self.allocated
        print(f"  Heap: {self.allocated} used / {free} free / {self.HEAP_SIZE} total")
        print(f"  Objects: {len(self.objects)}, Freed so far: {self.freed_count}")


# ==============================================================
# Demo 1: Proper Manual Memory Management
# ==============================================================

def demo_manual_management():
    """Shows the embedded pattern: allocate, use, free explicitly."""
    print("=" * 60)
    print("  Demo 1: Manual Memory Management (Embedded Pattern)")
    print("=" * 60)
    print()
    
    vm = MicroPythonVM()
    
    # Simulate a sensor reading loop on a microcontroller
    print("\n  --- Sensor Reading Loop ---")
    for reading_num in range(3):
        # Allocate a buffer for sensor data
        buffer_name = f"sensor_buf_{reading_num}"
        vm.malloc(buffer_name, 256)
        
        # "Process" the data
        print(f"  📡 Processing sensor reading #{reading_num}...")
        
        # CRITICAL: Free the buffer immediately after use!
        # In MicroPython, you can't rely on GC to do this promptly.
        vm.free(buffer_name)
    
    print()
    vm.status()
    print()


# ==============================================================
# Demo 2: Memory Leak in Embedded Context
# ==============================================================

def demo_embedded_leak():
    """Shows how forgetting to free causes heap exhaustion."""
    print("=" * 60)
    print("  Demo 2: Memory Leak → Heap Exhaustion")
    print("=" * 60)
    print()
    
    vm = MicroPythonVM()
    
    print("\n  --- Leaky Sensor Loop (never frees buffers) ---")
    try:
        for reading_num in range(20):
            buffer_name = f"leaked_buf_{reading_num}"
            vm.malloc(buffer_name, 256)
            # BUG: We never call vm.free()!
            # On a microcontroller, this crashes the device.
    except MemoryError:
        print(f"\n  💀 Device crashed! Heap exhausted after {len(vm.objects)} allocations.")
    
    print()
    vm.status()
    print()


# ==============================================================
# Demo 3: Object Pool Pattern (Embedded Best Practice)
# ==============================================================

class ObjectPool:
    """
    Pre-allocates a fixed number of reusable objects.
    This is the standard pattern in embedded/MicroPython systems
    to avoid dynamic allocation entirely.
    
    In Buddhist terms: instead of creating and destroying attachments,
    maintain a stable pool of relationships.
    """
    
    def __init__(self, size):
        self.size = size
        # Pre-allocate all objects upfront
        self.pool = [bytearray(64) for _ in range(size)]
        self.available = list(range(size))  # Indices of free objects
        self.in_use = []
        print(f"  Object pool created: {size} pre-allocated buffers (64 bytes each)")
    
    def acquire(self):
        """Get an object from the pool (no allocation!)."""
        if not self.available:
            raise MemoryError("Pool exhausted!")
        
        idx = self.available.pop()
        self.in_use.append(idx)
        # Clear the buffer for reuse
        for i in range(len(self.pool[idx])):
            self.pool[idx][i] = 0
        return idx, self.pool[idx]
    
    def release(self, idx):
        """Return an object to the pool (no deallocation!)."""
        if idx in self.in_use:
            self.in_use.remove(idx)
            self.available.append(idx)
    
    def status(self):
        print(f"  Pool: {len(self.available)} available, {len(self.in_use)} in use")


def demo_object_pool():
    """Demonstrates the object pool pattern for embedded systems."""
    print("=" * 60)
    print("  Demo 3: Object Pool Pattern (Zero Allocation)")
    print("=" * 60)
    print()
    
    pool = ObjectPool(size=4)
    pool.status()
    
    print("\n  --- Simulating 10 sensor readings with 4-buffer pool ---")
    for reading in range(10):
        idx, buf = pool.acquire()
        
        # Write "sensor data" into the buffer
        buf[0] = reading & 0xFF
        print(f"  Reading #{reading}: used buffer[{idx}], value={buf[0]}")
        
        # Release the buffer back to the pool
        pool.release(idx)
    
    print()
    pool.status()
    print()
    print("  ✓ Processed 10 readings using only 4 pre-allocated buffers!")
    print("  ✓ Zero dynamic memory allocation during the loop!")
    print()


# ==============================================================
# Demo 4: CPython vs MicroPython GC Differences
# ==============================================================

def demo_gc_differences():
    """
    Shows the differences between CPython and MicroPython garbage collection.
    We demonstrate this using CPython's gc module with commentary.
    """
    print("=" * 60)
    print("  Demo 4: CPython vs MicroPython GC Comparison")
    print("=" * 60)
    print()
    
    print("  ┌──────────────────┬───────────────────┬──────────────────┐")
    print("  │ Feature          │ CPython           │ MicroPython      │")
    print("  ├──────────────────┼───────────────────┼──────────────────┤")
    print("  │ Ref counting     │ ✓ Automatic       │ ✓ Automatic      │")
    print("  │ Cycle collector  │ ✓ Generational    │ ✗ None/basic     │")
    print("  │ gc.collect()     │ Collects cycles   │ Mark-and-sweep   │")
    print("  │ Typical RAM      │ GBs              │ 32-256 KB        │")
    print("  │ __del__ reliable │ ✓ Yes             │ ⚠️  Unreliable    │")
    print("  │ weakref          │ ✓ Full support    │ ✗ Not available  │")
    print("  └──────────────────┴───────────────────┴──────────────────┘")
    print()
    
    # Show CPython's generational GC stats
    print("  CPython's generational GC thresholds:")
    thresholds = gc.get_threshold()
    print(f"    Gen 0 (young):  collect after {thresholds[0]} allocations")
    print(f"    Gen 1 (middle): collect after {thresholds[1]} gen-0 collections")
    print(f"    Gen 2 (old):    collect after {thresholds[2]} gen-1 collections")
    print()
    
    print("  KEY TAKEAWAY for embedded systems:")
    print("  • Never create circular references (no cycle collector!)")
    print("  • Use object pools instead of dynamic allocation")
    print("  • Manually delete large objects with 'del' when done")
    print("  • Call gc.collect() explicitly if using MicroPython's GC")
    print()


if __name__ == '__main__':
    demo_manual_management()
    demo_embedded_leak()
    demo_object_pool()
    demo_gc_differences()
