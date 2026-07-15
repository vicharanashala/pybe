You have been tasked with bringing order to the village barter system by building a central digital registry. 

Instead of villagers shouting in the square, they will use an app that communicates with your Python server using a REST API. The resource you are managing is an "item" offered for trade.

Each item in your registry (which you can just store in a Python list or dictionary for now) should look like this:
`{ "id": 1, "name": "Apples", "quantity": 10, "owner": "Ravi" }`

Your tasks:
1. Initialize a Flask application.
2. Create an endpoint `GET /items` that returns the list of all items in JSON format.
3. Create an endpoint `POST /items` that accepts JSON data for a new item, assigns it a unique ID, adds it to the registry, and returns the created item with a `201 Created` status code.
4. Create an endpoint `GET /items/<int:item_id>` that returns a single item. If the ID doesn't exist, return a `404 Not Found`.
5. Create an endpoint `PUT /items/<int:item_id>` that updates the quantity or name of an existing item.
6. Create an endpoint `DELETE /items/<int:item_id>` that removes the item from the registry.

Can you build a robust API that handles the village's trades?
