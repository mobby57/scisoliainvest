# SCI Solia Invest Platform

Welcome to the SCI Solia Invest Platform repository! This project aims to provide a comprehensive SaaS solution for managing investments and properties.

## 🎯 Testing Environments: Dev → Staging → Production

**Want to know when you can test with users?** Check out our guides:

- **[Quick Reference - Environments](QUICK_REFERENCE_ENVIRONMENTS.md)** - Aide-mémoire rapide
- **[User Testing Guide](USER_TESTING_GUIDE.md)** - Guide complet pour tests utilisateurs (DEV → STAGING → PROD)
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Guide de déploiement détaillé

### Quick Start by Environment

| Environment | Purpose | Quick Start | Access |
|-------------|---------|-------------|--------|
| **Development** | Dev & debugging | `docker-compose -f docker_compose.dev.yml up -d` | http://localhost:5173 |
| **Staging** | User testing (UAT) | `docker-compose -f docker-compose.staging.yml up -d` | http://server:5174 |
| **Production** | Live application | `kubectl apply -f k8s/production/` | https://app.soliainvest.com |

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/sci-solia-invest.git
   cd sci-solia-invest
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Run the development server:**

   ```bash
   pnpm dev
   ```

   Or use Docker for a complete environment:

   ```bash
   docker-compose -f docker_compose.dev.yml up -d
   ```

## Project Structure

- `packages/api`: Contains the backend API code.
- `packages/client`: Contains the frontend application code.
- `packages/shared`: Shared code between the client and server.
- `infrastructure`: Infrastructure-related files (e.g., Docker, Terraform).
- `scripts`: Utility scripts for development and deployment.
- `k8s/`: Kubernetes deployment manifests
  - `k8s/staging/`: Staging environment manifests (for user testing)
  - `k8s/production/`: Production environment manifests

## Environment Configurations

Each environment has its own configuration:

- **Development**: `docker_compose.dev.yml`, `.env.local`
- **Staging**: `docker-compose.staging.yml`, `.env.staging` (for user acceptance testing)
- **Production**: `docker_compose.prod.yml`, `.env.production`

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete deployment instructions.

## Documentation

- [Setup Guide](README-SETUP.md) - Initial setup instructions
- [Docker Guide](README-DOCKER.md) - Docker deployment guide
- [User Testing Guide](USER_TESTING_GUIDE.md) - How and when to test with users
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment workflow
- [Quick Reference](QUICK_REFERENCE_ENVIRONMENTS.md) - Environment quick reference

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License.
