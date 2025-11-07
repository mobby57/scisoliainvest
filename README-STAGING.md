# 🎭 Environnement Staging - Guide de Démarrage Rapide

## 🎯 Objectif

L'environnement **Staging** est conçu pour les **tests utilisateurs** (UAT - User Acceptance Testing) avant le déploiement en production.

**C'est ici que vous pouvez faire vos essais utilisateurs!**

## ⚡ Démarrage Rapide (5 minutes)

### Prérequis
- Docker Desktop installé et démarré
- 8 Go RAM minimum disponible
- Ports 5001, 5174, 27018 libres

### Option 1: Script automatique (Recommandé)

**Linux/Mac:**
```bash
./start-staging.sh
```

**Windows:**
```batch
start-staging.bat
```

### Option 2: Manuel

```bash
# 1. Copier les configurations
cp packages/api/.env.staging packages/api/.env
cp frontend/.env.staging frontend/.env

# 2. Démarrer
docker-compose -f docker-compose.staging.yml up -d

# 3. Vérifier
docker-compose -f docker-compose.staging.yml ps
```

## 🌐 Accès à l'Application

Une fois démarré (attendre ~2 minutes):

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health

## 👥 Tests Utilisateurs

### 1. Créer des comptes de test

```bash
# Créer automatiquement 5 utilisateurs de test
docker-compose -f docker-compose.staging.yml exec backend-staging npm run create-test-users

# Ou manuellement via API:
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testeur1@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Scénarios de test

Donner ces scénarios aux utilisateurs pilotes:

#### ✅ Scénario 1: Inscription et connexion (15 min)
- Créer un compte
- Vérifier l'email de confirmation
- Se connecter
- Tester la déconnexion

#### ✅ Scénario 2: Gestion de propriétés (30 min)
- Créer une nouvelle propriété
- Uploader des documents
- Modifier les informations
- Supprimer une propriété

#### ✅ Scénario 3: Tableau de bord (20 min)
- Visualiser les KPIs
- Générer des rapports
- Exporter les données

### 3. Collecter les retours

Utiliser le formulaire de feedback dans [USER_TESTING_GUIDE.md](USER_TESTING_GUIDE.md)

## 🔍 Monitoring

### Voir les logs en temps réel

```bash
# Tous les services
docker-compose -f docker-compose.staging.yml logs -f

# Backend seulement
docker-compose -f docker-compose.staging.yml logs -f backend-staging

# Frontend seulement
docker-compose -f docker-compose.staging.yml logs -f frontend-staging
```

### Vérifier l'état des services

```bash
# Liste des conteneurs
docker-compose -f docker-compose.staging.yml ps

# Statistiques de ressources
docker stats
```

### Tester les endpoints

```bash
# Health check
curl http://localhost:5001/api/health

# Test de connexion
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🛠️ Commandes Utiles

### Gestion des services

```bash
# Démarrer
docker-compose -f docker-compose.staging.yml up -d

# Arrêter
docker-compose -f docker-compose.staging.yml down

# Redémarrer
docker-compose -f docker-compose.staging.yml restart

# Rebuild
docker-compose -f docker-compose.staging.yml build --no-cache
docker-compose -f docker-compose.staging.yml up -d
```

### Gestion des données

```bash
# Réinitialiser la base de données
docker-compose -f docker-compose.staging.yml down -v
docker-compose -f docker-compose.staging.yml up -d

# Backup de la base
docker-compose -f docker-compose.staging.yml exec mongo-staging mongodump --out=/backup

# Restore
docker-compose -f docker-compose.staging.yml exec mongo-staging mongorestore /backup
```

### Debug

```bash
# Accéder au conteneur backend
docker-compose -f docker-compose.staging.yml exec backend-staging sh

# Accéder à MongoDB
docker-compose -f docker-compose.staging.yml exec mongo-staging mongosh

# Voir les variables d'environnement
docker-compose -f docker-compose.staging.yml exec backend-staging env
```

## 🔐 Configuration des Secrets

**⚠️ Important:** Avant déploiement sur un serveur, modifier les secrets!

### Backend (`packages/api/.env.staging`)

