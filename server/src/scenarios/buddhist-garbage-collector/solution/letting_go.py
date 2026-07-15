import gc
import weakref

class Node:
    def __init__(self, name):
        self.name = name
        self.neighbor = None
    def __repr__(self):
        return f'Node({self.name})'

def demo_attachment():
    a = Node('A')
    b = Node('B')
    # Circular attachment
    a.neighbor = b
    b.neighbor = a
    return a, b

def demo_detachment():
    a = Node('A')
    b = Node('B')
    # Weak reference (letting go)
    a.neighbor = b
    b.neighbor = weakref.ref(a)
    return a, b

if __name__ == '__main__':
    gc.disable()  # Disable GC to observe reference counts
    
    a, b = demo_detachment()
    print('Before deletion, B\'s neighbor is:', b.neighbor())
    
    del a
    print('After deleting A, B\'s neighbor becomes:', b.neighbor())
    gc.enable()
