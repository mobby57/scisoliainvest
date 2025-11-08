# Docker Setup Guide

This guide explains how to use Docker and Docker Compose with the SCI Solia Invest platform.

## Quick Start

### Local Development (Databases Only)

For local development with databases only:

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Stop services
docker-compose down
```

### Full Development Environment

For complete development environment with backend, frontend, and dev tools:

```bash
# Start full development stack
cd infrastructure/environments/dev
docker-compose up -d

# Access services:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:4000
# - PgAdmin: http://localhost:5050
# - Redis Commander: http://localhost:8081
# - Mailhog: http://localhost:8025

# Stop services
docker-compose down
```

### Production Deployment

For production-like deployment:

```bash
cd infrastructure/environments/prod
docker-compose -f docker-compose.prod.yml up -d
```

## Docker Compose Files

The project uses different docker-compose files for different purposes:

- **`docker-compose.yml`** (root): Basic databases setup for local development
- **`infrastructure/environments/dev/docker-compose.yml`**: Complete development environment
- **`infrastructure/environments/prod/docker-compose.prod.yml`**: Production configuration

## Using Makefile

The project includes a Makefile with convenient commands:

```bash
# Show available commands
make help

# Start development environment
make dev

# Stop development environment
make dev-stop

# Build Docker images
make build-docker

# View logs
make logs

# Clean up
make clean
```

## Environment Variables

Each environment has its own `.env.example` file:

```bash
# Copy and customize for your environment
cp infrastructure/environments/dev/.env.example infrastructure/environments/dev/.env
```

## Kubernetes Deployment

For production Kubernetes deployment, see:
- [Kubernetes README](k8s/README.md)
- [Helm Charts](infrastructure/helm/README.md)
- [DevOps Documentation](docs/DEVOPS.md)

## Troubleshooting

### Containers Won't Start

```bash
# Check logs
docker-compose logs

# Restart specific service
docker-compose restart postgres
```

### Port Already in Use

Change port in docker-compose.yml or .env file:

```yaml
ports:
  - "5433:5432"  # Use different host port
```

### Database Connection Issues

```bash
# Check if database is ready
docker-compose exec postgres pg_isready -U solia

# Access database directly
docker-compose exec postgres psql -U solia -d solia_dev
```

## Additional Resources

- [Infrastructure Documentation](infrastructure/README.md)
- [DevOps Guide](docs/DEVOPS.md)
- [Contributing Guide](CONTRIBUTING.md)
