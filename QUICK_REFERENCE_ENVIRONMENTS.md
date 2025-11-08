# Aide-mémoire: Environnements Dev → Staging → Production

## 🎯 Réponse rapide à: "À quel moment faire des essais utilisateurs?"

### ✅ MAINTENANT - Environnement Development (DEV)
**Pour:** Tests techniques par les développeurs
```bash
docker-compose -f docker_compose.dev.yml up -d
# Accès: http://localhost:5173
```

### ✅ SEMAINE 3-4 - Environnement Staging (STAGING)  
**Pour:** Tests utilisateurs réels avant production
```bash
docker-compose -f docker-compose.staging.yml up -d
# Accès: http://votre-serveur:5174
```

### ✅ SEMAINE 5+ - Environnement Production (PROD)
**Pour:** Application finale pour tous les utilisateurs
```bash
kubectl apply -f k8s/production/
# Accès: https://app.soliainvest.com
```

---

## 📊 Tableau comparatif

| Critère | Development | Staging | Production |
|---------|-------------|---------|------------|
| **Démarrage** | Immédiat | Après DEV validé | Après Staging validé |
| **URL** | localhost:5173 | staging.soliainvest.com | app.soliainvest.com |
| **Base de données** | Locale (Docker) | Dédiée staging | Production managée |
| **Utilisateurs** | Développeurs | Testeurs + Pilotes | Tous les utilisateurs |
| **Données** | Fictives | Test réalistes | Réelles |
| **Stabilité** | Variable | Stable | Très stable |
| **But** | Dev + Debug | Tests UAT | Live |
| **Durée tests** | 1-2 semaines | 2-4 semaines | En continu |
| **Ports** | 5000, 5173, 27017 | 5001, 5174, 27018 | 80, 443 |

---

## 🚀 Commandes rapides

### Development
```bash
# Démarrer
docker-compose -f docker_compose.dev.yml up -d

# Arrêter
docker-compose -f docker_compose.dev.yml down

# Logs
docker-compose -f docker_compose.dev.yml logs -f
```

### Staging
```bash
# Démarrer
docker-compose -f docker-compose.staging.yml up -d

# Logs
docker-compose -f docker-compose.staging.yml logs -f backend-staging

# Créer utilisateurs test
docker-compose -f docker-compose.staging.yml exec backend-staging npm run create-test-users
```

### Production (Kubernetes)
```bash
# Déployer
kubectl apply -f k8s/production/

# Status
kubectl get pods -n solia-production

# Logs
kubectl logs -n solia-production -l app=backend -f

# Rollback d'urgence
kubectl rollout undo deployment/backend-production -n solia-production
```

---

## ✅ Checklist: Quand passer à l'environnement suivant?

### DEV → STAGING
- [ ] Tests unitaires passent
- [ ] Code review approuvé
- [ ] Build CI/CD réussi
- [ ] Fonctionnalités complètes

### STAGING → PRODUCTION
- [ ] Tests utilisateurs OK (>90% succès)
- [ ] Aucun bug critique
- [ ] Performance validée (<2s)
- [ ] Sécurité vérifiée
- [ ] Documentation à jour
- [ ] Monitoring configuré
- [ ] Backup automatique actif

---

## 📁 Fichiers de configuration par environnement

### Development
- `docker_compose.dev.yml`
- `packages/api/.env.local`
- `frontend/.env.local`

### Staging
- `docker-compose.staging.yml` ⭐ NOUVEAU
- `packages/api/.env.staging` ⭐ NOUVEAU
- `frontend/.env.staging` ⭐ NOUVEAU
- `k8s/staging/` ⭐ NOUVEAU

### Production
- `docker_compose.prod.yml`
- `packages/api/.env.production`
- `k8s/production/` (à créer basé sur staging)

---

## 🎯 Plan d'action immédiat

1. **Aujourd'hui** → Démarrer DEV
   ```bash
   git clone https://github.com/mobby57/scisoliainvest.git
   cd scisoliainvest
   docker-compose -f docker_compose.dev.yml up -d
   ```

2. **Semaine 3** → Déployer STAGING pour tests utilisateurs
   ```bash
   # Sur serveur staging
   docker-compose -f docker-compose.staging.yml up -d
   ```

3. **Semaine 5** → Déployer PRODUCTION
   ```bash
   kubectl apply -f k8s/production/
   ```

---

## 📞 Besoin d'aide?

- **Guide complet:** Voir [USER_TESTING_GUIDE.md](./USER_TESTING_GUIDE.md)
- **Déploiement:** Voir [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Kubernetes:** Voir [k8s/staging/README.md](./k8s/staging/README.md)
- **Docker:** Voir [README-DOCKER.md](./README-DOCKER.md)
