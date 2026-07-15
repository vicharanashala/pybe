"""
The Badminton Survivor - Reference Solution
============================================
Domain: Sports Analytics / Machine Learning

Target Constructs:
- scipy.sparse.csr_matrix
- numpy arrays and dense matrices
- Neural network pruning
- Memory optimization through sparsity

This solution demonstrates the contrast between dense and sparse matrix
representations, and how sparse matrices enable efficient neural network
pruning - just as a badminton analyst only records where the shuttlecock
lands, not the entire court.
"""

import numpy as np
from scipy import sparse
from typing import Tuple, List


class BadmintonCourt:
    """
    Represents a badminton court as a matrix for tracking shuttlecock landings.

    A standard badminton court is 1000x1000 millimeters. Over a long match,
    the shuttlecock might land 50 times. Storing all million positions would
    waste 999,950 entries of zeros. Instead, we use sparse representation.
    """

    COURT_SIZE = 1000

    def __init__(self):
        """Initialize an empty dense court matrix."""
        self._dense = np.zeros((self.COURT_SIZE, self.COURT_SIZE), dtype=np.int8)
        self._landing_count = 0

    def record_landing(self, x: int, y: int) -> None:
        """
        Record a shuttlecock landing at coordinates (x, y).

        Args:
            x: X coordinate (0-999)
            y: Y coordinate (0-999)

        Raises:
            ValueError: If coordinates are out of bounds
        """
        if not (0 <= x < self.COURT_SIZE and 0 <= y < self.COURT_SIZE):
            raise ValueError(f"Coordinates must be within 0-{self.COURT_SIZE}")
        self._dense[x, y] += 1
        self._landing_count += 1

    def to_dense(self) -> np.ndarray:
        """Return the dense matrix representation."""
        return self._dense.copy()

    def to_sparse(self) -> sparse.csr_matrix:
        """
        Convert to sparse CSR matrix.

        CSR (Compressed Sparse Row) format stores only non-zero values
        along with their row and column indices. This is memory-efficient
        when the matrix is mostly zeros.

        Returns:
            Sparse matrix representation of the court
        """
        return sparse.csr_matrix(self._dense)

    def get_memory_usage(self, sparse_format: bool = False) -> int:
        """
        Calculate memory usage of the representation.

        Args:
            sparse_format: If True, calculate for sparse format

        Returns:
            Memory usage in bytes
        """
        if sparse_format:
            nnz = self._landing_count if self._landing_count > 0 else 1
            data_size = nnz * 8
            indices_size = nnz * 4
            indptr_size = (self.COURT_SIZE + 1) * 4
            return data_size + indices_size + indptr_size
        return self._dense.nbytes


class NeuralNetworkPruner:
    """
    Simulates pruning a neural network layer and converting to sparse format.

    Neural networks have millions of weights. After training, many weights
    are close to zero and contribute little to the output. Pruning sets
    these near-zero weights to exactly zero, allowing sparse computation.

    This is like how a badminton coach might identify which movements
    a player rarely uses and deprioritize practicing them.
    """

    def __init__(self, layer_shape: Tuple[int, int], name: str = "Layer"):
        """
        Initialize a neural network layer with random weights.

        Args:
            layer_shape: Shape of the weight matrix (rows, cols)
            name: Name for this layer
        """
        self.name = name
        self.shape = layer_shape
        self.weights = np.random.randn(*layer_shape)
        self.pruned_count = 0

    def prune_by_threshold(self, threshold: float) -> None:
        """
        Prune weights below the absolute threshold.

        Weights with absolute value less than threshold are set to zero.
        This is called "magnitude-based pruning."

        Args:
            threshold: Minimum absolute value to keep
        """
        mask = np.abs(self.weights) >= threshold
        self.pruned_count = np.sum(~mask)
        self.weights[~mask] = 0
        print(f"[Pruner:{self.name}] Pruned {self.pruned_count}/{self.weights.size} weights "
              f"(threshold={threshold})")

    def to_sparse(self) -> sparse.csr_matrix:
        """
        Convert the (now sparse) weight matrix to CSR format.

        Returns:
            Sparse matrix of pruned weights
        """
        return sparse.csr_matrix(self.weights)

    def calculate_sparsity(self) -> float:
        """
        Calculate the fraction of weights that are zero.

        Returns:
            Sparsity ratio (0.0 to 1.0)
        """
        if self.weights.size == 0:
            return 0.0
        return np.sum(self.weights == 0) / self.weights.size

    def estimate_speedup(self, sparse_matrix: sparse.csr_matrix) -> float:
        """
        Estimate theoretical inference speedup from sparsity.

        When multiplying by a sparse matrix, we can skip multiplications
        by zero. The speedup is approximately 1/(1-sparsity) for the
        multiplication step, but real speedup depends on hardware.

        Args:
            sparse_matrix: The sparse representation

        Returns:
            Estimated speedup factor
        """
        sparsity = self.calculate_sparsity()
        if sparsity >= 1.0:
            return 0.0
        return 1.0 / (1.0 - sparsity)


