import pytest
from flask_api import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_books(client):
    """Test the GET /api/books endpoint."""
    response = client.get('/api/books')
    assert response.status_code == 200
    data = response.get_json()
    assert "books" in data
    assert len(data["books"]) >= 2

def test_borrow_available_book(client):
    """Test borrowing an available book."""
    response = client.post('/api/books/1/borrow')
    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "Book borrowed successfully"
    assert data["book"]["available"] == False

def test_borrow_unavailable_book(client):
    """Test borrowing a book that is already borrowed."""
    # Book 2 is already borrowed in the initial state
    response = client.post('/api/books/2/borrow')
    assert response.status_code == 400
    data = response.get_json()
    assert data["error"] == "Book is already borrowed"
