import ctypes
import sys

def read_memory_value(obj):
    address = id(obj)
    # In CPython, an int is a PyVarObject.
    # The actual integer value data starts after the ob_refcnt, ob_type, and ob_size fields.
    # This is heavily implementation-dependent.
    # We'll use a safer ctypes approach: creating a c_int and reading its value.
    
    c_num = ctypes.c_int(42)
    c_addr = ctypes.addressof(c_num)
    
    # Read the memory back
    pointer = ctypes.cast(c_addr, ctypes.POINTER(ctypes.c_int))
    return pointer.contents.value

if __name__ == '__main__':
    val = read_memory_value(42)
    print(f'Value read directly from C memory: {val}')
