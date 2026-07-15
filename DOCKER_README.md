# Quick Start

## Prerequisites
- Docker and Docker Compose installed
- (Optional) For MongoDB: `docker compose --profile with-mongodb up`
- (Optional) For Redis: `docker compose --profile with-redis up`

## Start Development Environment

```bash
# Start backend + frontend
docker compose up

# Start with MongoDB
docker compose --profile with-mongodb up

# Start with Redis (future use)
docker compose --profile with-redis up
```

## Services

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Vite dev server |
| Backend | http://localhost:5000 | Flask API |
| MongoDB | mongodb://localhost:27017 | Optional database |

## Development

Changes to code auto-reload:
- Backend: Flask debug mode enabled
- Frontend: Vite HMR enabled

## Production Build

```bash
# Build images
docker build -f Dockerfile.backend -t pybe-backend .
docker build -f Dockerfile.frontend -t pybe-frontend .

# Run production
docker compose -f docker-compose.prod.yml up -d
```