def demonstrate_court_sparsity() -> None:
    """Demonstrate the memory advantage of sparse representation for court data."""
    print("\n" + "=" * 60)
    print("BADMINTON COURT: Dense vs Sparse Representation")
    print("=" * 60)

    court = BadmintonCourt()

    print(f"\nCourt size: {court.COURT_SIZE}x{court.COURT_SIZE} = {court.COURT_SIZE**2:,} positions")

    import random
    random.seed(42)
    landings = [(random.randint(0, 999), random.randint(0, 999)) for _ in range(50)]

    print(f"\nSimulating {len(landings)} shuttlecock landings...")
    for x, y in landings:
        court.record_landing(x, y)

    dense_memory = court.get_memory_usage(sparse_format=False)
    sparse_memory = court.get_memory_usage(sparse_format=True)

    print(f"\nMemory comparison:")
    print(f"  Dense matrix:  {dense_memory:,} bytes ({dense_memory/1024:.2f} KB)")
    print(f"  Sparse matrix: {sparse_memory:,} bytes ({sparse_memory/1024:.4f} KB)")
    print(f"  Memory saved:  {dense_memory - sparse_memory:,} bytes "
          f"({100*(dense_memory-sparse_memory)/dense_memory:.2f}%)")

    dense_matrix = court.to_dense()
    sparse_matrix = court.to_sparse()

    print(f"\nDense non-zero count: {np.count_nonzero(dense_matrix)}")
    print(f"Sparse stored values: {sparse_matrix.nnz}")

    print(f"\nSparse matrix structure:")
    print(f"  Data array length:  {len(sparse_matrix.data)}")
    print(f"  Indices array:      {len(sparse_matrix.indices)}")
    print(f"  Indptr array:       {len(sparse_matrix.indptr)}")


def demonstrate_neural_pruning() -> None:
    """Demonstrate neural network pruning and sparse computation benefits."""
    print("\n" + "=" * 60)
    print("NEURAL NETWORK PRUNING: From Dense to Sparse")
    print("=" * 60)

    layer = NeuralNetworkPruner((1024, 1024), name="Dense_1K")

    print(f"\nOriginal layer shape: {layer.shape}")
    print(f"Total weights: {layer.weights.size:,}")

    original_sparsity = layer.calculate_sparsity()
    print(f"Initial sparsity: {original_sparsity:.2%}")

    layer.prune_by_threshold(threshold=0.3)

    final_sparsity = layer.calculate_sparsity()
    print(f"Final sparsity: {final_sparsity:.2%}")

    sparse_weights = layer.to_sparse()
    speedup = layer.estimate_speedup(sparse_weights)
    print(f"\nEstimated inference speedup: {speedup:.2f}x")

    dense_memory = layer.weights.nbytes
    sparse_data = sparse_weights.data.nbytes
    sparse_indices = sparse_weights.indices.nbytes
    sparse_indptr = sparse_weights.indptr.nbytes
    sparse_memory = sparse_data + sparse_indices + sparse_indptr

    print(f"\nMemory comparison:")
    print(f"  Dense storage:  {dense_memory:,} bytes ({dense_memory/1024/1024:.2f} MB)")
    print(f"  Sparse storage: {sparse_memory:,} bytes ({sparse_memory/1024:.2f} KB)")
    print(f"  Compression:    {dense_memory/sparse_memory:.1f}x")


def demonstrate_sparse_matrix_operations() -> None:
    """Show that sparse matrices support standard operations."""
    print("\n" + "=" * 60)
    print("SPARSE MATRIX OPERATIONS")
    print("=" * 60)

    data = np.array([1, 2, 3, 4, 5])
    row_indices = np.array([0, 0, 1, 2, 2])
    col_indices = np.array([0, 2, 1, 0, 2])

    sparse_mat = sparse.csr_matrix((data, (row_indices, col_indices)),
                                    shape=(3, 3))

    print("\n3x3 Sparse matrix (5 non-zeros):")
    print(f"  Dense form:\n{sparse_mat.toarray()}")
    print(f"  Sparsity: {sparse_mat.nnz}/9 = {sparse_mat.nnz/9:.1%}")

    vec = np.array([1, 2, 3])
    result = sparse_mat @ vec

    print(f"\nMatrix-vector multiplication (sparse):")
    print(f"  Result: {result}")
    print(f"  (Manual check: [1*1+0*2+2*3, 0*1+3*2+0*3, 4*1+0*2+5*3] = [7, 6, 19])")


if __name__ == "__main__":
    print("=" * 60)
    print("THE BADMINTON SURVIVOR: Matrix Sparsity & Neural Pruning")
    print("=" * 60)

    demonstrate_court_sparsity()

    demonstrate_neural_pruning()

    demonstrate_sparse_matrix_operations()

    print("\n" + "=" * 60)
    print("KEY INSIGHT: Just as a badminton analyst only records landing")
    print("spots (sparse) instead of the entire court (dense), neural")
    print("network pruning removes weak connections and stores only the")
    print("significant weights in sparse format. This enables efficient")
    print("inference on resource-constrained devices like smartwatches.")
    print("=" * 60)