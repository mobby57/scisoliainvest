# Guide de Déploiement - Environnements Dev → Staging → Production

Ce guide explique comment déployer l'application SCI Solia Invest à travers les trois environnements: **Développement**, **Staging**, et **Production**.

## 📋 Table des matières

1. [Vue d'ensemble des environnements](#vue-densemble)
2. [Environnement de Développement](#environnement-de-développement)
3. [Environnement de Staging](#environnement-de-staging)
4. [Environnement de Production](#environnement-de-production)
5. [Workflow de déploiement](#workflow-de-déploiement)
6. [Tests utilisateurs](#tests-utilisateurs)

## 🎯 Vue d'ensemble

### Objectif de chaque environnement

| Environnement | Objectif | Utilisateurs | Base de données | Stabilité |
|---------------|----------|--------------|-----------------|-----------|
| **Development** | Développement et tests rapides | Développeurs | Locale/Docker | Variable |
| **Staging** | Tests utilisateurs et validation | Testeurs + Utilisateurs pilotes | Dédiée staging | Stable |
| **Production** | Application en production | Tous les utilisateurs finaux | Production | Très stable |

### Architecture multi-environnements

```
┌─────────────────────────────────────────────────────────────┐
│                     Workflow de déploiement                  │
├─────────────────┬─────────────────┬──────────────────────────┤
│  DEVELOPMENT    │    STAGING      │     PRODUCTION          │
│  (Local/Docker) │  (Pre-prod)     │     (Live)              │
│                 │                 │                          │
│  • Tests dev    │  • Tests UAT    │  • Utilisateurs finaux  │
│  • Debugging    │  • Validation   │  • Performance          │
│  • Features     │  • Integration  │  • Monitoring 24/7      │
└─────────────────┴─────────────────┴──────────────────────────┘
        ↓                 ↓                    ↓
    Dev OK?         Tests OK?           Validation finale
        ↓                 ↓                    ↓
   Merge PR    →    Deploy staging  →    Deploy production
```

---

## 🔧 Environnement de Développement

### Objectif
Développement local rapide avec hot-reload et debugging.

### Prérequis
- Docker Desktop ou Node.js 18+
- pnpm 8+
- MongoDB (Docker ou local)

### Option 1: Docker Compose (Recommandé)

```bash
# 1. Configuration
cp packages/api/.env.example packages/api/.env

# 2. Démarrer tous les services
docker-compose -f docker_compose.dev.yml up -d

# 3. Vérifier les services
docker-compose -f docker_compose.dev.yml ps

# 4. Voir les logs
docker-compose -f docker_compose.dev.yml logs -f
```

**Services disponibles:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Développement local

```bash
# 1. Installer les dépendances
pnpm install

# 2. Démarrer MongoDB (Docker)
docker run -d -p 27017:27017 --name mongo-dev mongo:7.0

# 3. Configurer l'environnement
cp packages/api/.env.example packages/api/.env.local

# 4. Démarrer le backend
cd backend
npm run dev

# 5. Démarrer le frontend (nouveau terminal)
cd frontend
npm run dev
```

### Tests en développement

```bash
# Tests backend
pnpm --filter api test

# Tests frontend
pnpm --filter client test

# Linting
pnpm lint
```

### Quand passer à Staging?

✅ Critères:
- [ ] Tous les tests unitaires passent
- [ ] Le code est linté et formaté
- [ ] Les fonctionnalités sont complètes
- [ ] Le code est mergé dans la branche `develop` ou `main`
- [ ] Build réussi en CI/CD

---

## 🎭 Environnement de Staging

### Objectif
**Environnement de pré-production pour tests utilisateurs (UAT - User Acceptance Testing)**

C'est ici que vous pouvez faire vos **essais utilisateurs** avant le déploiement en production!

### Caractéristiques
- Configuration identique à la production
- Base de données dédiée (séparée de production)
- Données de test réalistes
- Accessible aux testeurs et utilisateurs pilotes

### Déploiement Staging

#### Option 1: Docker Compose (Serveur de staging)

```bash
# 1. Cloner le repository sur le serveur staging
git clone https://github.com/yourusername/scisoliainvest.git
cd scisoliainvest

# 2. Configurer les variables d'environnement
cp packages/api/.env.staging packages/api/.env

# Éditer et remplir avec les vraies valeurs staging
vim packages/api/.env

# 3. Build et démarrer
docker-compose -f docker-compose.staging.yml build
docker-compose -f docker-compose.staging.yml up -d

# 4. Vérifier les services
docker-compose -f docker-compose.staging.yml ps
docker-compose -f docker-compose.staging.yml logs -f backend-staging

# 5. Initialiser la base de données (si nécessaire)
docker-compose -f docker-compose.staging.yml exec backend-staging npm run db:migrate
docker-compose -f docker-compose.staging.yml exec backend-staging npm run db:seed:staging
```

**Services staging:**
- Frontend: http://your-staging-server:5174
- Backend API: http://your-staging-server:5001
- MongoDB: your-staging-server:27018 (non exposé publiquement)

#### Option 2: Kubernetes (Recommandé pour production-like)

```bash
# 1. Configurer kubectl pour pointer vers votre cluster staging
kubectl config use-context staging-cluster

# 2. Build et push les images Docker avec tag staging
docker build -f Dockerfile.backend -t yourregistry/solia-api:staging .
docker build -f Dockerfile.frontend -t yourregistry/solia-client:staging .

docker push yourregistry/solia-api:staging
docker push yourregistry/solia-client:staging

# 3. Modifier les secrets
vim k8s/staging/secrets.yaml
# Encoder vos secrets: echo -n "secret" | base64

# 4. Déployer sur Kubernetes
kubectl apply -f k8s/staging/secrets.yaml
kubectl apply -f k8s/staging/mongo-deployment.yaml
kubectl apply -f k8s/staging/backend-deployment.yaml
kubectl apply -f k8s/staging/frontend-deployment.yaml
kubectl apply -f k8s/staging/ingress.yaml

# 5. Vérifier le déploiement
kubectl get all -n solia-staging
kubectl logs -n solia-staging -l app=backend -f

# 6. Tester l'endpoint
curl https://staging.soliainvest.com/api/health
```

**URL Staging (après configuration DNS):**
- Application: https://staging.soliainvest.com

### Tests utilisateurs en Staging

#### 1. Créer des comptes de test

```bash
# Créer des utilisateurs de test
docker-compose -f docker-compose.staging.yml exec backend-staging npm run create-test-users

# Ou manuellement via API
curl -X POST https://staging.soliainvest.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testeur1@example.com",
    "password": "TestPassword123!",
    "role": "user"
  }'
```

#### 2. Scénarios de test pour utilisateurs

Fournir ces scénarios aux testeurs:

**Scénario 1: Inscription et connexion**
- [ ] S'inscrire avec un nouvel email
- [ ] Vérifier l'email de confirmation
- [ ] Se connecter avec les identifiants
- [ ] Tester la déconnexion

**Scénario 2: Gestion de propriétés**
- [ ] Créer une nouvelle propriété
- [ ] Modifier les informations
- [ ] Uploader des documents
- [ ] Supprimer une propriété

**Scénario 3: Multi-tenant**
- [ ] Créer un nouveau tenant
- [ ] Inviter des utilisateurs
- [ ] Gérer les permissions

**Scénario 4: Tableaux de bord**
- [ ] Visualiser les KPIs
- [ ] Générer des rapports
- [ ] Exporter les données

#### 3. Collecter les retours

Créer un formulaire de feedback pour les testeurs:
- Fonctionnalité testée
- Problèmes rencontrés
- Suggestions d'amélioration
- Niveau de satisfaction (1-5)

### Monitoring Staging

```bash
# Logs en temps réel
kubectl logs -n solia-staging -l app=backend -f --tail=100

# Métriques de ressources
kubectl top pods -n solia-staging

# Health checks
watch -n 5 'curl -s https://staging.soliainvest.com/api/health | jq'
```

### Quand passer en Production?

✅ Critères de validation:
- [ ] Tous les tests utilisateurs sont concluants
- [ ] Aucun bug critique ou bloquant
- [ ] Performance acceptable (temps de réponse < 2s)
- [ ] Sécurité validée (scan de vulnérabilités)
- [ ] Documentation à jour
- [ ] Plan de rollback préparé
- [ ] Monitoring configuré
- [ ] Backups configurés

---

## 🚀 Environnement de Production

### Objectif
Application live accessible à tous les utilisateurs finaux.

### Prérequis
- Cluster Kubernetes production (EKS, GKE, AKS)
- Base de données managée (RDS, Atlas, etc.)
- CDN configuré (CloudFront, Cloudflare)
- Monitoring (CloudWatch, Datadog, Prometheus)
- Système de backup automatique

### Déploiement Production

```bash
# 1. Créer un tag de release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 2. Build et push les images production
docker build -f Dockerfile.backend -t yourregistry/solia-api:v1.0.0 .
docker build -f Dockerfile.backend -t yourregistry/solia-api:latest .

docker push yourregistry/solia-api:v1.0.0
docker push yourregistry/solia-api:latest

# 3. Déployer sur Kubernetes production
kubectl config use-context production-cluster

# 4. Appliquer les manifests (adaptés pour production)
kubectl apply -f k8s/production/secrets.yaml
kubectl apply -f k8s/production/backend-deployment.yaml
kubectl apply -f k8s/production/frontend-deployment.yaml
kubectl apply -f k8s/production/ingress.yaml

# 5. Vérification progressive
kubectl get pods -n solia-production -w

# 6. Smoke tests
curl https://app.soliainvest.com/api/health
curl https://app.soliainvest.com/
```

### Déploiement progressif (Canary)

```bash
# Déployer 10% du trafic sur la nouvelle version
kubectl patch deployment backend-production -n solia-production \
  -p '{"spec":{"replicas":1}}'

# Surveiller les métriques pendant 30 minutes
# Si OK, augmenter progressivement à 50% puis 100%
```

### Rollback en cas de problème

```bash
# Retour à la version précédente
kubectl rollout undo deployment/backend-production -n solia-production

# Ou revenir à une version spécifique
kubectl rollout undo deployment/backend-production -n solia-production --to-revision=2
```

---

## 🔄 Workflow de déploiement complet

### Processus recommandé

```
1. DÉVELOPPEMENT (Local)
   ├─ Développer la feature
   ├─ Tests unitaires
   ├─ Commit & Push
   └─ Pull Request
       ↓
2. CI/CD (Automatique)
   ├─ Linting
   ├─ Tests
   ├─ Build
   └─ Merge approuvé
       ↓
3. STAGING (Automatique ou manuel)
   ├─ Deploy automatique sur staging
   ├─ Tests d'intégration
   ├─ Tests utilisateurs (UAT)
   ├─ Validation métier
   └─ Approbation pour production
       ↓
4. PRODUCTION (Manuel avec approbation)
   ├─ Tag de release
   ├─ Build images production
   ├─ Backup pré-déploiement
   ├─ Déploiement progressif
   ├─ Monitoring intensif
   └─ Validation finale
```

### Automatisation avec CI/CD (GitHub Actions exemple)

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm test
      
  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: |
          # Build et push vers staging
          docker build -t registry/api:staging .
          docker push registry/api:staging
          # Deploy sur K8s staging
          kubectl apply -f k8s/staging/
          
  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production  # Nécessite approbation manuelle
    steps:
      - name: Deploy to Production
        run: |
          # Build et push vers production
          docker build -t registry/api:latest .
          docker push registry/api:latest
          # Deploy sur K8s production
          kubectl apply -f k8s/production/
```

---

## 📊 Checklist de déploiement

### Avant chaque déploiement Staging

- [ ] Tous les tests passent
- [ ] Code review approuvé
- [ ] Documentation mise à jour
- [ ] Variables d'environnement staging configurées
- [ ] Backup de la DB staging effectué

### Avant chaque déploiement Production

- [ ] Tests utilisateurs en staging validés
- [ ] Performance testée (load testing)
- [ ] Scan de sécurité effectué
- [ ] Plan de rollback préparé
- [ ] Équipe disponible pour monitoring
- [ ] Communication aux utilisateurs
- [ ] Backup production récent
- [ ] Fenêtre de maintenance planifiée (si nécessaire)

---

## 📞 Contacts et Support

- **Développement**: Slack #dev
- **Staging**: Slack #staging-tests
- **Production**: Slack #production-alerts

## 📚 Ressources supplémentaires

- [Docker Documentation](./README-DOCKER.md)
- [Kubernetes Guide](./k8s/staging/README.md)
- [Testing Guide](./TESTING_GUIDE.md)
