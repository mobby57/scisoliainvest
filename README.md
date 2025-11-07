# SCI Solia Invest Platform

Welcome to the SCI Solia Invest Platform repository! This project aims to provide a comprehensive SaaS solution for managing investments and properties.

## 🌍 Environnements Disponibles

Ce projet supporte trois environnements distincts pour différentes phases du cycle de développement:

- **🔧 Développement** - Pour le développement local quotidien
- **🧪 Staging** - Pour les tests utilisateurs et la validation avant production
- **🚀 Production** - Pour l'utilisation en production

📖 **Consultez le [Guide des Environnements](ENVIRONMENT_GUIDE.md) pour les détails complets**

## Getting Started

### Méthode 1: Démarrage Rapide avec Scripts

**Linux/Mac:**
```bash
# Développement
./start-env.sh dev start

# Staging (pour tests utilisateurs)
./start-env.sh staging start

# Production
./start-env.sh prod start
```

**Windows (PowerShell):**
```powershell
# Développement
.\start-env.ps1 -Environment dev -Command start

# Staging (pour tests utilisateurs)
.\start-env.ps1 -Environment staging -Command start

# Production
.\start-env.ps1 -Environment prod -Command start
```

### Méthode 2: Installation Manuelle

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

### Méthode 3: Docker Compose

**Développement:**
```bash
docker-compose -f docker-compose.dev.yml up -d
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

**Staging (Tests Utilisateurs):**
```bash
docker-compose -f docker-compose.staging.yml up -d
# Frontend: http://localhost:5174
# Backend: http://localhost:5001
```

**Production:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Project Structure

- `packages/api`: Contains the backend API code.
- `packages/client`: Contains the frontend application code.
- `packages/shared`: Shared code between the client and server.
- `infrastructure`: Infrastructure-related files (e.g., Docker, Terraform).
- `scripts`: Utility scripts for development and deployment.

## 📚 Documentation

- [Guide des Environnements](ENVIRONMENT_GUIDE.md) - Guide complet des environnements Dev/Staging/Prod
- [README-SETUP.md](README-SETUP.md) - Guide d'installation détaillé
- [README-DOCKER.md](README-DOCKER.md) - Guide Docker complet
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Guide des tests
- [CONTRIBUTING.md](CONTRIBUTING.md) - Guide de contribution

## 🧪 Quand Utiliser Chaque Environnement ?

| Environnement | Usage | Accès |
|---------------|-------|-------|
| **Développement** | Développement quotidien, tests techniques | http://localhost:5173 |
| **Staging** | **Tests utilisateurs, UAT, validation** | http://localhost:5174 |
| **Production** | Application live pour clients | Domaine de production |

**Pour les tests utilisateurs**, utilisez toujours l'environnement **Staging** !

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License.
