from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory database
registry = {}
current_id = 1

@app.route('/items', methods=['GET'])
def get_all_items():
    """Return all items in the registry."""
    items_list = list(registry.values())
    return jsonify(items_list), 200

@app.route('/items/<int:item_id>', methods=['GET'])
def get_item(item_id):
    """Return a single item by ID."""
    if item_id not in registry:
        return jsonify({"error": "Item not found"}), 404
    
    return jsonify(registry[item_id]), 200

@app.route('/items', methods=['POST'])
def create_item():
    """Add a new item to the registry."""
    global current_id
    data = request.json
    
    if not data or 'name' not in data or 'quantity' not in data or 'owner' not in data:
        return jsonify({"error": "Missing required fields"}), 400
        
    new_item = {
        "id": current_id,
        "name": data['name'],
        "quantity": data['quantity'],
        "owner": data['owner']
    }
    
    registry[current_id] = new_item
    current_id += 1
    
    return jsonify(new_item), 201

@app.route('/items/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    """Update an existing item."""
    if item_id not in registry:
        return jsonify({"error": "Item not found"}), 404
        
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
        
    item = registry[item_id]
    
    # Update fields if provided
    if 'name' in data:
        item['name'] = data['name']
    if 'quantity' in data:
        item['quantity'] = data['quantity']
    if 'owner' in data:
        item['owner'] = data['owner']
        
    return jsonify(item), 200

@app.route('/items/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Remove an item from the registry."""
    if item_id not in registry:
        return jsonify({"error": "Item not found"}), 404
        
    del registry[item_id]
    return jsonify({"message": "Item deleted successfully"}), 200

if __name__ == '__main__':
    # Run the Flask app
    # In a real environment, you'd use a WSGI server like gunicorn
    app.run(debug=True, port=5000)
