import random

def prune_weights(weights, threshold):
    """
    Prunes weights below a certain threshold by setting them to 0.
    Simulates model pruning to reduce size and increase inference speed.
    """
    pruned = []
    pruned_count = 0
    for w in weights:
        if abs(w) < threshold:
            pruned.append(0.0)
            pruned_count += 1
        else:
            pruned.append(w)
    return pruned, pruned_count

if __name__ == "__main__":
    # Simulate some neural network weights
    original_weights = [random.uniform(-1.0, 1.0) for _ in range(20)]
    
    threshold = 0.3
    pruned_weights, count = prune_weights(original_weights, threshold)
    
    print("Original Weights (first 5):", [f"{w:.2f}" for w in original_weights[:5]])
    print("Pruned Weights   (first 5):", [f"{w:.2f}" for w in pruned_weights[:5]])
    print(f"Total weights pruned: {count} out of {len(original_weights)}")
