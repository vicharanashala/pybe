You are analyzing data from the final match of the World Badminton Championship. The court is divided into a fine grid of 10,000 by 10,000 sectors.

During the match, the shuttlecock touched the ground exactly 100 times.
If you store this as a standard 2D array (a dense matrix), you are storing 100,000,000 values. Almost all of them are zero. This wastes RAM.

Furthermore, you have a Neural Network model with a weight matrix of size 5,000 by 5,000 (25 million weights) used to predict player movement. Many of these weights are very close to zero (e.g., `< 0.01`) and don't affect the prediction much.

Your tasks:
1. **The Court (Sparsity):** Create a 10,000 x 10,000 dense numpy matrix of zeros. Randomly set 100 spots to 1. Check its size in bytes. Then, convert it to a `scipy.sparse.csr_matrix`. Compare the memory footprint.
2. **The Brain (Pruning):** Create a 5,000 x 5,000 dense numpy matrix with random float values between 0.0 and 1.0. 
3. "Prune" the network by setting all weights less than 0.90 to exactly `0.0`. 
4. Convert the pruned dense matrix into a sparse `csr_matrix`. Compare the sizes and calculate the sparsity percentage (what percentage of weights are exactly zero).

Can you save the memory before your machine crashes?
