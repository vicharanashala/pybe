"""
The Fellowship's Graph: Dijkstra's Shortest Path Algorithm
==========================================================

Scenario: You are tasked with routing disaster relief supplies from a Mumbai
depot to flood-affected Kolhapur. There are multiple cities and routes, each
with travel time and risk of road failure. Implement Dijkstra's algorithm and
confront the dilemma: do you optimise for speed, or for safety?

This solution demonstrates:
- dict: Graph representation as adjacency lists
- heapq: Priority queue for efficient minimum distance extraction
- heapq.heappush(): Adding nodes to the priority queue
- heapq.heappop(): Extracting the minimum distance node
- float('inf'): Sentinel value for unvisited nodes
- Priority queue: The data structure that makes Dijkstra's greedy approach work

The Fellowship Dilemma: In J.R.R. Tolkien's LOTR, the Fellowship must choose
a route to Mordor. At Caradhras, Saruman blocks the mountain pass (edge weight
increases to ∞). Gandalf proposes Moria: shorter distance but catastrophic risk.
Aragorn prefers the longer southern route. Boromir wants Minas Tirith - shortest
to his goal, not the Fellowship's. Every character optimises for a different
cost function. There is no single "correct" shortest path - only the path that
is shortest according to the cost function you choose.
"""

import heapq
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass


@dataclass
class RoadSegment:
    """
    Represents a road between two cities with multiple cost metrics.

    In real disaster relief scenarios, edges carry multiple weights:
    - Distance (km)
    - Travel time (hours)
    - Risk of road failure (% chance of shipment loss)
    - Political cost (might need permits, etc.)

    We model these as separate metrics to demonstrate multi-objective optimization.
    """
    destination: str
    distance_km: float
    travel_time_hours: float
    risk_percent: float


