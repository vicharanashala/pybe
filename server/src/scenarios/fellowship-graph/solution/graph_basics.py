"""
The Fellowship's Graph Solution: Graph Basics
================================================
Building the adjacency dictionary from raw network data.

A graph is a collection of nodes (vertices) connected by edges.
An adjacency dictionary stores this as:
    graph[city_a][city_b] = {weight_data}

This is how Middle-earth's road network or Maharashtra's highway
system becomes a data structure that algorithms can traverse.
"""

import json
from collections import defaultdict


def build_adjacency_dict(nodes: list, edges: list) -> dict:
    """
    Build an adjacency dictionary from a list of nodes and edges.

    Each edge is bidirectional (undirected graph): if Mumbai connects to
    Pune, then Pune also connects to Mumbai with the same weights.

    Parameters:
        nodes: list of city names
        edges: list of dicts with 'from', 'to', 'time', 'risk'

    Returns:
        dict of dict: graph[city_a][city_b] = {'time': ..., 'risk': ...}
    """
    # Using defaultdict so we don't need to pre-initialise each city
    graph = defaultdict(dict)

    for edge in edges:
        city_from = edge["from"]
        city_to = edge["to"]
        weight_data = {"time": edge["time"], "risk": edge["risk"]}

        # Bidirectional: add both directions
        graph[city_from][city_to] = weight_data
        graph[city_to][city_from] = weight_data

    return dict(graph)  # Convert back to regular dict for clarity


def load_network(filepath: str) -> dict:
    """Load the network data from a JSON file and build the graph."""
    with open(filepath, 'r') as f:
        data = json.load(f)

    graph = build_adjacency_dict(data["nodes"], data["edges"])
    return graph, data["nodes"]


def display_graph(graph: dict):
    """Pretty-print the adjacency dictionary."""
    print("=" * 60)
    print("ADJACENCY DICTIONARY Road Network")
    print("=" * 60)

    for city in sorted(graph.keys()):
        print(f"\n{city}:")
        for neighbour, weights in sorted(graph[city].items()):
            time_h = weights['time']
            risk_pct = weights['risk'] * 100
            risk_bar = "█" * int(risk_pct / 10) + "░" * (10 - int(risk_pct / 10))
            print(f"  → {neighbour:12s}  {time_h}h  risk: {risk_pct:5.1f}% {risk_bar}")


def get_neighbours(graph: dict, city: str) -> list:
    """Get all neighbours of a city with their edge weights."""
    if city not in graph:
        return []
    return [(neighbour, data) for neighbour, data in graph[city].items()]


def remove_edge(graph: dict, city_a: str, city_b: str) -> dict:
    """
    Remove an edge from the graph (simulate road collapse).

    This is the dynamic update like Saruman's storm blocking Caradhras.
    """
    graph = {city: dict(neighbours) for city, neighbours in graph.items()}

    if city_b in graph.get(city_a, {}):
        del graph[city_a][city_b]
    if city_a in graph.get(city_b, {}):
        del graph[city_b][city_a]

    print(f"[UPDATE] Road between {city_a} and {city_b} removed (collapsed/flooded)")
    return graph


# ---------------------------------------------------------------------------
# Demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import os

    # Load from the network_data.json file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(script_dir, "..", "network_data.json")

    graph, nodes = load_network(data_path)
    display_graph(graph)

    print("\n" + "=" * 60)
    print("NEIGHBOUR LOOKUP EXAMPLES")
    print("=" * 60)

    for city in ["Mumbai", "Satara", "Kolhapur"]:
        neighbours = get_neighbours(graph, city)
        print(f"\n{city} connects to:")
        for name, data in neighbours:
            print(f"  {name}: {data['time']}h, {data['risk']*100:.0f}% risk")

    # Simulate the Pune-Karad bridge collapse
    print("\n" + "=" * 60)
    print("DYNAMIC UPDATE Bridge Collapse")
    print("=" * 60)
    updated_graph = remove_edge(graph, "Pune", "Karad")
    print(f"\nPune's neighbours after collapse:")
    for name, data in get_neighbours(updated_graph, "Pune"):
        print(f"  {name}: {data['time']}h, {data['risk']*100:.0f}% risk")
