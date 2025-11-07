# Guide de Tests Utilisateurs - Environnements Dev, Staging, Production

## 🎯 Quand et comment faire des tests utilisateurs?

Ce guide répond à la question: **"À quel moment je vais pouvoir faire des essais, utilisateurs en mode développement, Staging, puis production?"**

---

## 📅 Timeline des tests

```
┌────────────────────────────────────────────────────────────────┐
│                    Timeline de tests                            │
├──────────────────┬──────────────────┬───────────────────────────┤
│  DÉVELOPPEMENT   │    STAGING       │     PRODUCTION           │
│  (Semaine 1-2)   │  (Semaine 3-4)   │     (Semaine 5+)         │
│                  │                  │                           │
│  Tests dev       │  Tests UAT       │  Tests de fumée          │
│  rapides         │  + Utilisateurs  │  Monitoring continu      │
│                  │  pilotes         │                           │
└──────────────────┴──────────────────┴───────────────────────────┘
```

---

## 🔧 1. Tests en Développement (DEV)

### Quand?
✅ **Dès maintenant** - Pour les développeurs et tests rapides

### Qui peut tester?
- Développeurs
- Équipe technique

### Comment démarrer?

#### Option A: Docker Compose (Le plus simple)

```bash
# 1. Cloner le projet
git clone https://github.com/mobby57/scisoliainvest.git
cd scisoliainvest

# 2. Démarrer l'environnement
docker-compose -f docker_compose.dev.yml up -d

# 3. Attendre que tout soit prêt (~1-2 minutes)
docker-compose -f docker_compose.dev.yml ps

# 4. Accéder à l'application
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
```

#### Option B: Installation locale

```bash
# 1. Prérequis
# - Node.js 18+
# - pnpm 8+
# - MongoDB

# 2. Installation
pnpm install

# 3. Démarrer MongoDB
docker run -d -p 27017:27017 --name mongo-dev mongo:7.0

# 4. Configuration
cp packages/api/.env.example packages/api/.env.local
cp frontend/.env frontend/.env.local

# 5. Démarrer les services
pnpm dev
```

### Que tester en DEV?

- [ ] L'application démarre sans erreur
- [ ] Les pages s'affichent correctement
- [ ] Les fonctionnalités de base marchent
- [ ] Pas d'erreurs JavaScript dans la console

### Durée recommandée
**1-2 semaines** de développement et tests techniques

---

## 🎭 2. Tests en Staging (STAGING)

### Quand?
✅ **Après validation DEV** - Pour tests utilisateurs réels (UAT)

### Qui peut tester?
- **Utilisateurs pilotes** (petit groupe sélectionné)
- Testeurs QA
- Product owners
- Équipe métier

### Comment démarrer le Staging?

#### Pour l'administrateur système:

```bash
# 1. Sur le serveur de staging
git clone https://github.com/mobby57/scisoliainvest.git
cd scisoliainvest

# 2. Configurer les variables staging
cp packages/api/.env.staging packages/api/.env
vim packages/api/.env  # Remplir avec les vraies valeurs

cp frontend/.env.staging frontend/.env
vim frontend/.env  # Remplir avec les vraies valeurs

# 3. Démarrer avec Docker Compose
docker-compose -f docker-compose.staging.yml build
docker-compose -f docker-compose.staging.yml up -d

# 4. Vérifier que tout fonctionne
docker-compose -f docker-compose.staging.yml ps
docker-compose -f docker-compose.staging.yml logs -f backend-staging

# 5. Initialiser les données de test
docker-compose -f docker-compose.staging.yml exec backend-staging npm run db:seed:staging
```

#### Kubernetes (pour environnement plus robuste):

```bash
# 1. Build et push des images
docker build -f Dockerfile.backend -t votre-registry/solia-api:staging .
docker build -f Dockerfile.frontend -t votre-registry/solia-client:staging .

docker push votre-registry/solia-api:staging
docker push votre-registry/solia-client:staging

# 2. Déployer sur Kubernetes
kubectl apply -f k8s/staging/

# 3. Vérifier le déploiement
kubectl get pods -n solia-staging
kubectl get ingress -n solia-staging
```

