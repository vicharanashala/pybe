"""
refcount_inspection.py sys.getrefcount() Exploration
=======================================================
Python's primary garbage collection mechanism is reference counting.
Every object has an internal counter tracking how many references point
to it. When it drops to zero, the object is immediately freed.

This script explores sys.getrefcount() to make the invisible visible.
"""

import sys
import ctypes


def basic_refcount():
    """Demonstrates basic reference counting behavior."""
    print("=== Basic Reference Counting ===")
    print()
    
    # Create a list object
    my_list = [1, 2, 3]
    
    # sys.getrefcount() itself creates a temporary reference,
    # so the count is always 1 more than you'd expect
    count = sys.getrefcount(my_list)
    print(f"After creation:         refcount = {count} (includes getrefcount's own ref)")
    print(f"Actual references:      {count - 1}")
    
    # Add another reference
    alias = my_list
    count = sys.getrefcount(my_list)
    print(f"After alias = my_list:  refcount = {count} (actual: {count - 1})")
    
    # Put it in a list
    container = [my_list]
    count = sys.getrefcount(my_list)
    print(f"After [my_list]:        refcount = {count} (actual: {count - 1})")
    
    # Remove the alias
    del alias
    count = sys.getrefcount(my_list)
    print(f"After del alias:        refcount = {count} (actual: {count - 1})")
    
    # Remove from container
    container.clear()
    count = sys.getrefcount(my_list)
    print(f"After container.clear:  refcount = {count} (actual: {count - 1})")
    print()


def refcount_with_functions():
    """Shows how function calls temporarily increase reference counts."""
    print("=== Reference Counts in Function Calls ===")
    print()
    
    def process(obj):
        """When this function is called, 'obj' is a new reference."""
        inner_count = sys.getrefcount(obj)
        print(f"  Inside process():  refcount = {inner_count} (actual: {inner_count - 1})")
        # obj parameter + my_data + getrefcount's temporary = 3 visible
        return obj
    
    my_data = {"key": "value"}
    
    outer_count = sys.getrefcount(my_data)
    print(f"Before function call:  refcount = {outer_count} (actual: {outer_count - 1})")
    
    result = process(my_data)
    
    after_count = sys.getrefcount(my_data)
    print(f"After function call:   refcount = {after_count} (actual: {after_count - 1})")
    # 'result' now also points to the same object
    
    del result
    final_count = sys.getrefcount(my_data)
    print(f"After del result:      refcount = {final_count} (actual: {final_count - 1})")
    print()


def integer_caching_surprise():
    """
    Python caches small integers (-5 to 256) for performance.
    This means their reference counts are surprisingly high!
    """
    print("=== Integer Caching Surprise ===")
    print()
    
    # Small integers are cached many things reference them
    small_int = 42
    print(f"refcount of 42:    {sys.getrefcount(small_int)}")
    print(f"refcount of 0:     {sys.getrefcount(0)}")
    print(f"refcount of 1:     {sys.getrefcount(1)}")
    print(f"refcount of True:  {sys.getrefcount(True)}")  # True is 1 internally
    
    # Large integers are NOT cached fresh object each time
    large_int = 99999
    print(f"refcount of 99999: {sys.getrefcount(large_int)}")
    
    # None is referenced everywhere in Python
    print(f"refcount of None:  {sys.getrefcount(None)}")
    print()
    print("KEY INSIGHT: Small integers have high refcounts because Python")
    print("pre-allocates and reuses them. None is referenced by almost everything.")
    print()


def raw_refcount_via_ctypes():
    """
    Reads the raw ob_refcnt field from the CPython object struct using ctypes.
    This bypasses sys.getrefcount's +1 bias.
    """
    print("=== Raw Reference Count via ctypes ===")
    print()
    
    obj = [10, 20, 30]
    
    # id(obj) gives the memory address of the object
    address = id(obj)
    
    # The first field of every CPython PyObject is ob_refcnt (a Py_ssize_t)
    raw_refcount = ctypes.c_ssize_t.from_address(address).value
    sys_refcount = sys.getrefcount(obj)
    
    print(f"Object:            {obj}")
    print(f"Memory address:    {hex(address)}")
    print(f"Raw ob_refcnt:     {raw_refcount}")
    print(f"sys.getrefcount:   {sys_refcount}")
    print(f"Difference:        {sys_refcount - raw_refcount} (getrefcount's temporary ref)")
    print()


if __name__ == '__main__':
    basic_refcount()
    refcount_with_functions()
    integer_caching_surprise()
    raw_refcount_via_ctypes()
