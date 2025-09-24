# SCI Solia Invest - Setup Guide

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- Docker & Docker Compose (for local development)
- PostgreSQL (or use Docker)

## Quick Start

1. **Install pnpm globally** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Setup environment variables**:
   Copy the example environment files and configure them:
   ```bash
   cp packages/api/.env.example packages/api/.env
   cp packages/client/.env.example packages/client/.env
   ```

4. **Start development services**:
   ```bash
   # Start database services
   docker-compose -f infrastructure/docker-compose.dev.yml up -d
   
   # Start development servers
   pnpm dev
   ```

## Project Structure

```
sci-solia-invest/
├── packages/
│   ├── api/          # Backend API (NestJS/Express)
│   ├── client/       # Frontend (Next.js/React)
│   └── shared/       # Shared utilities and types
├── infrastructure/   # Docker and deployment configs
├── scripts/         # Utility scripts
└── .github/         # GitHub Actions workflows
```

## Available Scripts

### Root Level (Monorepo)
```bash
pnpm dev          # Start both API and client in development
pnpm build        # Build all packages
pnpm test         # Run tests for all packages
pnpm lint         # Run linting for all packages
pnpm validate     # Run full validation (lint + test)
```

### Package Specific
```bash
# API package
pnpm --filter api dev
pnpm --filter api test
pnpm --filter api lint

# Client package  
pnpm --filter client dev
pnpm --filter client build
pnpm --filter client test

# Shared package
pnpm --filter shared build
pnpm --filter shared lint
```

## Development Workflow

1. **Start development environment**:
   ```bash
   # Start databases
   docker-compose -f infrastructure/docker-compose.dev.yml up -d
   
   # Start API and client
   pnpm dev
   ```

2. **API will be available at**: http://localhost:3001
3. **Client will be available at**: http://localhost:3000

## Testing

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter api test
pnpm --filter client test

# Run tests with coverage
pnpm --filter api test:coverage
pnpm --filter client test:coverage
```

## Linting and Formatting

```bash
# Run linting
pnpm lint

# Fix linting issues
pnpm --filter api lint:fix
pnpm --filter client lint:fix

# Format code
pnpm --filter api format
pnpm --filter client format
```

## Database Setup

The project uses PostgreSQL. You can either:

1. **Use Docker** (recommended for development):
   ```bash
   docker-compose -f infrastructure/docker-compose.dev.yml up -d
   ```

2. **Use local PostgreSQL**:
   - Install PostgreSQL locally
   - Update connection strings in environment variables
   - Run migrations: `pnpm --filter api db:migrate`

## Environment Variables

### API (.env)
```
DATABASE_URL=postgresql://solia:solia123@localhost:5432/solia_dev
JWT_SECRET=your-jwt-secret
NODE_ENV=development
PORT=3001
```

### Client (.env)
```
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=SCI Solia Invest
```

## CI/CD

The project includes GitHub Actions workflows for:
- **Linting**: Runs on every push and PR
- **Testing**: Runs unit and integration tests
- **Build**: Builds all packages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Port conflicts**: Check if ports 3000, 3001, 5432, 6379 are available
2. **Database connection**: Ensure PostgreSQL is running and credentials are correct
3. **Dependencies**: Run `pnpm install` if you encounter module not found errors

### Getting Help

- Check the project documentation
- Review existing issues on GitHub
- Create a new issue with detailed description
