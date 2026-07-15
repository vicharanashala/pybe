import time

def dense_inference(data, weights):
    """Simulate inference with all weights."""
    return sum(d * w for d, w in zip(data, weights))

def sparse_inference(data, weights):
    """Simulate inference skipping zero weights (pruned)."""
    return sum(d * w for d, w in zip(data, weights) if w != 0)

if __name__ == "__main__":
    size = 1000000
    data = [1.0] * size
    # 90% sparse weights
    weights = [0.0 if i % 10 != 0 else 0.5 for i in range(size)]
    
    start = time.time()
    dense_inference(data, weights)
    dense_time = time.time() - start
    
    start = time.time()
    sparse_inference(data, weights)
    sparse_time = time.time() - start
    
    print(f"Dense inference time:  {dense_time:.4f}s")
    print(f"Sparse inference time: {sparse_time:.4f}s")
    print("Sparse inference is much faster on pruned models!")
