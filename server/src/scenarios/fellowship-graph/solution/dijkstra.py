"""
The Fellowship's Graph Solution: Dijkstra's Algorithm
=======================================================
Full implementation of Dijkstra's shortest path algorithm using heapq.

Dijkstra's algorithm is a greedy algorithm that finds the shortest path
from a source node to all other nodes in a weighted graph with non-negative
edge weights.

The key insight: always expand the cheapest unexplored node. This greedy
choice guarantees that when you first reach a node, you've found the
shortest path to it.

Like Gandalf at the crossroads: evaluate all options, choose the cheapest,
and commit. But unlike Gandalf, the algorithm cannot regret its cost function.
"""

import heapq
import json
import os
from collections import defaultdict


def build_graph(filepath: str) -> dict:
    """Load network data and build adjacency dictionary."""
    with open(filepath, 'r') as f:
        data = json.load(f)

    graph = defaultdict(dict)
    for edge in data["edges"]:
        weight = {"time": edge["time"], "risk": edge["risk"]}
        graph[edge["from"]][edge["to"]] = weight
        graph[edge["to"]][edge["from"]] = weight

    return dict(graph)


def dijkstra(graph: dict, source: str, destination: str,
             cost_key: str = "time") -> tuple:
    """
    Dijkstra's shortest path algorithm using a min-heap (priority queue).

    Parameters:
        graph: adjacency dictionary
        source: starting city
        destination: target city
        cost_key: which edge weight to optimise ('time' or 'risk')

    Returns:
        (total_cost, path) where path is a list of cities from source to dest.
        Returns (float('inf'), []) if no path exists.

    Complexity: O((V + E) log V)
        - Each vertex is pushed/popped from the heap at most once: O(V log V)
        - Each edge is relaxed at most once with a heap push: O(E log V)
    """
    # Step 1: Initialise distances to infinity for all nodes
    # This is the "everything is unreachable until proven otherwise" step.
    # float('inf') is Python's representation of positive infinity.
    distances = {node: float('inf') for node in graph}
    distances[source] = 0

    # Step 2: Track the predecessor of each node for path reconstruction
    predecessors = {node: None for node in graph}

    # Step 3: Initialise the priority queue with the source
    # heapq is a min-heap: smallest item comes out first.
    # Each item is (cost, city_name).
    # We use cost as the first element so heapq compares by cost.
    priority_queue = [(0, source)]

    # Step 4: Track visited nodes to avoid reprocessing
    visited = set()

    while priority_queue:
        # Pop the city with the smallest known cost
        current_cost, current_city = heapq.heappop(priority_queue)

        # If we've already visited this city, skip it
        # (we may have pushed it multiple times with different costs)
        if current_city in visited:
            continue

        # Mark as visited we've now found the shortest path to this city
        visited.add(current_city)

        # If we've reached the destination, we're done
        if current_city == destination:
            break

        # Step 5: Relax all edges from the current city
        for neighbour, edge_data in graph[current_city].items():
            if neighbour in visited:
                continue

            # Calculate the new cost through the current city
            edge_cost = edge_data[cost_key]
            new_cost = current_cost + edge_cost

            # If this path is cheaper than the best known path, update
            if new_cost < distances[neighbour]:
                distances[neighbour] = new_cost
                predecessors[neighbour] = current_city

                # Push the updated cost to the priority queue
                heapq.heappush(priority_queue, (new_cost, neighbour))

    # Step 6: Reconstruct the path from destination back to source
    path = reconstruct_path(predecessors, source, destination)

    return distances[destination], path


def reconstruct_path(predecessors: dict, source: str, destination: str) -> list:
    """
    Reconstruct the shortest path by walking backwards from destination.

    Parameters:
        predecessors: dict mapping each city to its predecessor on the shortest path
        source: starting city
        destination: target city

    Returns:
        list of cities from source to destination, or [] if no path exists
    """
    path = []
    current = destination

    while current is not None:
        path.append(current)
        current = predecessors[current]

    path.reverse()

    # Verify the path starts at the source
    if path[0] != source:
        return []  # No path exists

    return path


def format_path(path: list, cost: float, cost_key: str) -> str:
    """Format a path result for display."""
    if not path:
        return "  No path found!"

    unit = "hours" if cost_key == "time" else "(cumulative risk)"
    route = " → ".join(path)
    return f"  Route: {route}\n  Total {cost_key}: {cost:.2f} {unit}"


# ---------------------------------------------------------------------------
# Demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "..", "network_data.json")

    graph = build_graph(data_path)

    print("=" * 60)
    print("DIJKSTRA'S ALGORITHM Mumbai to Kolhapur")
    print("=" * 60)

    # Find the FASTEST route (minimise time)
    print("\n--- Optimising for TIME ---")
    time_cost, time_path = dijkstra(graph, "Mumbai", "Kolhapur", cost_key="time")
    print(format_path(time_path, time_cost, "time"))

    # Calculate the risk of the fastest route
    total_risk = sum(
        graph[time_path[i]][time_path[i+1]]["risk"]
        for i in range(len(time_path) - 1)
    )
    print(f"  Risk along this route: {total_risk:.2f}")

    # Find the SAFEST route (minimise risk)
    print("\n--- Optimising for RISK ---")
    risk_cost, risk_path = dijkstra(graph, "Mumbai", "Kolhapur", cost_key="risk")
    print(format_path(risk_path, risk_cost, "risk"))

    # Calculate the time of the safest route
    total_time = sum(
        graph[risk_path[i]][risk_path[i+1]]["time"]
        for i in range(len(risk_path) - 1)
    )
    print(f"  Time along this route: {total_time:.2f} hours")

    # Compare
    print("\n" + "=" * 60)
    print("THE DILEMMA")
    print("=" * 60)
    print(f"  Fastest route: {' → '.join(time_path)}")
    print(f"    Time: {time_cost:.1f}h | Risk: {total_risk:.2f}")
    print(f"  Safest route:  {' → '.join(risk_path)}")
    print(f"    Time: {total_time:.1f}h | Risk: {risk_cost:.2f}")
    print(f"\n  The fastest route is {total_time - time_cost:.1f}h faster")
    print(f"  but {total_risk - risk_cost:.2f} riskier.")
    print(f"\n  Which do you choose?")

    # Demonstrate path finding from all nodes
    print("\n" + "=" * 60)
    print("ALL SHORTEST PATHS FROM MUMBAI (by time)")
    print("=" * 60)
    for city in sorted(graph.keys()):
        if city == "Mumbai":
            continue
        cost, path = dijkstra(graph, "Mumbai", city, cost_key="time")
        print(f"  Mumbai → {city}: {cost:.1f}h via {' → '.join(path)}")
