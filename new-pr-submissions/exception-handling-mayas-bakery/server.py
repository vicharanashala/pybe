import functools
import http.server
import os
import socketserver
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

if __name__ == "__main__":
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIRECTORY)

    print(f"Starting Maya's Midnight Bakery at http://localhost:{port}")
    print(f"Serving files from: {DIRECTORY}")
    print("Press Ctrl+C to stop the server.")

    with socketserver.TCPServer(("", port), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
