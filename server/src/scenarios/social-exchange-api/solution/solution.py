"""
The Social Exchange API: Flask REST API Solution

This scenario implements a RESTful API for a village barter registry,
demonstrating the core HTTP methods (GET, POST, PUT, DELETE) mapped to
CRUD operations on a resource collection.

The philosophical anchor is that REST provides structure to what would
otherwise be chaotic - like a village market where everyone shouts their
offerings. Instead, we have a central registry where resources are
identified by URLs, and operations are standardized through HTTP verbs.

Key concepts:
- REST (Representational State Transfer) architectural style
- CRUD: Create, Read, Update, Delete operations
- HTTP status codes for meaningful responses
- JSON for data exchange
- Flask as a lightweight web framework
"""

from flask import Flask, jsonify, request, abort
from datetime import datetime
import uuid

app = Flask(__name__)

# In-memory storage for village barter items
# In a real application, this would be a database
items_db: dict[str, dict] = {}


def generate_id() -> str:
    """Generate a unique ID for new items."""
    return str(uuid.uuid4())[:8]


def validate_item_data(data: dict, require_id: bool = False) -> tuple[bool, str]:
    """
    Validate item data has required fields.

    Args:
        data: The item data dictionary to validate
        require_id: Whether the 'id' field is required

    Returns:
        Tuple of (is_valid, error_message)
    """
    if require_id and 'id' not in data:
        return False, "Missing required field: 'id'"

    if 'name' not in data or not isinstance(data.get('name'), str):
        return False, "Missing or invalid field: 'name' must be a string"

    if 'quantity' in data:
        if not isinstance(data['quantity'], (int, float)) or data['quantity'] < 0:
            return False, "Invalid field: 'quantity' must be a non-negative number"

    if 'description' in data and not isinstance(data.get('description'), str):
        return False, "Invalid field: 'description' must be a string"

    if 'owner' in data and not isinstance(data.get('owner'), str):
        return False, "Invalid field: 'owner' must be a string"

    return True, ""


