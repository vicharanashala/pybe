class BananaLeafAllocator:
    def __init__(self, total_size=256):
        self.total_size = total_size
        self.memory = bytearray(total_size)
        # Metadata: list of blocks represented as dicts
        # block: {'start': int, 'size': int, 'is_free': bool}
        self.blocks = [{'start': 0, 'size': total_size, 'is_free': True}]

    def serve(self, dish_name, size):
        """Allocates 'size' bytes and returns the starting index."""
        for i, block in enumerate(self.blocks):
            if block['is_free'] and block['size'] >= size:
                # We found a suitable block
                if block['size'] > size:
                    # Split the block
                    new_free_block = {
                        'start': block['start'] + size,
                        'size': block['size'] - size,
                        'is_free': True
                    }
                    block['size'] = size
                    block['is_free'] = False
                    self.blocks.insert(i + 1, new_free_block)
                else:
                    # Perfect fit
                    block['is_free'] = False
                
                print(f"Served {dish_name} ({size} bytes) at index {block['start']}.")
                return block['start']
        
        print(f"Failed to serve {dish_name} ({size} bytes). Out of contiguous memory!")
        return None

    def consume(self, index):
        """Frees the block starting at 'index'."""
        for i, block in enumerate(self.blocks):
            if block['start'] == index:
                if block['is_free']:
                    print(f"Block at {index} is already free!")
                    return
                
                block['is_free'] = True
                print(f"Consumed dish at index {index}. Freed {block['size']} bytes.")
                self._merge_free_blocks()
                return
        
        print(f"Invalid index {index}. No block starts here.")

    def _merge_free_blocks(self):
        """Merges adjacent free blocks to prevent fragmentation."""
        merged_blocks = []
        for block in self.blocks:
            if not merged_blocks:
                merged_blocks.append(block)
                continue
            
            last_block = merged_blocks[-1]
            if last_block['is_free'] and block['is_free']:
                # Merge them
                last_block['size'] += block['size']
            else:
                merged_blocks.append(block)
        
        self.blocks = merged_blocks

    def print_status(self):
        print("Leaf Status:")
        for block in self.blocks:
            status = "Free" if block['is_free'] else "Used"
            print(f"  [{block['start']} to {block['start'] + block['size'] - 1}] - {block['size']} bytes ({status})")
        print("-" * 30)

# Example Usage
if __name__ == "__main__":
    leaf = BananaLeafAllocator(256)
    
    ptr_rice = leaf.serve("Rice", 64)
    ptr_sambar = leaf.serve("Sambar", 32)
    ptr_papadam = leaf.serve("Papadam", 16)
    
    leaf.print_status()
    
    # Consume Sambar
    leaf.consume(ptr_sambar)
    leaf.print_status()
    
    # Now try to serve a big dish
    ptr_payasam = leaf.serve("Payasam", 40) # Fails if we don't have 40 contiguous bytes
    
    # Consume Papadam
    leaf.consume(ptr_papadam)
    leaf.print_status()
    
    ptr_payasam = leaf.serve("Payasam", 40) # Should succeed now if 32 and 16 were merged
    leaf.print_status()
