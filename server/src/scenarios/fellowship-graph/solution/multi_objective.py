"""
The Fellowship's Graph Solution: Multi-Objective Optimisation
===============================================================
What happens when there is no single "correct" answer?

Dijkstra's algorithm is perfect for a single objective. But when edges
carry multiple weights (time AND risk), there is no single shortest path.
There is only the path that is shortest according to the combined cost
function you define.

This is the Dilemma Gandalf's choice at Caradhras:
  - Minimise time → Moria (short but deadly)
  - Minimise risk → southern route (safe but slow)
  - Balanced → depends entirely on how you weight the objectives

The mathematical truth: there is a Pareto frontier of non-dominated
solutions. No solution on this frontier is objectively "better" than
another. The choice between them is a human decision, not a mathematical one.
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


def dijkstra_weighted(graph: dict, source: str, destination: str,
                      time_weight: float = 0.5, risk_weight: float = 0.5,
                      time_max: float = 10.0, risk_max: float = 1.0) -> tuple:
    """
    Dijkstra's with a weighted combination of time and risk.

    The combined cost for each edge is:
        cost = time_weight * (time / time_max) + risk_weight * (risk / risk_max)

    We normalise time and risk to [0, 1] before combining, because
    they are on different scales (hours vs probability).

    Parameters:
        graph: adjacency dictionary
        source: starting city
        destination: target city
        time_weight: importance of time (0 to 1)
        risk_weight: importance of risk (0 to 1)
        time_max: maximum time value for normalisation
        risk_max: maximum risk value for normalisation

    Returns:
        (total_combined_cost, total_time, total_risk, path)
    """
    distances = {node: float('inf') for node in graph}
    distances[source] = 0
    predecessors = {node: None for node in graph}
    priority_queue = [(0, source)]
    visited = set()

    # Also track raw time and risk for reporting
    raw_time = {node: float('inf') for node in graph}
    raw_risk = {node: float('inf') for node in graph}
    raw_time[source] = 0
    raw_risk[source] = 0

    while priority_queue:
        current_cost, current_city = heapq.heappop(priority_queue)

        if current_city in visited:
            continue
        visited.add(current_city)

        if current_city == destination:
            break

        for neighbour, edge_data in graph[current_city].items():
            if neighbour in visited:
                continue

            # Calculate the normalised combined cost
            norm_time = edge_data["time"] / time_max
            norm_risk = edge_data["risk"] / risk_max
            edge_cost = time_weight * norm_time + risk_weight * norm_risk

            new_cost = current_cost + edge_cost

            if new_cost < distances[neighbour]:
                distances[neighbour] = new_cost
                predecessors[neighbour] = current_city
                raw_time[neighbour] = raw_time[current_city] + edge_data["time"]
                raw_risk[neighbour] = raw_risk[current_city] + edge_data["risk"]
                heapq.heappush(priority_queue, (new_cost, neighbour))

    # Reconstruct path
    path = []
    current = destination
    while current is not None:
        path.append(current)
        current = predecessors[current]
    path.reverse()

    if path[0] != source:
        return float('inf'), float('inf'), float('inf'), []

    return distances[destination], raw_time[destination], raw_risk[destination], path


def explore_pareto_frontier(graph: dict, source: str, destination: str):
    """
    Sweep across different time/risk weightings to map the Pareto frontier.

    The Pareto frontier is the set of solutions where you cannot improve
    one objective without worsening another. Every point on this frontier
    is "optimal" under some weighting the choice between them is yours.
    """
    print("=" * 70)
    print("PARETO FRONTIER EXPLORATION Mumbai to Kolhapur")
    print("=" * 70)
    print(f"{'Time Weight':>12} {'Risk Weight':>12} {'Time (h)':>10} "
          f"{'Risk':>8} {'Route'}")
    print("-" * 70)

    results = []
    previous_path = None

    for time_pct in range(0, 101, 10):
        tw = time_pct / 100
        rw = 1.0 - tw

        combined, total_time, total_risk, path = dijkstra_weighted(
            graph, source, destination,
            time_weight=tw, risk_weight=rw
        )

        route_str = " → ".join(path) if path else "NO PATH"

        # Mark when the route changes
        changed = "  ← ROUTE CHANGED" if path != previous_path and previous_path is not None else ""
        previous_path = path

        print(f"{tw:>11.0%} {rw:>11.0%} {total_time:>10.1f} "
              f"{total_risk:>8.2f} {route_str}{changed}")

        results.append({
            "time_weight": tw,
            "risk_weight": rw,
            "total_time": total_time,
            "total_risk": total_risk,
            "path": path,
        })

    return results


def discuss_dilemma(results: list):
    """
    Print a discussion of the multi-objective dilemma.

    This is the philosophical heart of the scenario the part that
    no algorithm can resolve.
    """
    print("\n" + "=" * 70)
    print("THE DILEMMA Discussion")
    print("=" * 70)

    # Find unique routes
    unique_routes = {}
    for r in results:
        route_key = " → ".join(r["path"])
        if route_key not in unique_routes:
            unique_routes[route_key] = {
                "time": r["total_time"],
                "risk": r["total_risk"],
                "time_weight_range": (r["time_weight"], r["time_weight"]),
            }
        else:
            existing = unique_routes[route_key]
            existing["time_weight_range"] = (
                min(existing["time_weight_range"][0], r["time_weight"]),
                max(existing["time_weight_range"][1], r["time_weight"]),
            )

    print(f"\nThe algorithm found {len(unique_routes)} distinct optimal routes:")
    for i, (route, data) in enumerate(unique_routes.items(), 1):
        tw_lo, tw_hi = data["time_weight_range"]
        print(f"\n  Route {i}: {route}")
        print(f"    Time: {data['time']:.1f}h | Risk: {data['risk']:.2f}")
        print(f"    Optimal when time weight is {tw_lo:.0%} to {tw_hi:.0%}")

    print(f"""
  ─────────────────────────────────────────────────────────────
  OBSERVATION: The "optimal" route changes depending on how you
  weight time versus risk. There is NO single correct answer.

  If you weight time heavily → you get the fastest route,
  but you gamble with the shipment.

  If you weight risk heavily → you get the safest route,
  but people wait longer for supplies they desperately need.

  The algorithm does exactly what you ask. The question is:
  what are you asking it to do?

  This is Gandalf's choice at Caradhras. This is the dispatcher's
  choice in every ambulance service. This is the cost function
  dilemma that no optimisation algorithm can resolve.

  The math gives you the answer. The morality chooses the question.
  ─────────────────────────────────────────────────────────────
""")


# ---------------------------------------------------------------------------
# Demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "..", "network_data.json")

    graph = build_graph(data_path)

    # Explore the full Pareto frontier
    results = explore_pareto_frontier(graph, "Mumbai", "Kolhapur")

    # Discuss the dilemma
    discuss_dilemma(results)

    # Specific scenarios
    print("=" * 70)
    print("SPECIFIC SCENARIOS")
    print("=" * 70)

    scenarios = [
        ("Emergency lives at immediate risk", 0.9, 0.1),
        ("Standard delivery balanced", 0.5, 0.5),
        ("Expensive cargo cannot afford loss", 0.2, 0.8),
        ("Time irrelevant safety only", 0.0, 1.0),
    ]

    for name, tw, rw in scenarios:
        _, time_h, risk, path = dijkstra_weighted(
            graph, "Mumbai", "Kolhapur",
            time_weight=tw, risk_weight=rw
        )
        print(f"\n  Scenario: {name}")
        print(f"    Weights: time={tw:.0%}, risk={rw:.0%}")
        print(f"    Route: {' → '.join(path)}")
        print(f"    Time: {time_h:.1f}h | Risk: {risk:.2f}")
