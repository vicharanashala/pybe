from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory database
books = [
    {"id": 1, "title": "The Great Gatsby", "available": True},
    {"id": 2, "title": "1984", "available": False}
]

@app.route('/api/books', methods=['GET'])
def get_books():
    return jsonify({"books": books})

@app.route('/api/books/<int:book_id>/borrow', methods=['POST'])
def borrow_book(book_id):
    for book in books:
        if book['id'] == book_id:
            if book['available']:
                book['available'] = False
                return jsonify({"message": "Book borrowed successfully", "book": book}), 200
            else:
                return jsonify({"error": "Book is already borrowed"}), 400
    return jsonify({"error": "Book not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5000)