### Accès Staging

Une fois déployé, l'application sera accessible à:

**Docker Compose:**
- Frontend: http://votre-serveur-staging:5174
- API: http://votre-serveur-staging:5001

**Kubernetes:**
- Application: https://staging.soliainvest.com (après configuration DNS)

### Créer des comptes de test pour les utilisateurs

```bash
# Créer 5 utilisateurs de test
docker-compose -f docker-compose.staging.yml exec backend-staging node scripts/create-test-users.js

# Ou manuellement via curl
curl -X POST http://votre-serveur-staging:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testeur1@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User 1"
  }'
```

### Scénarios de tests pour utilisateurs pilotes

Fournir cette checklist aux testeurs:

#### Test 1: Authentification (15 min)
- [ ] Créer un compte avec email
- [ ] Vérifier réception de l'email de confirmation
- [ ] Se connecter
- [ ] Tester "Mot de passe oublié"
- [ ] Se déconnecter

#### Test 2: Gestion des propriétés (30 min)
- [ ] Créer une nouvelle propriété
- [ ] Remplir tous les champs obligatoires
- [ ] Upload d'un document (PDF)
- [ ] Upload d'une photo
- [ ] Modifier la propriété
- [ ] Rechercher la propriété
- [ ] Supprimer la propriété

#### Test 3: Tableau de bord (20 min)
- [ ] Accéder au dashboard
- [ ] Vérifier l'affichage des KPI
- [ ] Générer un rapport mensuel
- [ ] Exporter en PDF
- [ ] Exporter en Excel

#### Test 4: Multi-utilisateurs (20 min)
- [ ] Créer un tenant
- [ ] Inviter un autre utilisateur
- [ ] Accepter l'invitation
- [ ] Tester les permissions
- [ ] Gérer les rôles (admin, user, viewer)

#### Test 5: Performance et UX (15 min)
- [ ] Tester sur mobile
- [ ] Tester sur tablette
- [ ] Tester sur desktop
- [ ] Vérifier temps de chargement (<3s)
- [ ] Tester la navigation

### Formulaire de feedback pour testeurs

Demander aux utilisateurs de remplir après chaque session:

```markdown
## Feedback Session de Test - Staging

**Date:** _____
**Testeur:** _____
**Durée:** _____

### Fonctionnalités testées
- [ ] Authentification
- [ ] Gestion propriétés
- [ ] Tableau de bord
- [ ] Multi-utilisateurs
- [ ] Autre: _____

### Bugs rencontrés
1. _____________________________
2. _____________________________
3. _____________________________

### Difficultés d'utilisation
1. _____________________________
2. _____________________________

### Points positifs
1. _____________________________
2. _____________________________

### Suggestions d'amélioration
1. _____________________________
2. _____________________________

### Note globale (1-5)
UX: ⭐⭐⭐⭐⭐
Performance: ⭐⭐⭐⭐⭐
Facilité: ⭐⭐⭐⭐⭐
```

### Durée recommandée en Staging
**2-4 semaines** de tests utilisateurs intensifs

### Critères de sortie de Staging

Avant de passer en production, vérifier:

- [ ] Au moins 5 utilisateurs ont testé toutes les fonctionnalités
- [ ] Aucun bug critique ou bloquant
- [ ] Score de satisfaction utilisateur > 4/5
- [ ] Temps de réponse moyen < 2 secondes
- [ ] Taux de réussite des tâches > 90%
- [ ] Toutes les fonctionnalités principales validées
- [ ] Documentation utilisateur complète
- [ ] Formation des utilisateurs effectuée

---

## 🚀 3. Tests en Production (PROD)

### Quand?
✅ **Après validation complète Staging** - Application finale live

### Qui peut tester?
- Tous les utilisateurs finaux
- Support technique en surveillance

### Déploiement Production

**⚠️ ATTENTION:** Le déploiement production doit être fait avec précaution!

```bash
# 1. Créer un tag de release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 2. Build et push production
docker build -f Dockerfile.backend -t registry/solia-api:v1.0.0 .
docker push registry/solia-api:v1.0.0

# 3. Backup production avant déploiement
kubectl exec -n solia-production mongo-pod -- mongodump --out=/backup

# 4. Déployer
kubectl apply -f k8s/production/

# 5. Vérifier progressivement
kubectl get pods -n solia-production -w
```

