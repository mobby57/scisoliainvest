# Guide des Environnements - SCI Solia Invest

## Vue d'ensemble

Ce document décrit les trois environnements disponibles pour le projet SCI Solia Invest et comment les utiliser pour le développement, les tests utilisateurs et la production.

## 🌍 Les Trois Environnements

### 1. 🔧 Développement (Development)
**Objectif**: Développement local et tests techniques

- **Utilisation**: Développement quotidien par les développeurs
- **Configuration**: `docker-compose.dev.yml` ou `docker_compose.dev.yml`
- **Variables d'environnement**: `.env.example`, `.env.local`
- **Base de données**: MongoDB/PostgreSQL local (port standard)
- **Ports**:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:5000`
  - MongoDB: `localhost:27017`

**Caractéristiques**:
- Hot-reload activé
- Logs détaillés (debug)
- Données de test
- Pas de sécurité stricte
- Outils de développement activés

### 2. 🧪 Staging (Pré-production)
**Objectif**: Tests utilisateurs et validation avant production

- **Utilisation**: Tests utilisateurs, UAT (User Acceptance Testing), démos client
- **Configuration**: `docker-compose.staging.yml`
- **Variables d'environnement**: `.env.staging`
- **Base de données**: Instance dédiée staging (ports différents)
- **Ports**:
  - Frontend: `http://localhost:5174`
  - Backend: `http://localhost:5001`
  - MongoDB: `localhost:27018`
  - Redis: `localhost:6380`

**Caractéristiques**:
- Configuration proche de la production
- Données réalistes mais non sensibles
- Logs détaillés pour debugging
- Sécurité intermédiaire
- Feature flags pour tester nouvelles fonctionnalités
- Monitoring activé

### 3. 🚀 Production
**Objectif**: Environnement live pour les utilisateurs finaux

- **Utilisation**: Application en production
- **Configuration**: `docker-compose.prod.yml` ou `docker_compose.prod.yml`
- **Variables d'environnement**: `.env.production`
- **Base de données**: Instance cloud sécurisée (AWS RDS, MongoDB Atlas)
- **Ports**: Standard (80, 443 avec HTTPS)

**Caractéristiques**:
- Sécurité maximale
- Données réelles et sensibles
- Logs minimal (info/warning/error)
- Performance optimisée
- Monitoring et alertes
- Backups automatiques

## 📋 Quand Utiliser Chaque Environnement ?

### Développement
✅ **À utiliser pour**:
- Développement de nouvelles fonctionnalités
- Tests unitaires et d'intégration
- Debugging de problèmes techniques
- Expérimentation de solutions

❌ **Ne PAS utiliser pour**:
- Tests utilisateurs
- Démos clients
- Validation fonctionnelle finale

### Staging
✅ **À utiliser pour**:
- **Tests utilisateurs (UAT)** ⭐
- Validation des nouvelles fonctionnalités
- Tests de performance
- Démos clients
- Formation des utilisateurs
- Tests de migration de données
- Validation des correctifs avant production

❌ **Ne PAS utiliser pour**:
- Développement de code
- Données de production réelles

### Production
✅ **À utiliser pour**:
- Utilisation réelle par les clients finaux
- Données business critiques

❌ **Ne PAS utiliser pour**:
- Tests et expérimentation
- Développement

## 🚀 Démarrage des Environnements

### Développement

```bash
# Méthode 1: Docker Compose
docker-compose -f docker-compose.dev.yml up -d

# Méthode 2: Docker Compose (alternative)
docker-compose -f docker_compose.dev.yml up -d

# Méthode 3: pnpm (recommandé pour développement)
pnpm install
pnpm dev

# Accès:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:5000
# - API Health: http://localhost:5000/api/health
```

### Staging

```bash
# Démarrer l'environnement staging
docker-compose -f docker-compose.staging.yml up -d

# Vérifier les logs
docker-compose -f docker-compose.staging.yml logs -f

# Accès:
# - Frontend: http://localhost:5174
# - Backend: http://localhost:5001
# - API Health: http://localhost:5001/api/health
```

### Production

```bash
# Démarrer l'environnement production
docker-compose -f docker-compose.prod.yml up -d

# Vérifier le statut
docker-compose -f docker-compose.prod.yml ps

# ATTENTION: Utiliser uniquement en production réelle
```

## 🔄 Workflow Recommandé

### Phase 1: Développement
```
1. Développeur travaille en local (environnement dev)
2. Commits et push sur branche feature
3. Tests unitaires automatiques via CI/CD
4. Code review et merge vers develop
```

### Phase 2: Staging (Tests Utilisateurs)
```
1. Déploiement automatique vers staging après merge
2. 👥 Tests utilisateurs sur staging
3. 📋 Validation fonctionnelle
4. 🐛 Remontée et correction de bugs
5. ✅ Validation finale
```

### Phase 3: Production
```
1. Merge vers main après validation staging
2. Déploiement vers production
3. Monitoring et surveillance
4. Support utilisateurs
```

## ⚙️ Configuration des Variables d'Environnement

