import ctypes

class MemoryPool:
    """
    A custom memory pool using ctypes.
    Allocates a block of raw memory and manages sub-allocations.
    """
    def __init__(self, size_bytes):
        self.size = size_bytes
        # Allocate raw memory buffer using ctypes
        self._buffer = (ctypes.c_char * self.size)()
        self.offset = 0
        
    def allocate(self, bytes_needed):
        """Allocates a chunk of memory from the pool."""
        if self.offset + bytes_needed > self.size:
            raise MemoryError("Out of memory in pool")
        
        # Get address of the allocated chunk
        address = ctypes.addressof(self._buffer) + self.offset
        self.offset += bytes_needed
        return address
        
    def reset(self):
        """Resets the memory pool for reuse."""
        self.offset = 0

if __name__ == "__main__":
    pool = MemoryPool(1024) # 1 KB pool
    ptr1 = pool.allocate(128)
    print(f"Allocated 128 bytes at address: {ptr1}")
    ptr2 = pool.allocate(256)
    print(f"Allocated 256 bytes at address: {ptr2}")