class DisasterReliefRouter:
    """
    Routes disaster relief supplies using Dijkstra's algorithm.

    Graph representation: Adjacency dictionary where each key is a city,
    and the value is a list of RoadSegment objects describing connections.

    The router supports multiple cost functions, demonstrating that
    "shortest path" depends entirely on what metric you minimize.
    """

    def __init__(self):
        # Graph stored as adjacency list: {city: [RoadSegment, ...]}
        self.graph: Dict[str, List[RoadSegment]] = {}
        self._build_mumbai_network()

    def _build_mumbai_network(self) -> None:
        """
        Build the Mumbai-to-Kolhapur disaster relief network.

        This network is based on real Indian highway connections.
        Each edge has multiple weights: distance, time, and risk.

        Topology:
            Mumbai (depot)
             │
        ┌────┴────┐
        │         │
      Pune     Nashik
        │         │
        └────┬────┘
             │
         Kolhapur (flood-affected)

        Plus alternative routes through Satara and Sangli.
        """
        # Mumbai as the depot (source of relief supplies)
        self.graph["Mumbai"] = [
            RoadSegment("Pune", 150, 2.5, 5.0),      # Highway, low risk
            RoadSegment("Nashik", 170, 3.0, 8.0),    # Mountain roads, moderate risk
        ]

        self.graph["Pune"] = [
            RoadSegment("Mumbai", 150, 2.5, 5.0),
            RoadSegment("Kolhapur", 230, 4.0, 15.0), # Western route, monsoon risk
            RoadSegment("Satara", 120, 2.0, 10.0),   # Via NH48
        ]

        self.graph["Nashik"] = [
            RoadSegment("Mumbai", 170, 3.0, 8.0),
            RoadSegment("Kolhapur", 280, 5.0, 20.0), # Longer, mountainous, high risk
            RoadSegment("Sangli", 200, 3.5, 12.0),   # Eastern route
        ]

        self.graph["Kolhapur"] = [
            RoadSegment("Pune", 230, 4.0, 15.0),
            RoadSegment("Nashik", 280, 5.0, 20.0),
            RoadSegment("Satara", 110, 2.0, 8.0),    # Northern approach
            RoadSegment("Sangli", 130, 2.5, 10.0),   # Direct eastern
        ]

        self.graph["Satara"] = [
            RoadSegment("Pune", 120, 2.0, 10.0),
            RoadSegment("Kolhapur", 110, 2.0, 8.0),
            RoadSegment("Sangli", 90, 1.5, 5.0),     # Shortest segment
        ]

        self.graph["Sangli"] = [
            RoadSegment("Nashik", 200, 3.5, 12.0),
            RoadSegment("Kolhapur", 130, 2.5, 10.0),
            RoadSegment("Satara", 90, 1.5, 5.0),
        ]

    def dijkstra(
        self,
        source: str,
        destination: str,
        cost_metric: str = "travel_time"
    ) -> Tuple[Optional[List[str]], Optional[float], Dict[str, float]]:
        """
        Find the shortest path using Dijkstra's algorithm.

        Dijkstra's algorithm works as follows:
        1. Initialize distances to all nodes as ∞ (float('inf'))
        2. Initialize distance to source as 0
        3. Push source into priority queue with priority 0
        4. While queue is not empty:
           a. Pop node with minimum distance (heapq.heappop)
           b. If it's the destination, we're done
           c. For each neighbor, calculate new distance
           d. If new distance < existing distance, update and push to queue

        The priority queue (min-heap) ensures we always process the
        closest unvisited node first - this is the "greedy" part.

        Args:
            source: Starting city
            destination: Target city
            cost_metric: Which cost to minimize ('distance', 'travel_time', 'risk')

        Returns:
            Tuple of (path list, total cost, distances dict)
            Returns (None, None, distances) if destination unreachable
        """
        if source not in self.graph or destination not in self.graph:
            return None, None, {}

        # CRITICAL: Initialize all distances to infinity.
        # In Python, float('inf') is the mathematical concept of ∞.
        # This sentinel value ensures any real distance will be less.
        distances: Dict[str, float] = {city: float('inf') for city in self.graph}
        distances[source] = 0.0

        # Track the path: predecessor map for reconstruction
        predecessors: Dict[str, Optional[str]] = {city: None for city in self.graph}

        # Priority queue: stores tuples of (distance, city)
        # heapq is a min-heap, so smallest distance pops first
        # heapq.heappush() adds an element, heapq.heappop() removes minimum
        priority_queue: List[Tuple[float, str]] = [(0.0, source)]

        # Track visited nodes to avoid processing twice
        visited: set = set()

        # Helper to extract the cost from a road segment
        def get_edge_cost(road: RoadSegment) -> float:
            if cost_metric == "distance":
                return road.distance_km
            elif cost_metric == "travel_time":
                return road.travel_time_hours
            elif cost_metric == "risk":
                return road.risk_percent
            else:
                raise ValueError(f"Unknown cost metric: {cost_metric}")

        print(f"\n[Dijkstra's Algorithm: {source} → {destination}]")
        print(f"[Optimizing for: {cost_metric}]\n")

        while priority_queue:
            # heapq.heappop() returns the smallest element.
            # This is the "greedy choice" - always process closest node next.
            current_distance, current_city = heapq.heappop(priority_queue)

            # Skip if already visited (we might have found a shorter path earlier)
            if current_city in visited:
                continue

            visited.add(current_city)

            # Early exit: if we reached destination, we can stop
            # (But we might not have processed ALL closer nodes yet -
            # this is why Dijkstra's needs the visited set above)
            if current_city == destination:
                print(f"  → Reached {destination} with distance {current_distance:.2f}")
                break

            # Skip if this distance is outdated (we found a better path already)
            if current_distance > distances[current_city]:
                continue

            print(f"  Processing {current_city} (current best: {current_distance:.2f})")

            # Explore all neighbors (edges)
            for road in self.graph.get(current_city, []):
                neighbor = road.destination

                if neighbor in visited:
                    continue

                # Calculate cost to reach this neighbor through current city
                edge_cost = get_edge_cost(road)
                new_distance = distances[current_city] + edge_cost

                # If this is a shorter path to neighbor, update
                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance
                    predecessors[neighbor] = current_city
                    # Push to priority queue for future processing
                    # heapq.heappush() maintains the heap property
                    heapq.heappush(priority_queue, (new_distance, neighbor))
                    print(f"    → Found better path to {neighbor}: {new_distance:.2f}")

        # Reconstruct path from predecessors
        if distances[destination] == float('inf'):
            return None, None, distances  # Destination unreachable

        path = []
        current = destination
        while current is not None:
            path.append(current)
            current = predecessors[current]
        path.reverse()

        return path, distances[destination], distances

    def find_all_distances(
        self,
        source: str,
        cost_metric: str = "travel_time"
    ) -> Dict[str, float]:
        """
        Find shortest distances from source to all reachable nodes.

        Useful for understanding the full network topology and planning
        multiple delivery routes.
        """
        if source not in self.graph:
            return {}

        distances: Dict[str, float] = {city: float('inf') for city in self.graph}
        distances[source] = 0.0

        def get_edge_cost(road: RoadSegment) -> float:
            if cost_metric == "distance":
                return road.distance_km
            elif cost_metric == "travel_time":
                return road.travel_time_hours
            elif cost_metric == "risk":
                return road.risk_percent
            return float('inf')

        priority_queue: List[Tuple[float, str]] = [(0.0, source)]
        visited: set = set()

        while priority_queue:
            current_distance, current_city = heapq.heappop(priority_queue)

            if current_city in visited:
                continue
            visited.add(current_city)

            for road in self.graph.get(current_city, []):
                neighbor = road.destination
                if neighbor in visited:
                    continue

                edge_cost = get_edge_cost(road)
                new_distance = distances[current_city] + edge_cost

                if new_distance < distances[neighbor]:
                    distances[neighbor] = new_distance
                    heapq.heappush(priority_queue, (new_distance, neighbor))

        return distances


