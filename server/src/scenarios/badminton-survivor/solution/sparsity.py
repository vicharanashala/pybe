import numpy as np
from scipy.sparse import csr_matrix

def print_memory_comparison(name, dense_mat, sparse_mat):
    dense_bytes = dense_mat.nbytes
    sparse_bytes = sparse_mat.data.nbytes + sparse_mat.indptr.nbytes + sparse_mat.indices.nbytes
    print(f"--- {name} ---")
    print(f"Dense memory:  {dense_bytes / 1024 / 1024:.2f} MB")
    print(f"Sparse memory: {sparse_bytes / 1024 / 1024:.6f} MB")
    print(f"Reduction:     {(1 - (sparse_bytes/dense_bytes)) * 100:.4f}%")
    print()

def simulate_badminton_court():
    print("Simulating Badminton Court...")
    # 10,000 x 10,000 grid (100 million points)
    court_dense = np.zeros((10000, 10000), dtype=np.int8)
    
    # 100 shuttlecock landings
    for _ in range(100):
        x, y = np.random.randint(0, 10000, size=2)
        court_dense[x, y] = 1
        
    # Convert to sparse
    court_sparse = csr_matrix(court_dense)
    print_memory_comparison("Badminton Court", court_dense, court_sparse)

def simulate_neural_pruning():
    print("Simulating Neural Network Pruning...")
    # 5,000 x 5,000 weight matrix (25 million weights)
    # Generate random floats between 0 and 1
    weights_dense = np.random.rand(5000, 5000).astype(np.float32)
    
    # Before pruning, it's very dense. Let's see the size if we made it sparse now (it would be worse!)
    # We will skip that to save time.
    
    # PRUNING: Set any weight below 0.90 to 0.0
    print("Pruning weights < 0.90...")
    weights_dense[weights_dense < 0.90] = 0.0
    
    # Convert to sparse
    weights_sparse = csr_matrix(weights_dense)
    
    # Calculate sparsity
    total_elements = weights_dense.size
    zero_elements = total_elements - weights_sparse.nnz
    sparsity = (zero_elements / total_elements) * 100
    
    print(f"Sparsity achieved: {sparsity:.2f}% zeros")
    print_memory_comparison("Pruned Neural Network", weights_dense, weights_sparse)

if __name__ == "__main__":
    simulate_badminton_court()
    simulate_neural_pruning()