Éditer et remplacer:
```bash
# JWT Secrets - GÉNÉRER DE NOUVEAUX SECRETS
JWT_SECRET=VOTRE_SECRET_64_CHARS_MINIMUM
JWT_REFRESH_SECRET=VOTRE_REFRESH_SECRET_64_CHARS

# MongoDB - Si hébergé ailleurs
DATABASE_URL=mongodb://user:password@host:27017/db

# Azure (optionnel)
AZURE_CLIENT_ID=VOTRE_CLIENT_ID
AZURE_TENANT_ID=VOTRE_TENANT_ID
AZURE_CLIENT_SECRET=VOTRE_CLIENT_SECRET

# Email
EMAIL_USER=VOTRE_EMAIL
EMAIL_PASS=VOTRE_PASSWORD
```

### Frontend (`frontend/.env.staging`)

Éditer et remplacer:
```bash
# Si hébergé sur un serveur distant
NEXT_PUBLIC_API_URL=https://staging.votre-domaine.com/api
VITE_API_URL=https://staging.votre-domaine.com/api
```

## 📊 Différences avec Development et Production

| Critère | Development | **Staging** | Production |
|---------|-------------|-------------|------------|
| Port Frontend | 5173 | **5174** | 80/443 |
| Port Backend | 5000 | **5001** | 80/443 |
| Port MongoDB | 27017 | **27018** | Interne |
| Base de données | Locale | **Dédiée staging** | Production |
| Logs | Debug | **Debug** | Info/Warning |
| Utilisateurs | Devs | **Testeurs + Pilotes** | Tous |
| Stabilité | Variable | **Stable** | Très stable |

## 🚀 Déploiement sur Serveur

### Docker Compose (Simple)

```bash
# Sur le serveur staging
git clone https://github.com/mobby57/scisoliainvest.git
cd scisoliainvest

# Configurer les secrets
vim packages/api/.env.staging
vim frontend/.env.staging

# Démarrer
docker-compose -f docker-compose.staging.yml up -d
```

### Kubernetes (Production-like)

Voir [k8s/staging/README.md](k8s/staging/README.md) pour le déploiement Kubernetes complet.

## ✅ Critères de Validation avant Production

Avant de passer en production, vérifier:

- [ ] Au moins 5 utilisateurs ont testé pendant 2 semaines
- [ ] Aucun bug critique ou bloquant
- [ ] Score de satisfaction > 4/5
- [ ] Temps de réponse moyen < 2s
- [ ] Taux de réussite des tâches > 90%
- [ ] Toutes les fonctionnalités principales validées
- [ ] Documentation complète
- [ ] Formation des utilisateurs effectuée

## 🆘 Dépannage

### Le frontend ne se charge pas

```bash
# Vérifier les logs
docker-compose -f docker-compose.staging.yml logs frontend-staging

# Rebuild
docker-compose -f docker-compose.staging.yml build frontend-staging
docker-compose -f docker-compose.staging.yml up -d frontend-staging
```

### Le backend ne répond pas

```bash
# Vérifier les logs
docker-compose -f docker-compose.staging.yml logs backend-staging

# Vérifier la connexion MongoDB
docker-compose -f docker-compose.staging.yml exec backend-staging nc -zv mongo-staging 27017
```

### Erreur de port déjà utilisé

```bash
# Trouver le processus utilisant le port
# Linux/Mac:
lsof -i :5001
lsof -i :5174

# Windows:
netstat -ano | findstr :5001
netstat -ano | findstr :5174

# Puis arrêter le processus ou changer les ports dans docker-compose.staging.yml
```

### Réinitialisation complète

```bash
# Tout supprimer et recommencer
docker-compose -f docker-compose.staging.yml down -v
docker system prune -f
docker-compose -f docker-compose.staging.yml build --no-cache
docker-compose -f docker-compose.staging.yml up -d
```

## 📚 Documentation Complète

- [Guide complet des tests utilisateurs](USER_TESTING_GUIDE.md)
- [Guide de déploiement](DEPLOYMENT_GUIDE.md)
- [Référence rapide des environnements](QUICK_REFERENCE_ENVIRONMENTS.md)
- [Kubernetes Staging](k8s/staging/README.md)

## 📞 Support

- Issues GitHub: https://github.com/mobby57/scisoliainvest/issues
- Documentation: Voir les guides mentionnés ci-dessus

---

**✨ Prêt pour vos tests utilisateurs!**

L'environnement staging est maintenant configuré et prêt à recevoir vos utilisateurs pilotes pour valider les fonctionnalités avant la mise en production.
