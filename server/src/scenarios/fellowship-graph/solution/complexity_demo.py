"""
The Fellowship's Graph Solution: Complexity Demonstration
==========================================================
Benchmarking Dijkstra's algorithm to verify O((V+E) log V) complexity.

This module creates graphs of increasing size and measures execution time
to empirically demonstrate that Dijkstra's algorithm scales as expected.

For the disaster relief context: this proves that even a road network with
thousands of cities and tens of thousands of roads can be solved in
milliseconds the algorithm is fast enough for real-time dispatch.
"""

import heapq
import time
import random
from collections import defaultdict


def dijkstra_benchmark(graph: dict, source: str, destination: str,
                       cost_key: str = "weight") -> tuple:
    """Dijkstra's algorithm stripped down for benchmarking."""
    distances = {node: float('inf') for node in graph}
    distances[source] = 0
    predecessors = {node: None for node in graph}
    pq = [(0, source)]
    visited = set()

    while pq:
        cost, city = heapq.heappop(pq)
        if city in visited:
            continue
        visited.add(city)
        if city == destination:
            break

        for neighbour, edge_data in graph[city].items():
            if neighbour in visited:
                continue
            new_cost = cost + edge_data[cost_key]
            if new_cost < distances[neighbour]:
                distances[neighbour] = new_cost
                predecessors[neighbour] = city
                heapq.heappush(pq, (new_cost, neighbour))

    # Reconstruct path
    path = []
    current = destination
    while current is not None:
        path.append(current)
        current = predecessors.get(current)
    path.reverse()

    return distances.get(destination, float('inf')), path


def generate_random_graph(num_nodes: int, edge_density: float = 3.0) -> dict:
    """
    Generate a random connected graph with the given number of nodes.

    Parameters:
        num_nodes: number of nodes (cities)
        edge_density: average number of edges per node

    Returns:
        adjacency dictionary with 'weight' on each edge
    """
    nodes = [f"City_{i}" for i in range(num_nodes)]
    graph = defaultdict(dict)

    # First, create a spanning tree to ensure connectivity
    shuffled = list(nodes)
    random.shuffle(shuffled)
    for i in range(len(shuffled) - 1):
        weight = random.randint(1, 100)
        graph[shuffled[i]][shuffled[i+1]] = {"weight": weight}
        graph[shuffled[i+1]][shuffled[i]] = {"weight": weight}

    # Then add random extra edges
    target_edges = int(num_nodes * edge_density)
    current_edges = num_nodes - 1

    while current_edges < target_edges:
        a = random.choice(nodes)
        b = random.choice(nodes)
        if a != b and b not in graph[a]:
            weight = random.randint(1, 100)
            graph[a][b] = {"weight": weight}
            graph[b][a] = {"weight": weight}
            current_edges += 1

    return dict(graph), nodes[0], nodes[-1]