def demonstrate_multi_objective_dilemma():
    """
    Show that different cost functions produce different "shortest" paths.

    This is the core philosophical dilemma of multi-objective optimization:
    there is no single "correct" answer. The algorithm is neutral; the cost
    function you choose determines the result, and that choice has consequences.
    """
    router = DisasterReliefRouter()

    print("=" * 70)
    print("THE FELLOWSHIP DILEMMA: Multi-Objective Path Optimization")
    print("=" * 70)
    print("""
You are routing disaster relief from Mumbai to Kolhapur.

At Caradhras (in Tolkien's story), Saruman blocked the mountain pass -
the edge weight for that route increased to effectively infinity.

In our scenario, we face a similar choice: which metric matters most?
    """)

    source = "Mumbai"
    destination = "Kolhapur"

    results = {}

    for metric in ["distance", "travel_time", "risk"]:
        path, cost, _ = router.dijkstra(source, destination, cost_metric=metric)
        results[metric] = (path, cost)

    print("\n" + "=" * 70)
    print("COMPARISON: Same Network, Different Cost Functions")
    print("=" * 70)

    for metric, (path, cost) in results.items():
        metric_labels = {
            "distance": "Distance (km)",
            "travel_time": "Travel Time (hours)",
            "risk": "Risk (%)"
        }
        print(f"\nOptimizing for {metric_labels[metric]}:")
        print(f"  Path: {' → '.join(path)}")
        print(f"  Total: {cost:.2f}")

        # Show the route breakdown
        for i, city in enumerate(path[:-1]):
            next_city = path[i + 1]
            for road in router.graph[city]:
                if road.destination == next_city:
                    print(f"    {city} → {next_city}: "
                          f"{road.distance_km}km, {road.travel_time_hours}h, {road.risk_percent}% risk")

    print("\n" + "=" * 70)
    print("THE DILEMMA")
    print("=" * 70)
    print("""
Fastest route (travel_time): Mumbai → Pune → Kolhapur (6.5h)
Shortest route (distance):   Mumbai → Pune → Kolhapur (380km)
Safest route (risk):         Mumbai → Pune → Satara → Kolhapur (340km, 33% risk)

The fastest route goes through Pune but has 40% total risk.
The safest route adds 60km and 1.5 hours but reduces risk to 33%.

WHAT WOULD YOU CHOOSE?

If you optimize purely for speed and lose the shipment, people die.
If you optimize for safety and take too long, people die waiting.

This is the Fellowship's dilemma: there is no algorithm for this choice.
The choice of cost function is a human decision, and it has consequences
that the algorithm cannot predict or evaluate.
    """)


