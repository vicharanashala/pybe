"""
Demonstrates how a Python dict works internally using a mock hash map.
"""

class MockHashMap:
    def __init__(self, capacity=8):
        self.capacity = capacity
        self.size = 0
        self.buckets = [None] * self.capacity
        
    def _hash(self, key):
        return hash(key) % self.capacity
        
    def put(self, key, value):
        index = self._hash(key)
        
        # Handle collision with chaining (simple list approach)
        if self.buckets[index] is None:
            self.buckets[index] = []
            
        for i, kv in enumerate(self.buckets[index]):
            if kv[0] == key:
                self.buckets[index][i] = (key, value)
                return
                
        self.buckets[index].append((key, value))
        self.size += 1
        
    def get(self, key):
        index = self._hash(key)
        if self.buckets[index] is not None:
            for k, v in self.buckets[index]:
                if k == key:
                    return v
        raise KeyError(key)

if __name__ == "__main__":
    h = MockHashMap()
    h.put("poet_1", "Pampa")
    h.put("poet_2", "Ranna")
    print("poet_1:", h.get("poet_1"))
    print("poet_2:", h.get("poet_2"))