### Développement
```bash
# Copier le fichier exemple
cp packages/api/.env.example packages/api/.env

# Ou utiliser .env.local pour des configurations personnelles
cp packages/api/.env.example packages/api/.env.local
```

### Staging
```bash
# Le fichier .env.staging est déjà créé
# Modifier les valeurs selon votre infrastructure staging
nano packages/api/.env.staging

# Variables importantes à configurer:
# - DATABASE_URL (base de données staging)
# - JWT_SECRET (différent de prod et dev)
# - CORS_ORIGIN (domaine staging)
# - EMAIL_* (service de test email)
```

### Production
```bash
# Utiliser des secrets sécurisés
# NE JAMAIS commiter .env.production avec de vraies valeurs
cp packages/api/.env.production packages/api/.env.production.local

# Utiliser des outils de gestion de secrets:
# - AWS Secrets Manager
# - Azure Key Vault
# - HashiCorp Vault
# - Variables d'environnement du système
```

## 🔒 Sécurité

### Développement
- Secrets simples (non critiques)
- Logs détaillés activés
- CORS permissif pour localhost

### Staging
- Secrets intermédiaires (non production)
- Logs détaillés pour debugging
- CORS configuré pour domaine staging
- HTTPS recommandé
- Base de données isolée

### Production
- **Secrets forts et uniques**
- Logs minimaux (performance)
- CORS strict
- **HTTPS obligatoire**
- Authentification renforcée
- Chiffrement des données sensibles

## 📊 Données et Base de Données

### Développement
```bash
# Seed avec données de test
cd packages/api
npm run db:seed

# Reset de la base de données
npm run db:reset
```

### Staging
```bash
# Utiliser des données anonymisées de production
npm run db:seed:staging

# Ou importer un dump anonymisé
mongorestore --uri="mongodb://localhost:27018" --drop ./staging-data-dump/
```

### Production
```bash
# Backups réguliers
npm run db:backup

# NE JAMAIS réinitialiser la base de production
# Migrations uniquement via scripts validés
npm run db:migrate:prod
```

## 🧪 Tests par Environnement

### Développement
```bash
# Tests unitaires
pnpm test

# Tests d'intégration
pnpm test:integration

# Linting
pnpm lint
```

### Staging
```bash
# Tests E2E
pnpm test:e2e

# Tests de charge
npm run test:load

# Tests utilisateurs (manuels)
# - Créer des scénarios de test
# - Impliquer les utilisateurs finaux
# - Documenter les retours
```

### Production
```bash
# Smoke tests après déploiement
npm run test:smoke

# Health checks
curl http://your-domain/api/health

# Monitoring continu
```

## 📝 Checklist de Déploiement

### Avant le Déploiement Staging
- [ ] Code mergé et testé en dev
- [ ] Tests unitaires passent
- [ ] Documentation à jour
- [ ] Variables d'environnement staging configurées
- [ ] Base de données staging prête

### Avant le Déploiement Production
- [ ] ✅ Validation complète sur staging
- [ ] ✅ Tests utilisateurs réussis
- [ ] ✅ Performance validée
- [ ] ✅ Sécurité vérifiée
- [ ] Backup de production récent
- [ ] Plan de rollback préparé
- [ ] Équipe de support informée
- [ ] Monitoring configuré

## 🆘 Dépannage

### Problème: Ports déjà utilisés

**Développement (5000, 5173)**:
```bash
# Vérifier les processus
lsof -i :5000
lsof -i :5173

# Arrêter l'environnement
docker-compose -f docker-compose.dev.yml down
```

**Staging (5001, 5174)**:
```bash
# Vérifier les processus
lsof -i :5001
lsof -i :5174

# Arrêter l'environnement staging
docker-compose -f docker-compose.staging.yml down
```

### Problème: Conflit entre environnements

**Solution**: Toujours utiliser des ports différents
- Dev: 5000 (backend), 5173 (frontend), 27017 (mongo)
- Staging: 5001 (backend), 5174 (frontend), 27018 (mongo)
- Prod: Ports standard ou configurés selon l'infrastructure

### Problème: Base de données corrompue

**Développement**:
```bash
# Réinitialiser complètement
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

**Staging**:
```bash
# Restaurer depuis un backup
./scripts/restore-staging-db.sh
```

## 📚 Ressources Complémentaires

- [README-DOCKER.md](./README-DOCKER.md) - Guide Docker détaillé
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guide des tests
- [README-SETUP.md](./README-SETUP.md) - Guide d'installation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guide de contribution

## 🎯 Résumé Rapide

| Aspect | Développement | Staging | Production |
|--------|---------------|---------|------------|
| **Qui ?** | Développeurs | Testeurs & Utilisateurs | Clients finaux |
| **Quand ?** | Quotidien | Avant chaque release | Après validation |
| **Données** | Fictives | Réalistes anonymisées | Réelles |
| **Sécurité** | Basique | Intermédiaire | Maximale |
| **Logs** | Debug | Debug | Info/Error |
| **Performance** | Non critique | Importante | Critique |
| **HTTPS** | Non requis | Recommandé | Obligatoire |

---

**Questions ?** Consultez la documentation ou créez une issue sur GitHub.
