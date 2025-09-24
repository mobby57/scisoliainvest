# Guide de Tests - SCI Solia Invest

## Vue d'ensemble

Ce guide décrit la stratégie de tests complète pour la plateforme SCI Solia Invest, incluant les tests unitaires, d'intégration et end-to-end.

## Architecture des Tests

### 1. Tests Unitaires

#### API (Backend)
- **Framework**: Vitest + Supertest
- **Localisation**: `packages/api/tests/`
- **Configuration**: `packages/api/vitest.config.ts`

```bash
# Exécuter les tests unitaires API
cd packages/api
npm run test

# Avec couverture
npm run test:coverage
```

#### Client (Frontend)
- **Framework**: Vitest + Testing Library
- **Localisation**: `packages/client/src/tests/`
- **Configuration**: `packages/client/vitest.config.ts`

```bash
# Exécuter les tests unitaires Client
cd packages/client
npm run test:unit

# Mode watch
npm run test:watch
```

### 2. Tests End-to-End

#### Postman/Newman (API)
- **Collection**: `SCI_Solia_Invest_Tests.postman_collection.json`
- **Environnement**: `SCI_Solia_Invest_Test.postman_environment.json`

```bash
# Exécuter avec Newman
newman run SCI_Solia_Invest_Tests.postman_collection.json \
  -e SCI_Solia_Invest_Test.postman_environment.json
```

#### Playwright (Frontend)
- **Configuration**: `packages/client/playwright.config.ts`
- **Tests**: `packages/client/e2e/`

```bash
# Exécuter les tests E2E
cd packages/client
npm run test:e2e
```

### 3. Tests de Base de Données

#### Validation MongoDB & PostgreSQL
- **Tests**: `packages/api/tests/database.test.ts`
- **Couverture**: Connexions, intégrité, performance

```bash
# Tester la base de données
cd packages/api
npm run test -- tests/database.test.ts
```

## Scripts d'Automatisation

### Script Principal (Bash)
```bash
# Exécuter tous les tests
./scripts/run-all-tests.sh

# Tests spécifiques
./scripts/run-all-tests.sh --type=unit
./scripts/run-all-tests.sh --type=e2e
```

### Script PowerShell (Windows)
```powershell
# Tous les tests
.\scripts\run-tests.ps1

# Tests avec couverture
.\scripts\run-tests.ps1 -Coverage

# Tests spécifiques
.\scripts\run-tests.ps1 -TestType "api"
.\scripts\run-tests.ps1 -TestType "client"
```

## Configuration des Environnements

### Variables d'Environnement de Test

```bash
# API Test Environment
DATABASE_URL_TEST=postgresql://test:test@localhost:5432/test_db
MONGODB_URI_TEST=mongodb://localhost:27017/sci_test
JWT_SECRET_TEST=test_secret_key
NODE_ENV=test

# Client Test Environment
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=test
```

### Base de Données de Test

#### Setup PostgreSQL Test
```sql
CREATE DATABASE sci_test_db;
CREATE USER test_user WITH PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE sci_test_db TO test_user;
```

#### Setup MongoDB Test
```bash
# Utilisation de MongoDB Memory Server (automatique)
# Ou instance locale dédiée aux tests
mongod --dbpath ./test-data --port 27018
```

## Couverture de Tests

### Objectifs de Couverture
- **Lignes**: > 80%
- **Fonctions**: > 85%
- **Branches**: > 75%
- **Statements**: > 80%

### Génération des Rapports
```bash
# Rapport de couverture API
cd packages/api
npm run test:coverage

# Rapport de couverture Client
cd packages/client
npm run test:coverage

# Rapport consolidé
node scripts/generate-test-report.js
```

## Tests par Fonctionnalité

### 1. Authentification
- **Tests unitaires**: Validation des tokens, hashage des mots de passe
- **Tests d'intégration**: Login/logout, refresh tokens
- **Tests E2E**: Parcours utilisateur complet

### 2. Gestion des Projets
- **Tests unitaires**: CRUD operations, validations
- **Tests d'intégration**: Relations avec utilisateurs, calculs SCI
- **Tests E2E**: Création, modification, suppression de projets

### 3. KYC (Know Your Customer)
- **Tests unitaires**: Validation des documents, statuts
- **Tests d'intégration**: Workflow d'approbation
- **Tests E2E**: Soumission et traitement KYC

### 4. Base de Données
- **Tests de connexion**: MongoDB et PostgreSQL
- **Tests d'intégrité**: Contraintes, relations
- **Tests de performance**: Requêtes complexes, concurrence

## Intégration Continue

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: ./scripts/run-all-tests.sh
      - uses: codecov/codecov-action@v3
```

### Hooks Git
```bash
# Pre-commit hook
#!/bin/sh
npm run lint:fix
npm run test:unit
```

## Debugging des Tests

### Logs de Debug
```bash
# Tests avec logs détaillés
DEBUG=sci:* npm run test

# Tests spécifiques avec verbose
npm run test -- --verbose tests/auth.test.ts
```

### Outils de Debug
- **API**: Node.js Inspector, Postman Console
- **Client**: Browser DevTools, React DevTools
- **Base de données**: MongoDB Compass, pgAdmin

## Bonnes Pratiques

### 1. Structure des Tests
```typescript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Scenario', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 2. Mocking
```typescript
// Mock des services externes
vi.mock('../services/emailService', () => ({
  sendEmail: vi.fn().mockResolvedValue(true)
}));

// Mock des APIs
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({ data: 'test' })
});
```

### 3. Données de Test
```typescript
// Factory pattern pour les données de test
export const createTestUser = (overrides = {}) => ({
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123!',
  ...overrides
});
```

## Métriques et Monitoring

### Métriques Collectées
- Temps d'exécution des tests
- Taux de réussite/échec
- Couverture de code
- Performance des requêtes

### Rapports Automatisés
- Rapport HTML consolidé
- Notifications Slack/Email
- Métriques dans Grafana/DataDog

## Troubleshooting

### Problèmes Courants

#### Tests qui échouent aléatoirement
```bash
# Augmenter les timeouts
npm run test -- --testTimeout=10000

# Exécuter en série
npm run test -- --runInBand
```

#### Problèmes de base de données
```bash
# Reset de la base de test
npm run db:reset:test

# Vérifier les connexions
npm run test:db-connection
```

#### Problèmes de mémoire
```bash
# Augmenter la mémoire Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run test
```

## Ressources

- [Documentation Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Postman Testing](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Playwright](https://playwright.dev/)

---

Pour toute question sur les tests, consultez l'équipe de développement ou créez une issue sur le repository.