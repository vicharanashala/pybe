"""
Demonstration of conceptual heap vs stack allocation in Python.
Python manages most memory on the private heap, but we can conceptually
discuss local variable frames vs dynamically allocated objects.
"""

def stack_heavy_recursion(n):
    """
    Demonstrates stack growth. Python limits recursion depth to prevent
    stack overflow (which crashes C programs).
    """
    if n == 0:
        return 0
    # local variable `x` is conceptually on the call stack frame
    x = 1 
    return x + stack_heavy_recursion(n - 1)

def heap_allocation():
    """
    Demonstrates heap allocation. Large objects are allocated on the Python heap
    and managed by the memory manager (reference counting + GC).
    """
    large_list = [i for i in range(1000000)]
    return len(large_list)

if __name__ == "__main__":
    print("Running heap allocation...")
    print(f"List length: {heap_allocation()}")
    
    print("Running stack recursion...")
    import sys
    sys.setrecursionlimit(2000)
    print(f"Recursion result: {stack_heavy_recursion(1500)}")