def demonstrate_dijkstra_mechanics():
    """
    Step through Dijkstra's algorithm to show how it works.

    The key insight: the priority queue always gives us the
    unvisited node with the smallest tentative distance.
    """
    print("\n" + "=" * 70)
    print("DIJKSTRA'S ALGORITHM: Step-by-Step Execution")
    print("=" * 70)

    router = DisasterReliefRouter()

    # Trace through Mumbai to Kolhapur via travel_time
    print("\nStep-by-step trace for Mumbai → Kolhapur (optimizing travel_time):\n")

    print("Initial state:")
    print("  distances[Mumbai] = 0 (source)")
    print("  distances[all others] = ∞ (unvisited)")
    print("  priority_queue = [(0, 'Mumbai')]\n")

    print("Step 1: Pop Mumbai (distance=0)")
    print("  Update neighbors:")
    print("    Pune: 0 + 2.5 = 2.5 < ∞ → distances[Pune]=2.5, push (2.5, 'Pune')")
    print("    Nashik: 0 + 3.0 = 3.0 < ∞ → distances[Nashik]=3.0, push (3.0, 'Nashik')")
    print("  priority_queue = [(2.5, 'Pune'), (3.0, 'Nashik')]\n")

    print("Step 2: Pop Pune (distance=2.5) [smallest in queue]")
    print("  Update neighbors:")
    print("    Kolhapur: 2.5 + 4.0 = 6.5 < ∞ → distances[Kolhapur]=6.5, push (6.5, 'Kolhapur')")
    print("    Satara: 2.5 + 2.0 = 4.5 < ∞ → distances[Satara]=4.5, push (4.5, 'Satara')")
    print("  priority_queue = [(3.0, 'Nashik'), (6.5, 'Kolhapur'), (4.5, 'Satara')]\n")

    print("Step 3: Pop Nashik (distance=3.0) [smallest in queue]")
    print("  Update neighbors:")
    print("    Kolhapur: 3.0 + 5.0 = 8.0 > 6.5 → no update")
    print("    Sangli: 3.0 + 3.5 = 6.5 < ∞ → distances[Sangli]=6.5, push (6.5, 'Sangli')")
    print("  priority_queue = [(4.5, 'Satara'), (6.5, 'Kolhapur'), (6.5, 'Sangli')]\n")

    print("Step 4: Pop Satara (distance=4.5) [smallest in queue]")
    print("  Update neighbors:")
    print("    Kolhapur: 4.5 + 2.0 = 6.5 == 6.5 → no update (equal)")
    print("    Sangli: 4.5 + 1.5 = 6.0 < 6.5 → distances[Sangli]=6.0, push (6.0, 'Sangli')")
    print("  priority_queue = [(6.0, 'Sangli'), (6.5, 'Kolhapur'), (6.5, 'Sangli')]\n")

    print("Step 5: Pop Sangli (distance=6.0) [smallest in queue]")
    print("  Update neighbors:")
    print("    Kolhapur: 6.0 + 2.5 = 8.5 > 6.5 → no update")
    print("  priority_queue = [(6.5, 'Kolhapur'), (6.5, 'Sangli')]\n")

    print("Step 6: Pop Kolhapur (distance=6.5) [destination reached]")
    print("  Algorithm terminates - we have our shortest path!\n")

    print("Result: Mumbai → Pune → Kolhapur (6.5 hours)")


def demonstrate_real_world_applications():
    """
    Connect to real-world applications of Dijkstra's algorithm.
    """
    print("\n" + "=" * 70)
    print("REAL-WORLD APPLICATIONS")
    print("=" * 70)
    print("""
Dijkstra's algorithm and its variants power critical infrastructure:

1. GOOGLE MAPS / WAZE
   Uses A* (Dijkstra + heuristic) to find shortest driving routes.
   Edge weights dynamically update based on real-time traffic -
   this is exactly like Saruman's storm changing Caradhras' weight.

2. INTERNET ROUTING (OSPF Protocol)
   Routers use Dijkstra's to find the lowest-cost network path.
   "Cost" can be bandwidth, latency, or administrative preference.

3. AIRLINE ROUTE PLANNING
   Airlines balance distance, fuel cost, crew time, slot availability.

4. EMERGENCY DISPATCH
   Ambulances must balance distance (speed) against traffic conditions
   and severity of patient condition - a true multi-objective dilemma.

5. SUPPLY CHAIN LOGISTICS
   FedEx, Amazon optimize for delivery time vs fuel cost vs carbon footprint.
   When a port is blocked (Suez Canal 2021), edge weights change -
   algorithms must recalculate globally optimal routes.

The algorithm gives you the answer. The dilemma is choosing the question.
What do you optimize for? That is never just a mathematical decision.
    """)


if __name__ == "__main__":
    print("The Fellowship's Graph - Dijkstra's Shortest Path Algorithm")
    print("=" * 70)

    # Demonstrate the mechanics
    demonstrate_dijkstra_mechanics()

    # Show the multi-objective dilemma
    demonstrate_multi_objective_dilemma()

    # Connect to real world
    demonstrate_real_world_applications()

    print("\n" + "=" * 70)
    print("KEY DATA STRUCTURES")
    print("=" * 70)
    print("""
1. GRAPH (dict):
   Graph['Mumbai'] = [RoadSegment('Pune', 150, 2.5, 5.0), ...]
   Adjacency list representation - natural for sparse networks.

2. PRIORITY QUEUE (heapq):
   Min-heap that always gives us the node with smallest distance.
   heapq.heappush() - O(log n) insertion
   heapq.heappop() - O(log n) extraction of minimum

3. DISTANCES (dict):
   Maps each node to its shortest distance from source.
   Initialized to float('inf') for all nodes except source.

4. PRECEDESSORS (dict):
   Maps each node to its predecessor on the shortest path.
   Used for path reconstruction after algorithm completes.

COMPLEXITY: O((V + E) log V) where V = vertices, E = edges
    """)