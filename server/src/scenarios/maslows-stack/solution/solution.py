"""
Maslow's Stack - Exploring Software Abstraction Layers with ctypes

This scenario explores the layers of software abstraction using the ctypes module
to peek under Python's hood. The philosophical anchor is Maslow's Hierarchy of Needs:
just as human self-actualization requires a foundation of physiological needs,
Python's elegant high-level abstractions rest entirely on C's raw memory management.

Key Concepts:
- CPython: The reference Python implementation written in C
- id(): Returns the memory address of a Python object
- ctypes: Python's foreign function interface for C libraries
- Memory addresses: Python objects are C structs in memory
- Reference counting: How CPython manages object lifetime
- Software abstraction layers: From machine code to high-level Python

The scenario reveals that when you write Python, you're building on a foundation
of C code that handles memory allocation, pointer arithmetic, and raw computation.
"""

import ctypes
import sys
import os


def explain_ctypes_and_memory_layers():
    """
    Explain the relationship between Python and C memory model.
    """
    print("=" * 70)
    print("SOFTWARE ABSTRACTION LAYERS: From Python to Machine Code")
    print("=" * 70)

    print("""
    MASLOW'S HIERARCHY OF NEEDS (for humans):
    ┌─────────────────────────────┐
    │     Self-Actualization      │  ← The top: creativity, problem-solving
    ├─────────────────────────────┤
    │        Esteem               │  ← Status, respect, achievement
    ├─────────────────────────────┤
    │      Love and Belonging     │  ← Relationships, community
    ├─────────────────────────────┤
    │    Safety Needs             │  ← Security, protection
    ├─────────────────────────────┤
    │  Physiological Needs        │  ← Food, water, shelter (foundation)
    └─────────────────────────────┘

    SOFTWARE HIERARCHY (for Python):
    ┌─────────────────────────────┐
    │      Your Python Code       │  ← Elegant, readable, high-level
    ├─────────────────────────────┤
    │    Python Runtime           │  ← Garbage collection, exceptions
    ├─────────────────────────────┤
    │     CPython (C code)        │  ← The interpreter implementation
    ├─────────────────────────────┤
    │   C Standard Library        │  ← memmove, malloc, printf
    ├─────────────────────────────┤
    │    Operating System         │  ← Linux kernel, Windows API
    ├─────────────────────────────┤
    │   Assembly / Machine Code   │  ← 0s and 1s, registers, memory
    └─────────────────────────────┘

    Just as a person cannot self-actualize without food and shelter,
    Python cannot exist without C managing memory and providing the
    underlying execution environment.
    """)


def demonstrate_object_identity():
    """
    Show how id() reveals the memory address of Python objects.
    """
    print("\n" + "=" * 70)
    print("OBJECT IDENTITY: The Memory Address Behind Every Object")
    print("=" * 70)

    print("""
    Every Python object exists somewhere in memory. The id() function
    returns the memory address (in CPython, this is the pointer value).

    In other languages:
    - C/C++: &variable gives the address
    - Java: System.identityHashCode(obj)
    - Go: reflect.ValueOf(obj).Pointer()

    Python makes it simple with id().
    """)

    # Create various objects and display their addresses
    objects = [
        42,                           # int
        "Hello, Infinity Stones",     # str
        [1, 2, 3],                    # list
        {"key": "value"},             # dict
        (1, 2, 3),                    # tuple (immutable)
        None,                         # None (singleton)
    ]

    print("\n  Memory addresses of various Python objects:")
    print("  " + "-" * 50)
    for obj in objects:
        addr = id(obj)
        type_name = type(obj).__name__
        # Show hex representation (how addresses are typically displayed)
        print(f"    {type_name:10} {repr(obj):20} @ address: 0x{addr:016x} ({addr})")

    print("""
    Notice:
    - Strings and small integers may be interned (reused)
    - Lists and dicts have unique addresses each time
    - id() returns the actual memory location in CPython
    """)


