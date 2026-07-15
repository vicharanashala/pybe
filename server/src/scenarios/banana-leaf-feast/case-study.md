You are the chief server at a grand South Indian wedding. Your task is to manage the serving of food on traditional banana leaves. But this is no ordinary feast—this is a digital feast where space is strictly managed byte by byte.

The banana leaf represents a contiguous block of memory (the Heap). The leaf has a total size of 256 "bytes" of area.

Guests will request various dishes:
- **Rice**: 64 bytes
- **Sambar**: 32 bytes
- **Papadam**: 16 bytes
- **Chutney**: 8 bytes

When a dish is requested, you must allocate a contiguous block of space on the leaf. If there is no single contiguous block large enough, the serving fails (even if the *total* free space is enough, memory fragmentation might prevent allocation).

When a guest consumes a dish, they "free" that specific block of memory, allowing new dishes to be served in that space.

Your tasks:
1. **Initialize the Leaf:** Create a fixed-size memory buffer (e.g., using a `bytearray` of size 256) to represent the leaf.
2. **Serve (Allocate):** Implement a `serve(dish_name, size)` function that finds a contiguous free block of `size`, marks it as used, and returns the starting index (pointer).
3. **Consume (Free):** Implement a `consume(index)` function that marks the block starting at `index` as free again.
4. **Defragmentation (Optional but useful):** If adjacent blocks are freed, merge them to form larger free blocks.

Can you serve the feast without running out of contiguous space?
