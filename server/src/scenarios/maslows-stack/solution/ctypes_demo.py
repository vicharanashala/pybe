"""
ctypes_demo.py Calling libc Directly with ctypes
====================================================
ctypes lets Python reach below its own abstraction layer to call C functions
directly. This is Maslow's hierarchy in action: Python (high-level) calling
libc (low-level) which calls the kernel (hardware).

Demonstrates: loading shared libraries, calling C functions, working with
C data types, and reading raw memory.
"""

import ctypes
import ctypes.util
import sys
import os
import platform


def load_libc():
    """
    Loads the C standard library for the current platform.
    - Linux: libc.so.6
    - macOS: libSystem.B.dylib
    - Windows: msvcrt.dll (Microsoft Visual C Runtime)
    """
    if sys.platform == 'win32':
        # On Windows, msvcrt is always available
        return ctypes.cdll.msvcrt
    else:
        # On Unix, find libc dynamically
        libc_name = ctypes.util.find_library('c')
        if libc_name:
            return ctypes.CDLL(libc_name)
        raise RuntimeError("Could not find libc!")


def demo_basic_ctypes():
    """Demonstrates basic ctypes usage: calling C math and string functions."""
    print("=" * 55)
    print("  ctypes Basics: Calling C from Python")
    print("=" * 55)
    print()
    
    libc = load_libc()
    
    # --- Call C's abs() function ---
    # int abs(int n)
    libc.abs.argtypes = [ctypes.c_int]
    libc.abs.restype = ctypes.c_int
    
    result = libc.abs(-42)
    print(f"  libc.abs(-42) = {result}")
    
    # --- Call C's strlen() function ---
    # On Windows, use _mbslen or len through another method
    if sys.platform != 'win32':
        # size_t strlen(const char *s)
        libc.strlen.argtypes = [ctypes.c_char_p]
        libc.strlen.restype = ctypes.c_size_t
        
        result = libc.strlen(b"Hello, ctypes!")
        print(f"  libc.strlen(b'Hello, ctypes!') = {result}")
    
    # --- Call C's time() function ---
    # time_t time(time_t *tloc)
    libc.time.argtypes = [ctypes.c_void_p]
    libc.time.restype = ctypes.c_long
    
    unix_time = libc.time(None)
    print(f"  libc.time(NULL) = {unix_time} (Unix timestamp)")
    
    # --- Pointer to the errno global ---
    print(f"\n  Platform: {platform.system()} {platform.machine()}")
    print(f"  Python:   {sys.version.split()[0]}")
    print()


def demo_c_data_types():
    """Shows how Python values map to C data types."""
    print("=" * 55)
    print("  C Data Types in Python")
    print("=" * 55)
    print()
    
    # Create C-typed values
    c_types_demo = [
        ("c_int", ctypes.c_int(42)),
        ("c_float", ctypes.c_float(3.14)),
        ("c_double", ctypes.c_double(2.718281828)),
        ("c_char", ctypes.c_char(b'A')),
        ("c_bool", ctypes.c_bool(True)),
        ("c_long", ctypes.c_long(1_000_000)),
        ("c_size_t", ctypes.c_size_t(2**20)),
    ]
    
    print(f"  {'Type':<15} {'Value':<20} {'Size (bytes)':<15}")
    print("  " + "-" * 50)
    
    for name, obj in c_types_demo:
        print(f"  {name:<15} {str(obj.value):<20} {ctypes.sizeof(obj):<15}")
    
    print()
    
    # --- C arrays ---
    print("  C Array (int[5]):")
    IntArray5 = ctypes.c_int * 5  # Define a type: array of 5 ints
    arr = IntArray5(10, 20, 30, 40, 50)
    print(f"    Values: {[arr[i] for i in range(5)]}")
    print(f"    Size: {ctypes.sizeof(arr)} bytes ({ctypes.sizeof(ctypes.c_int)} bytes × 5)")
    print()


def demo_raw_memory():
    """
    Reads raw memory of Python objects using ctypes.
    Every Python object is a C struct with ob_refcnt as the first field.
    """
    print("=" * 55)
    print("  Reading Raw Python Object Memory")
    print("=" * 55)
    print()
    
    # Create a Python object
    my_list = [1, 2, 3, 4, 5]
    address = id(my_list)
    
    print(f"  Object: {my_list}")
    print(f"  id() = {address} ({hex(address)})")
    print()
    
    # Read the reference count from raw memory
    # PyObject starts with ob_refcnt (Py_ssize_t = c_ssize_t)
    refcount = ctypes.c_ssize_t.from_address(address).value
    print(f"  Raw ob_refcnt from memory: {refcount}")
    print(f"  sys.getrefcount():         {sys.getrefcount(my_list)}")
    print(f"  (Difference of 1 is from getrefcount's temporary ref)")
    print()
    
    # Read the type pointer (second field in PyObject)
    ptr_size = ctypes.sizeof(ctypes.c_void_p)
    type_ptr = ctypes.c_void_p.from_address(address + ptr_size).value
    print(f"  Type pointer from memory: {hex(type_ptr)}")
    print(f"  id(type(my_list)):        {hex(id(type(my_list)))}")
    print(f"  Match: {type_ptr == id(type(my_list))}")
    print()


def demo_struct_with_ctypes():
    """
    Defines a C-like struct in Python using ctypes.Structure.
    This is how you'd interface with hardware registers or
    binary file formats.
    """
    print("=" * 55)
    print("  C Structs in Python (ctypes.Structure)")
    print("=" * 55)
    print()
    
    class SensorReading(ctypes.Structure):
        """
        Mimics a C struct:
        struct SensorReading {
            uint32_t timestamp;
            float    temperature;
            float    humidity;
            uint8_t  sensor_id;
        };
        """
        _fields_ = [
            ("timestamp", ctypes.c_uint32),
            ("temperature", ctypes.c_float),
            ("humidity", ctypes.c_float),
            ("sensor_id", ctypes.c_uint8),
        ]
    
    # Create an instance
    reading = SensorReading()
    reading.timestamp = 1700000000
    reading.temperature = 23.5
    reading.humidity = 65.2
    reading.sensor_id = 7
    
    print(f"  SensorReading struct:")
    print(f"    timestamp:   {reading.timestamp}")
    print(f"    temperature: {reading.temperature:.1f}°C")
    print(f"    humidity:    {reading.humidity:.1f}%")
    print(f"    sensor_id:   {reading.sensor_id}")
    print(f"    Total size:  {ctypes.sizeof(reading)} bytes")
    print(f"    (C would use {4+4+4+1}=13 bytes, but padding makes it {ctypes.sizeof(reading)})")
    print()
    
    # Serialize to bytes (like writing to hardware or file)
    raw_bytes = bytes(reading)
    print(f"  Serialized to {len(raw_bytes)} bytes: {raw_bytes.hex(' ')}")
    
    # Deserialize back
    restored = SensorReading.from_buffer_copy(raw_bytes)
    print(f"  Restored temperature: {restored.temperature:.1f}°C")
    print()


if __name__ == '__main__':
    demo_basic_ctypes()
    demo_c_data_types()
    demo_raw_memory()
    demo_struct_with_ctypes()
