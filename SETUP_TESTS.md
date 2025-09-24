# Configuration des Tests - SCI Solia Invest

## Configuration des bases de données de test

### 1. PostgreSQL test DB
```bash
createdb sci_test_db
```

### 2. Variables d'environnement
```bash
cp .env.example .env.test
```

## Exécution des tests

### Windows
```bash
npm run test:setup:windows
npm run test:all:windows
```

### Linux/macOS
```bash
npm run test:setup
npm run test:all
```

## Scripts disponibles

- `npm run test:setup` - Configure les bases de données de test (Linux/macOS)
- `npm run test:setup:windows` - Configure les bases de données de test (Windows)
- `npm run test:all` - Exécute tous les tests (Linux/macOS)
- `npm run test:all:windows` - Exécute tous les tests (Windows)
- `npm run test:unit` - Tests unitaires uniquement
- `npm run test:database` - Tests de base de données uniquement
- `npm run test:coverage` - Tests avec couverture de code