def demonstrate_ctypes_memory_read():
    """
    Use ctypes to read raw memory at a Python object's address.
    This demonstrates that Python objects are truly C structs.
    """
    print("\n" + "=" * 70)
    print("ctypes: Reading Raw Memory Like C")
    print("=" * 70)

    print("""
    ctypes is Python's foreign function interface. It allows:
    - Calling C functions from shared libraries (.dll, .so)
    - Creating C data types in Python
    - Reading/writing raw memory addresses

    Key ctypes types:
    - c_long: C long integer (platform-dependent, 32 or 64 bit)
    - c_int: C int
    - POINTER(c_long): Pointer to c_long
    - from_address: Create a ctypes object from a memory address

    WARNING: Reading arbitrary memory is undefined behavior!
    We only read addresses we know are valid (from id()).
    """)

    # Create a simple integer object
    number = 42
    addr = id(number)

    print(f"\n  Created integer object: {number}")
    print(f"  Memory address (id): 0x{addr:016x}")
    print(f"  Address as integer: {addr}")

    # Read the raw memory using ctypes
    # c_long.from_address creates a ctypes object that views memory at that address
    raw_value = ctypes.c_long.from_address(addr)

    print(f"\n  Reading memory via ctypes.c_long.from_address({addr}):")
    print(f"    Raw memory value: {raw_value.value}")
    print(f"    Type: {type(raw_value)}")

    print("""
    What does this value mean?

    In CPython, every object is a C struct. For an integer:
    struct _longobject {
        PyObject_HEAD       // Reference count + type pointer
        digit ob_digit[1];  // The actual integer value stored here
    };

    The c_long we read is the first field: the reference count
    (plus possibly part of the type pointer on some platforms).

    This demonstrates that Python objects are NOT magical -
    they are concrete data structures in memory, managed by C code.
    """)


def demonstrate_reference_counting():
    """
    Explain and demonstrate CPython's reference counting mechanism.
    """
    print("\n" + "=" * 70)
    print("REFERENCE COUNTING: How CPython Tracks Object Lifetime")
    print("=" * 70)

    print("""
    CPython uses reference counting (plus cyclic garbage collection)
    to manage memory. Every object has a reference count:

    - When you create/assign an object: refcount increases
    - When you delete a reference: refcount decreases
    - When refcount reaches 0: object is IMMEDIATELY deallocated

    This is why this works:

        import gc
        gc.disable()  # Disable cyclic GC for clarity

        a = []        # refcount = 1
        b = a         # refcount = 2
        del a         # refcount = 1
        del b         # refcount = 0 -> IMMEDIATE deallocation

    Unlike Java's GC (which runs asynchronously), CPython's refcount
    means objects die immediately when no longer referenced.
    """)

    # Create an object and check its reference count
    obj = {"key": "value", "number": 42}
    addr = id(obj)

    # sys.getrefcount returns count + 1 (it temporarily holds a reference)
    # So we subtract 1 to get the true count
    refcount = sys.getrefcount(obj) - 1

    print(f"\n  Object: {obj}")
    print(f"  Address: 0x{addr:x}")
    print(f"  Reference count: {refcount}")

    # Create more references
    obj2 = obj
    obj3 = obj

    refcount_with_refs = sys.getrefcount(obj) - 1
    print(f"\n  After assigning obj2 = obj, obj3 = obj:")
    print(f"  Reference count: {refcount_with_refs}")

    # Delete a reference
    del obj2
    refcount_after_del = sys.getrefcount(obj) - 1
    print(f"\n  After del obj2:")
    print(f"  Reference count: {refcount_after_del}")

    # Demonstrate with ctypes
    print(f"\n  Reading raw refcount via ctypes:")
    raw_refcount = ctypes.c_long.from_address(addr).value
    print(f"    Raw memory value at address: {raw_refcount}")

    print(f"""
    Note: The raw value from ctypes may differ from sys.getrefcount
    because ctypes reads a different memory location (the refcount field
    vs what sys.getrefcount reads). The principle remains: objects have
    an integer refcount field that tracks usage.
    """)


def demonstrate_memory_structure():
    """
    Show the memory layout of a Python object (conceptually).
    """
    print("\n" + "=" * 70)
    print("PYTHON OBJECT MEMORY LAYOUT (Conceptual)")
    print("=" * 70)

    print("""
    In CPython, a Python object in memory looks like this:

    For an integer object (42):

    Memory Address Layout:
    ┌──────────────────────────────────────────┐
    │  0x1004000:  Reference Count (8 bytes)   │  ← c_long
    ├──────────────────────────────────────────┤
    │  0x1004008:  Type Pointer (8 bytes)      │  → points to int type object
    ├──────────────────────────────────────────┤
    │  0x1004010:  ob_digit[0] = 42            │  → actual value stored here
    └──────────────────────────────────────────┘

    For a list object ([1, 2, 3]):

    ┌──────────────────────────────────────────┐
    │  Reference Count                         │
    ├──────────────────────────────────────────┤
    │  Type Pointer                            │
    ├──────────────────────────────────────────┤
    │  ob_size = 3 (element count)             │
    ├──────────────────────────────────────────┤
    │  ob_item = pointer to [1, 2, 3] array    │  → actual elements elsewhere
    ├──────────────────────────────────────────┤
    │  allocated = 4 (capacity hint)           │
    └──────────────────────────────────────────┘

    The list doesn't store 1, 2, 3 directly - it stores pointers to
    other objects that contain 1, 2, and 3. This is why:
        a = [1, 2, 3]
        b = a
        a.append(4)
    Both a and b see [1, 2, 3, 4] - they share the same list object.
    """)