### Tests de fumée (Smoke Tests) après déploiement

Immédiatement après déploiement, vérifier:

```bash
# 1. Health check
curl https://app.soliainvest.com/api/health

# 2. Test de connexion
curl -X POST https://app.soliainvest.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 3. Test d'une API critique
curl https://app.soliainvest.com/api/properties/list

# 4. Vérifier les logs
kubectl logs -n solia-production -l app=backend --tail=50
```

### Checklist post-déploiement production

Dans les **30 premières minutes:**
- [ ] Health check répond OK
- [ ] Page d'accueil charge correctement
- [ ] Login fonctionne
- [ ] Au moins 1 transaction complète réussie
- [ ] Aucune erreur 5xx dans les logs
- [ ] Métriques normales (CPU, RAM, latence)

Dans les **24 premières heures:**
- [ ] Monitoring actif 24/7
- [ ] Équipe support disponible
- [ ] Backup automatique vérifié
- [ ] Tests de charge OK
- [ ] Retours utilisateurs positifs

### Monitoring continu en Production

```bash
# Logs en temps réel
kubectl logs -n solia-production -l app=backend -f --tail=100

# Métriques
kubectl top pods -n solia-production

# Alertes configurées pour:
# - Erreurs 5xx > 1%
# - Temps de réponse > 3s
# - Taux d'erreur > 5%
# - CPU > 80%
# - Mémoire > 90%
```

### Plan de rollback

En cas de problème critique en production:

```bash
# Rollback immédiat à la version précédente
kubectl rollout undo deployment/backend-production -n solia-production

# Vérifier le rollback
kubectl rollout status deployment/backend-production -n solia-production

# Restaurer la base de données si nécessaire
kubectl exec -n solia-production mongo-pod -- mongorestore /backup
```

---

## 📊 Résumé: Quand faire vos tests?

| Environnement | Quand commencer? | Durée | Qui teste? | Objectif |
|---------------|------------------|-------|------------|----------|
| **DEV** | Dès aujourd'hui | 1-2 semaines | Devs uniquement | Tests techniques |
| **STAGING** | Après DEV validé | 2-4 semaines | **Utilisateurs pilotes** | Tests UAT |
| **PRODUCTION** | Après Staging validé | En continu | Tous les utilisateurs | Live |

---

## 🎯 Votre plan d'action immédiat

### Semaine 1-2: Développement
```bash
# Action: Démarrer l'environnement DEV
cd scisoliainvest
docker-compose -f docker_compose.dev.yml up -d
```
**Résultat:** Application accessible à http://localhost:5173

### Semaine 3-4: Tests utilisateurs Staging
```bash
# Action: Déployer Staging
docker-compose -f docker-compose.staging.yml up -d
```
**Résultat:** Inviter 5-10 utilisateurs pilotes pour tester

### Semaine 5+: Production
```bash
# Action: Déployer Production
kubectl apply -f k8s/production/
```
**Résultat:** Application live pour tous les utilisateurs

---

## 📞 Support

**Questions sur les tests?**
- Dev: Slack #dev-support
- Staging: Slack #staging-tests
- Production: Slack #production-alerts

**Problèmes techniques:**
- Consulter [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- Consulter [k8s/staging/README.md](./k8s/staging/README.md)
- Ouvrir une issue GitHub

---

## ✅ Checklist finale avant chaque environnement

### Avant DEV
- [ ] Docker Desktop installé
- [ ] Repository cloné
- [ ] `.env` configuré

### Avant STAGING
- [ ] Tous les tests DEV passent
- [ ] Serveur staging disponible
- [ ] Utilisateurs pilotes identifiés
- [ ] Formulaire de feedback préparé

### Avant PRODUCTION
- [ ] Tests Staging validés (>90% succès)
- [ ] Aucun bug critique
- [ ] Backup configuré
- [ ] Monitoring actif
- [ ] Équipe support prête
- [ ] Plan de rollback testé