def serialize_item(item_id: str, item: dict) -> dict:
    """
    Serialize an item for JSON response with metadata.

    Args:
        item_id: The item's unique identifier
        item: The item data dictionary

    Returns:
        A dictionary suitable for JSON response
    """
    return {
        "id": item_id,
        "name": item["name"],
        "quantity": item.get("quantity", 1),
        "description": item.get("description", ""),
        "owner": item.get("owner", "unknown"),
        "created_at": item.get("created_at", ""),
        "updated_at": item.get("updated_at", "")
    }


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint.

    GET /api/health

    Returns:
        JSON with server status for monitoring.
    """
    return jsonify({
        "status": "healthy",
        "service": "Social Exchange API",
        "timestamp": datetime.utcnow().isoformat()
    }), 200


@app.route('/api/items', methods=['GET'])
def get_all_items():
    """
    Retrieve all items from the registry.

    GET /api/items

    Query parameters:
        owner (optional): Filter by owner name
        name (optional): Filter by item name (partial match)

    Returns:
        JSON array of all items with 200 OK status.
    """
    owner_filter = request.args.get('owner')
    name_filter = request.args.get('name')

    results = []
    for item_id, item in items_db.items():
        # Apply owner filter if provided
        if owner_filter and item.get('owner') != owner_filter:
            continue

        # Apply name filter (partial match, case-insensitive)
        if name_filter:
            if name_filter.lower() not in item['name'].lower():
                continue

        results.append(serialize_item(item_id, item))

    return jsonify({
        "count": len(results),
        "items": results
    }), 200


@app.route('/api/items/<item_id>', methods=['GET'])
def get_single_item(item_id: str):
    """
    Retrieve a specific item by ID.

    GET /api/items/<item_id>

    Args:
        item_id: The unique identifier of the item

    Returns:
        JSON object of the item with 200 OK, or 404 if not found.
    """
    if item_id not in items_db:
        abort(404, description=f"Item '{item_id}' not found in registry")

    return jsonify(serialize_item(item_id, items_db[item_id])), 200


@app.route('/api/items', methods=['POST'])
def create_item():
    """
    Add a new item to the registry.

    POST /api/items

    Request body (JSON):
        name (required): Item name
        quantity (optional): Item quantity (default: 1)
        description (optional): Item description
        owner (optional): Owner's name

    Returns:
        JSON of created item with 201 Created status.
    """
    if not request.is_json:
        abort(400, description="Request must be JSON")

    data = request.get_json()

    is_valid, error_msg = validate_item_data(data)
    if not is_valid:
        abort(400, description=error_msg)

    item_id = generate_id()
    now = datetime.utcnow().isoformat()

    new_item = {
        "name": data['name'],
        "quantity": data.get('quantity', 1),
        "description": data.get('description', ''),
        "owner": data.get('owner', 'anonymous'),
        "created_at": now,
        "updated_at": now
    }

    items_db[item_id] = new_item

    return jsonify({
        "message": "Item created successfully",
        "item": serialize_item(item_id, new_item)
    }), 201


@app.route('/api/items/<item_id>', methods=['PUT'])
def update_item(item_id: str):
    """
    Update an existing item.

    PUT /api/items/<item_id>

    Request body (JSON):
        Any fields to update: name, quantity, description, owner

    Returns:
        JSON of updated item with 200 OK, or 404 if not found.
    """
    if item_id not in items_db:
        abort(404, description=f"Item '{item_id}' not found")

    if not request.is_json:
        abort(400, description="Request must be JSON")

    data = request.get_json()

    # Validate the data being updated
    if 'name' in data and not isinstance(data['name'], str):
        abort(400, description="Field 'name' must be a string")

    if 'quantity' in data:
        if not isinstance(data['quantity'], (int, float)) or data['quantity'] < 0:
            abort(400, description="Field 'quantity' must be non-negative")

    if 'description' in data and not isinstance(data['description'], str):
        abort(400, description="Field 'description' must be a string")

    if 'owner' in data and not isinstance(data['owner'], str):
        abort(400, description="Field 'owner' must be a string")

    # Update only the provided fields
    current_item = items_db[item_id]
    for field in ['name', 'quantity', 'description', 'owner']:
        if field in data:
            current_item[field] = data[field]

    current_item['updated_at'] = datetime.utcnow().isoformat()

    return jsonify({
        "message": "Item updated successfully",
        "item": serialize_item(item_id, current_item)
    }), 200


@app.route('/api/items/<item_id>', methods=['DELETE'])
def delete_item(item_id: str):
    """
    Remove an item from the registry.

    DELETE /api/items/<item_id>

    Args:
        item_id: The unique identifier of the item to delete

    Returns:
        JSON confirmation with 200 OK, or 404 if not found.
    """
    if item_id not in items_db:
        abort(404, description=f"Item '{item_id}' not found")

    deleted_item = items_db.pop(item_id)

    return jsonify({
        "message": "Item deleted successfully",
        "item": serialize_item(item_id, deleted_item)
    }), 200


@app.route('/api/items/bulk', methods=['DELETE'])
def delete_all_items():
    """
    Clear the entire registry.

    DELETE /api/items/bulk

    This is a destructive operation - use with caution!

    Returns:
        JSON confirmation with count of deleted items.
    """
    count = len(items_db)
    items_db.clear()

    return jsonify({
        "message": f"All {count} items deleted successfully",
        "deleted_count": count
    }), 200


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors with consistent JSON response."""
    return jsonify({
        "error": "Not Found",
        "message": str(error.description) if hasattr(error, 'description') else "Resource not found"
    }), 404


@app.errorhandler(400)
def bad_request(error):
    """Handle 400 errors with consistent JSON response."""
    return jsonify({
        "error": "Bad Request",
        "message": str(error.description) if hasattr(error, 'description') else "Invalid request"
    }), 400


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors with consistent JSON response."""
    return jsonify({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred"
    }), 500


def demonstrate_api_usage():
    """
    Demonstrate API usage patterns with curl examples.
    """
    print("""
================================================================================
API USAGE EXAMPLES (curl commands)
================================================================================

HEALTH CHECK:
    curl http://localhost:5000/api/health

LIST ALL ITEMS:
    curl http://localhost:5000/api/items

LIST ITEMS BY OWNER:
    curl http://localhost:5000/api/items?owner=John

GET SINGLE ITEM:
    curl http://localhost:5000/api/items/<item_id>

CREATE NEW ITEM:
    curl -X POST http://localhost:5000/api/items \\
         -H "Content-Type: application/json" \\
         -d '{"name": "10 Apples", "quantity": 10, "owner": "John", "description": "Fresh from my orchard"}'