def demonstrate_real_world_ctypes():
    """
    Show practical uses of ctypes in real libraries.
    """
    print("\n" + "=" * 70)
    print("ctypes IN THE WILD: Where This Matters")
    print("=" * 70)

    print("""
    1. NUMPY / PANDAS:
       - NumPy arrays are C contiguous memory blocks
       - ctypes or CFFI used to interface with C libraries
       - Operations like matrix multiply are SIMD vectorized C code

    2. TENSORFLOW / PYTORCH:
       - Core computation in C++/CUDA
       - Python provides the API, C++ does the heavy lifting
       - tf.constant() creates C++ tensor objects

    3. STANDARD LIBRARY:
       - json module: Uses C speedups when available (json.c)
       - re module: Compiles to C state machines
       - pickle: Can use _pickle.c for speed

    4. SYSTEM PROGRAMMING:
       - ctypes.windll (Windows) or ctypes.CDLL (Unix)
       - Call any C function from .dll or .so
       - Example: ctypes.cdll.msvcrt.strlen(b"hello")

    5. GAME DEVELOPMENT:
       - Pygame uses SDL (C library)
       - DirectX/OpenGL bindings via ctypes
       - Physics engines in C, scripting in Python

    This is what makes Python a "glue language":
    - High-level Python orchestrates low-level C components
    - Best of both worlds: productivity + performance
    """)


def philosophical_reflection():
    """
    Reflect on the Maslow's Stack metaphor.
    """
    print("\n" + "=" * 70)
    print("PHILOSOPHICAL REFLECTION: The Stack Beneath the Stack")
    print("=" * 70)

    print("""
    MASLOW'S STACK metaphor invites us to consider:

    1. DEPENDENCY AND GRATITUDE:
       Every time we write Python, we're standing on C's shoulders.
       We rarely think about the memory allocator, the reference
       counting logic, the GIL (Global Interpreter Lock). Yet without
       these, Python would not exist.

    2. ABSTRACTION AS EMERGENCE:
       High-level doesn't just mean "simpler low-level."
       Python programs exhibit emergent behaviors - list
       comprehensions, generators, decorators - that have no
       direct C analogue. The whole is more than the sum of parts.

    3. THE IDENTITY OF OBJECTS:
       When we do id(obj) and see an address, we confront the
       materiality of software. These are not abstract ideas -
       they are electrons in DRAM, charges in flash storage.

    4. WHY "SELF-ACTUALIZATION" MATTERS:
       Maslow's insight was that meeting basic needs frees us to
       create, explore, and achieve. Similarly, C's memory management
       frees Python developers to focus on problem-solving rather
       than malloc and free.

    5. THE GIL AND MULTITHREADING:
       CPython's Global Interpreter Lock is a C-level constraint
       that limits true parallelism. This reminds us that our
       "high-level" abstractions are still constrained by their
       implementation. Knowing the layers helps us work with,
       not against, these constraints.

    THE DEEPEST INSIGHT:
    ====================
    The next time you write:
        x = [1, 2, 3]

    Remember: you're not just creating a list. You're:
    - Allocating a C struct in heap memory
    - Setting a reference count to 1
    - Storing a type pointer to the list type object
    - Allocating space for three integer objects
    - Storing pointers to those integers

    And none of this could happen without C.
    """)


if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════════════════════════════════╗
    ║                       MASLOW'S STACK                                 ║
    ║           Exploring Python's C Foundation with ctypes                ║
    ╚══════════════════════════════════════════════════════════════════════╝
    """)

    explain_ctypes_and_memory_layers()
    demonstrate_object_identity()
    demonstrate_ctypes_memory_read()
    demonstrate_reference_counting()
    demonstrate_memory_structure()
    demonstrate_real_world_ctypes()
    philosophical_reflection()

    print("\n" + "=" * 70)
    print("The Stack goes all the way down. And that's beautiful.")
    print("=" * 70 + "\n")