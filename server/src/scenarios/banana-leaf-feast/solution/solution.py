"""
The Banana Leaf Feast - Reference Solution
===========================================
Domain: Culinary Traditions / Systems Programming

Target Constructs:
- bytearray for memory buffer
- First Fit allocation algorithm
- Memory block metadata tracking
- Heap management fundamentals
- malloc/free simulation

This solution demonstrates memory allocation using a bytearray as the heap,
tracking free blocks and implementing First Fit allocation - just as a
traditional South Indian server manages space on a banana leaf.
"""

from typing import Optional, Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum


class LeafError(Exception):
    """Base exception for banana leaf memory operations."""
    pass


class OutOfMemoryError(LeafError):
    """Raised when there's insufficient contiguous memory."""
    pass


class InvalidFreeError(LeafError):
    """Raised when trying to free an invalid address."""
    pass


class FragmentationError(LeafError):
    """Raised when memory is too fragmented for allocation."""
    pass


@dataclass
class MemoryBlock:
    """
    Represents a contiguous block of memory in the heap.

    Attributes:
        address: Starting index in the bytearray
        size: Number of bytes in this block
        in_use: Whether this block is currently allocated
    """
    address: int
    size: int
    in_use: bool = False


class BananaLeafAllocator:
    """
    A custom memory allocator using a bytearray as the heap.

    Models the spatial management of a traditional South Indian banana
    leaf feast. The leaf (bytearray) has fixed boundaries. Each dish
    (memory request) gets a designated spot. When consumed (freed),
    that space becomes available again.

    Uses First Fit allocation: finds the first free block that is
    large enough to satisfy the request.

    Attributes:
        LEAF_SIZE: Total size of the memory buffer (256 bytes)
    """

    LEAF_SIZE = 256

    def __init__(self):
        """
        Initialize the allocator with a single large free block.

        On startup, the entire leaf is available - like an empty
        banana leaf ready to be served.
        """
        self._leaf = bytearray(self.LEAF_SIZE)
        self._blocks: List[MemoryBlock] = [
            MemoryBlock(address=0, size=self.LEAF_SIZE, in_use=False)
        ]
        self._allocation_count = 0
        self._free_count = 0

    def _find_free_block(self, size: int) -> Optional[int]:
        """
        Find the first free block large enough for the request (First Fit).

        First Fit is simple and tends to leave larger blocks at the
        end of memory - similar to how eating from a banana leaf
        tends to leave the outer edges for later dishes.

        Args:
            size: Required block size

        Returns:
            Index of the suitable block, or None if none found
        """
        for i, block in enumerate(self._blocks):
            if not block.in_use and block.size >= size:
                return i
        return None

    def _merge_adjacent_free_blocks(self) -> None:
        """
        Merge adjacent free blocks to reduce fragmentation.

        When two free blocks are next to each other, they can be
        combined into a single larger block. This is like pushing
        aside empty plates on a banana leaf to make room for more
        dishes.
        """
        if len(self._blocks) <= 1:
            return

        merged = True
        while merged:
            merged = False
            new_blocks: List[MemoryBlock] = []
            i = 0

            while i < len(self._blocks):
                current = self._blocks[i]
                if not current.in_use and i + 1 < len(self._blocks):
                    next_block = self._blocks[i + 1]
                    if not next_block.in_use:
                        new_blocks.append(MemoryBlock(
                            address=current.address,
                            size=current.size + next_block.size,
                            in_use=False
                        ))
                        i += 2
                        merged = True
                        continue
                new_blocks.append(current)
                i += 1

            if merged:
                self._blocks = new_blocks

    def serve(self, size: int, dish_name: str = "Unknown") -> int:
        """
        Allocate a block of memory (First Fit).

        This is like the server placing a dish on the banana leaf.
        The dish (memory request) gets a contiguous spot that fits it.

        Args:
            size: Number of bytes to allocate
            dish_name: Human-readable name for debugging

        Returns:
            The address (index) of the allocated block

        Raises:
            OutOfMemoryError: If no suitable block found
        """
        if size <= 0:
            raise ValueError("Size must be positive")

        block_idx = self._find_free_block(size)

        if block_idx is None:
            self._merge_adjacent_free_blocks()
            block_idx = self._find_free_block(size)

        if block_idx is None:
            raise OutOfMemoryError(
                f"Cannot serve {size} bytes for '{dish_name}'. "
                f"Available memory is fragmented. Total free: {self.get_free_memory()}"
            )

        block = self._blocks[block_idx]

        if block.size == size:
            block.in_use = True
        else:
            remaining_block = MemoryBlock(
                address=block.address + size,
                size=block.size - size,
                in_use=False
            )
            block.size = size
            block.in_use = True
            self._blocks.insert(block_idx + 1, remaining_block)

        self._allocation_count += 1
        print(f"[Leaf] Served {size} bytes to '{dish_name}' at address {block.address}")

        return block.address

    def consume(self, address: int) -> None:
        """
        Free a block of memory.

        This is like a guest finishing a dish, freeing up space on
        the leaf for the next serving.

        Args:
            address: The address returned by serve()

        Raises:
            InvalidFreeError: If address is invalid
        """
        for block in self._blocks:
            if block.address == address:
                if not block.in_use:
                    raise InvalidFreeError(f"Block at address {address} is not in use")
                block.in_use = False
                self._free_count += 1
                print(f"[Leaf] Consumed '{address}' (freed {block.size} bytes)")
                self._merge_adjacent_free_blocks()
                return

        raise InvalidFreeError(f"Invalid address: {address}")

    def get_free_memory(self) -> int:
        """Return total free memory across all free blocks."""
        return sum(b.size for b in self._blocks if not b.in_use)

    def get_largest_free_block(self) -> int:
        """Return the size of the largest free block."""
        return max((b.size for b in self._blocks if not b.in_use), default=0)

    def get_block_count(self) -> Dict[str, int]:
        """Return counts of allocated and free blocks."""
        allocated = sum(1 for b in self._blocks if b.in_use)
        return {"allocated": allocated, "free": len(self._blocks) - allocated}

    def write_data(self, address: int, data: bytes) -> None:
        """
        Write data to an allocated block.

        Args:
            address: Block address
            data: Data to write
        """
        for block in self._blocks:
            if block.address == address and block.in_use:
                if len(data) > block.size:
                    raise ValueError(f"Data too large for block ({block.size} bytes)")
                self._leaf[address:address + len(data)] = data
                return
        raise InvalidFreeError(f"No allocated block at address {address}")

    def read_data(self, address: int, size: int) -> bytes:
        """
        Read data from an allocated block.

        Args:
            address: Block address
            size: Number of bytes to read

        Returns:
            The data read
        """
        for block in self._blocks:
            if block.address == address and block.in_use:
                return bytes(self._leaf[address:address + size])
        raise InvalidFreeError(f"No allocated block at address {address}")

    def visualize(self) -> str:
        """
        Create a visual representation of the leaf memory.

        Returns:
            String showing memory layout
        """
        lines = ["\n[BANANA LEAF MEMORY MAP]"]
        lines.append("-" * 50)

        status = []
        for block in sorted(self._blocks, key=lambda b: b.address):
            bar = "=" * min(block.size // 8, 30)
            state = "ALLOCATED" if block.in_use else "FREE"
            lines.append(f"  [{block.address:3d}-{block.address + block.size - 1:3d}] "
                         f"{bar} {state} ({block.size}B)")

        lines.append("-" * 50)
        lines.append(f"Total: {self.LEAF_SIZE}B | "
                     f"Used: {self.LEAF_SIZE - self.get_free_memory()}B | "
                     f"Free: {self.get_free_memory()}B")
        return "\n".join(lines)


def simulate_wedding_feast() -> None:
    """
    Simulate the wedding feast scenario from the trigger.

    A banana leaf (256 bytes) serves different dishes:
    - Rice: 64 bytes
    - Sambar: 32 bytes
    - Papadam: 16 bytes
    - Chutney: 8 bytes
    """
    print("\n" + "=" * 60)
    print("WEDDING FEAST: Banana Leaf Memory Allocation")
    print("=" * 60)

    leaf = BananaLeafAllocator()

    print("\n* Guests arrive, leaf is empty *")
    print(leaf.visualize())

    print("\n* Serving dishes... *")
    rice_addr = leaf.serve(64, "Rice")
    sambar_addr = leaf.serve(32, "Sambar")
    papadam_addr = leaf.serve(16, "Papadam")
    chutney_addr = leaf.serve(8, "Chutney")

    print(leaf.visualize())

    print("\n* Guest finishes Sambar (frees 32 bytes) *")
    leaf.consume(sambar_addr)
    print(leaf.visualize())

    print("\n* Serving more dishes... *")
    leaf.serve(24, "Rasam")
    leaf.serve(12, "Pickle")

    print(leaf.visualize())

    print("\n* Guest finishes Rice (frees 64 bytes) - allows large dish *")
    leaf.consume(rice_addr)
    leaf.serve(48, "Curds")

    print(leaf.visualize())


def demonstrate_fragmentation() -> None:
    """Demonstrate memory fragmentation and how it affects allocation."""
    print("\n" + "=" * 60)
    print("FRAGMENTATION: The Memory Challenge")
    print("=" * 60)

    leaf = BananaLeafAllocator()

    print("\n* Allocating and freeing to create fragmentation *")

    a = leaf.serve(64, "A")
    b = leaf.serve(32, "B")
    c = leaf.serve(16, "C")
    d = leaf.serve(8, "D")

    print(leaf.visualize())

    print("\n* Freeing alternating blocks (A, C) *")
    leaf.consume(a)
    leaf.consume(c)

    print(leaf.visualize())

    print("\n* Total free memory is 80 bytes (64+16), but largest block is 64 *")
    print(f"  Largest free block: {leaf.get_largest_free_block()}B")
    print(f"  Total free: {leaf.get_free_memory()}B")

    print("\n* Trying to allocate 48-byte dish (requires 48 contiguous bytes) *")
    try:
        leaf.serve(48, "LargeDish")
    except OutOfMemoryError as e:
        print(f"  {e}")

    print("\n* Merging adjacent free blocks... *")
    leaf._merge_adjacent_free_blocks()
    print(leaf.visualize())

    print("\n* Now we have a 64-byte block, can serve the 48-byte dish *")
    leaf.serve(48, "LargeDish")
    print(leaf.visualize())


def demonstrate_data_persistence() -> None:
    """Demonstrate that allocated memory preserves data."""
    print("\n" + "=" * 60)
    print("DATA PERSISTENCE: Writing and Reading Memory")
    print("=" * 60)

    leaf = BananaLeafAllocator()

    addr = leaf.serve(32, "SecretRecipe")

    data = b"SAMBAR_RECIPE_12345"
    leaf.write_data(addr, data)

    print(f"\n* Wrote data to address {addr}: {data} *")

    read_data = leaf.read_data(addr, len(data))
    print(f"* Read data from address {addr}: {read_data} *")
    print(f"* Data integrity: {'OK' if data == read_data else 'FAILED'} *")


if __name__ == "__main__":
    print("=" * 60)
    print("BANANA LEAF FEAST: Custom Memory Allocator")
    print("=" * 60)

    simulate_wedding_feast()

    demonstrate_fragmentation()

    demonstrate_data_persistence()

    print("\n" + "=" * 60)
    print("KEY INSIGHT: Memory allocators manage a fixed heap, tracking")
    print("which blocks are in use and which are free. First Fit finds")
    print("the first block large enough. When memory is freed, adjacent")
    print("free blocks should be merged to prevent fragmentation - just")
    print("as clearing empty plates on a banana leaf makes room for more.")
    print("=" * 60)