UPDATE ITEM:
    curl -X PUT http://localhost:5000/api/items/<item_id> \\
         -H "Content-Type: application/json" \\
         -d '{"quantity": 5}'

DELETE ITEM:
    curl -X DELETE http://localhost:5000/api/items/<item_id>

================================================================================
HTTP STATUS CODES USED
================================================================================

200 OK          - Successful GET, PUT, DELETE
201 Created     - Successful POST (new resource created)
400 Bad Request - Invalid request data or format
404 Not Found   - Resource doesn't exist
500 Internal Error - Server-side error

================================================================================
""")


def demonstrate_with_requests():
    """
    Demonstrate API operations using Python's requests library.
    """
    try:
        import requests
    except ImportError:
        print("requests library not installed - skipping live demo")
        return

    base_url = "http://localhost:5000/api"
    print("\n" + "=" * 70)
    print("LIVE API DEMONSTRATION")
    print("=" * 70)

    print("\n1. Creating items...")
    john_apples = {
        "name": "10 Apples",
        "quantity": 10,
        "owner": "John",
        "description": "Fresh red apples"
    }
    response = requests.post(f"{base_url}/items", json=john_apples)
    print(f"   POST /api/items: {response.status_code}")
    apple_data = response.json()['item']
    apple_id = apple_data['id']
    print(f"   Created: {apple_data['name']} (ID: {apple_id})")

    mary_bread = {
        "name": "Homemade Bread",
        "quantity": 5,
        "owner": "Mary",
        "description": "Freshly baked sourdough"
    }
    response = requests.post(f"{base_url}/items", json=mary_bread)
    print(f"   POST /api/items: {response.status_code}")
    bread_data = response.json()['item']
    print(f"   Created: {bread_data['name']} (ID: {bread_data['id']})")

    print("\n2. Reading all items...")
    response = requests.get(f"{base_url}/items")
    print(f"   GET /api/items: {response.status_code}")
    print(f"   Total items: {response.json()['count']}")

    print("\n3. Reading filtered items (owner=John)...")
    response = requests.get(f"{base_url}/items?owner=John")
    print(f"   GET /api/items?owner=John: {response.status_code}")
    print(f"   John's items: {[i['name'] for i in response.json()['items']]}")

    print("\n4. Reading single item...")
    response = requests.get(f"{base_url}/items/{apple_id}")
    print(f"   GET /api/items/{apple_id}: {response.status_code}")
    print(f"   Item details: {response.json()}")

    print("\n5. Updating item (trading 5 apples)...")
    update_data = {"quantity": 5, "description": "5 apples remaining after trade"}
    response = requests.put(f"{base_url}/items/{apple_id}", json=update_data)
    print(f"   PUT /api/items/{apple_id}: {response.status_code}")
    print(f"   Updated quantity: {response.json()['item']['quantity']}")

    print("\n6. Deleting item...")
    response = requests.delete(f"{base_url}/items/{apple_id}")
    print(f"   DELETE /api/items/{apple_id}: {response.status_code}")
    print(f"   Message: {response.json()['message']}")

    print("\n7. Final state - remaining items:")
    response = requests.get(f"{base_url}/items")
    print(f"   Total items: {response.json()['count']}")
    for item in response.json()['items']:
        print(f"   - {item['name']} (owned by {item['owner']})")

    print("\n" + "=" * 70)


if __name__ == "__main__":
    print("=" * 70)
    print("THE SOCIAL EXCHANGE API: RESTful CRUD Operations with Flask")
    print("=" * 70)

    # Add some sample data for testing
    items_db["demo001"] = {
        "name": "5 Potatoes",
        "quantity": 5,
        "description": "Freshly harvested",
        "owner": "Farmer Giles",
        "created_at": "2024-01-15T10:30:00",
        "updated_at": "2024-01-15T10:30:00"
    }
    items_db["demo002"] = {
        "name": "Handmade Scarf",
        "quantity": 1,
        "description": "Wool, hand-knitted",
        "owner": "Martha",
        "created_at": "2024-01-14T15:45:00",
        "updated_at": "2024-01-14T15:45:00"
    }

    print(f"\nPre-loaded {len(items_db)} sample items into registry")

    demonstrate_api_usage()

    print("\nTo run the API server:")
    print("    python solution.py")
    print("\nThen access http://localhost:5000/api/items in your browser or with curl")