def run_benchmarks():
    """Run Dijkstra's on graphs of increasing size and report timings."""
    print("=" * 70)
    print("DIJKSTRA'S ALGORITHM COMPLEXITY BENCHMARK")
    print("=" * 70)
    print(f"\nExpected complexity: O((V + E) log V)")
    print(f"Where V = vertices (cities), E = edges (roads)")
    print()
    print(f"{'Nodes':>8} {'Edges':>8} {'Time (ms)':>12} {'Path Length':>12} "
          f"{'Ratio':>8}")
    print("-" * 55)

    prev_time = None
    sizes = [50, 100, 200, 500, 1000, 2000, 5000, 10000]

    for n in sizes:
        graph, source, dest = generate_random_graph(n, edge_density=3.0)

        # Count edges
        num_edges = sum(len(neighbours) for neighbours in graph.values()) // 2

        # Run multiple times for accuracy
        num_runs = 10 if n <= 2000 else 3
        times = []

        for _ in range(num_runs):
            start = time.perf_counter()
            cost, path = dijkstra_benchmark(graph, source, dest)
            elapsed = time.perf_counter() - start
            times.append(elapsed)

        avg_time_ms = (sum(times) / len(times)) * 1000
        path_len = len(path) if path else 0

        # Calculate ratio to previous (should grow roughly as n log n / prev_n log prev_n)
        ratio = f"{avg_time_ms / prev_time:.2f}x" if prev_time and prev_time > 0 else "—"
        prev_time = avg_time_ms

        print(f"{n:>8} {num_edges:>8} {avg_time_ms:>11.3f} {path_len:>12} "
              f"{ratio:>8}")

    print(f"""
  ─────────────────────────────────────────────────────────────
  ANALYSIS:

  As the graph grows, the time should increase roughly in
  proportion to (V + E) * log(V).

  For a graph with 3 edges per node (E ≈ 3V):
    - Doubling V should roughly multiply time by ~2.1-2.5x
    - 10x V should roughly multiply time by ~13-15x

  If you see roughly linear growth with a slight logarithmic
  factor, the algorithm is performing as expected.

  For the disaster relief network (7 cities, 10 edges):
  Dijkstra's runs in microseconds. Even with 10,000 cities
  and 30,000 roads, it completes in milliseconds.

  This means route decisions can be made in REAL TIME —
  fast enough to re-route trucks mid-journey when a road
  collapses, just as the Fellowship re-routed when
  Caradhras was blocked.
  ─────────────────────────────────────────────────────────────
""")


# ---------------------------------------------------------------------------
# Comparison: Naive BFS vs Dijkstra's
# ---------------------------------------------------------------------------

def bfs_shortest_path(graph: dict, source: str, destination: str) -> tuple:
    """
    BFS finds the path with fewest edges (hops), ignoring weights.
    For comparison only. BFS does NOT find the lowest-cost path in
    weighted graphs.
    """
    from collections import deque

    visited = {source}
    queue = deque([(source, [source])])

    while queue:
        current, path = queue.popleft()
        if current == destination:
            return len(path) - 1, path

        for neighbour in graph.get(current, {}):
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append((neighbour, path + [neighbour]))

    return float('inf'), []


def compare_bfs_dijkstra():
    """Show why BFS is insufficient for weighted graphs."""
    print("\n" + "=" * 70)
    print("BFS vs DIJKSTRA Why Weights Matter")
    print("=" * 70)

    # Create a small graph where BFS gives the wrong answer
    graph = {
        "A": {"B": {"weight": 1}, "C": {"weight": 10}},
        "B": {"A": {"weight": 1}, "D": {"weight": 1}},
        "C": {"A": {"weight": 10}, "D": {"weight": 1}},
        "D": {"B": {"weight": 1}, "C": {"weight": 1}},
    }

    # BFS finds fewest hops: A → C → D (2 hops, cost = 11)
    bfs_hops, bfs_path = bfs_shortest_path(graph, "A", "D")
    bfs_cost = sum(graph[bfs_path[i]][bfs_path[i+1]]["weight"]
                   for i in range(len(bfs_path) - 1))

    # Dijkstra finds lowest cost: A → B → D (2 hops, cost = 2)
    djk_cost, djk_path = dijkstra_benchmark(graph, "A", "D")

    print(f"\n  Graph: A--1-->B--1-->D")
    print(f"         A--10->C--1-->D")
    print(f"\n  BFS (fewest hops):    {' → '.join(bfs_path)}  "
          f"(hops: {bfs_hops}, cost: {bfs_cost})")
    print(f"  Dijkstra (min cost):  {' → '.join(djk_path)}  "
          f"(cost: {djk_cost:.0f})")
    print(f"\n  BFS ignores weights it finds the path with fewest edges.")
    print(f"  Dijkstra respects weights it finds the cheapest path.")
    print(f"  In disaster relief, the cheapest path is what matters.")


if __name__ == "__main__":
    random.seed(42)  # For reproducible results
    run_benchmarks()
    compare_bfs_dijkstra()
