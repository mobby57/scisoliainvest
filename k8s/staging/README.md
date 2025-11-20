# Kubernetes Staging Environment

Ce dossier contient les manifests Kubernetes pour l'environnement **staging** de SCI Solia Invest.

## 📋 Prérequis

- Cluster Kubernetes (EKS, GKE, AKS, ou on-premise)
- kubectl configuré
- Ingress controller NGINX installé
- cert-manager installé (pour les certificats SSL)

## 🏗️ Architecture Staging

```
┌─────────────────────────────────────────────────────────┐
│                 Namespace: solia-staging                 │
├──────────────┬──────────────┬────────────────────────────┤
│   MongoDB    │   Backend    │   Frontend                │
│   Staging    │   (2 pods)   │   (2 pods)                │
│   PVC 10Gi   │   Port: 5000 │   Port: 80                │
└──────────────┴──────────────┴────────────────────────────┘
                       ↑
                 Ingress NGINX
            (staging.soliainvest.com)
```

## 📦 Ressources

- `secrets.yaml`: Secrets pour MongoDB, JWT, Azure, Email, AWS
- `mongo-deployment.yaml`: MongoDB avec PersistentVolume
- `backend-deployment.yaml`: Backend API (2 réplicas)
- `frontend-deployment.yaml`: Frontend React (2 réplicas)
- `ingress.yaml`: Routage HTTPS avec certificat SSL

## 🚀 Déploiement

### 1. Créer le namespace

```bash
kubectl apply -f k8s/staging/mongo-deployment.yaml  # Contient la définition du namespace
```

### 2. Configurer les secrets

**Important**: Modifier `secrets.yaml` avec vos vraies valeurs avant de déployer!

```bash
# Éditer les secrets
vim k8s/staging/secrets.yaml

# Pour encoder vos valeurs en base64:
echo -n "votre_secret" | base64

# Appliquer les secrets
kubectl apply -f k8s/staging/secrets.yaml
```

### 3. Déployer MongoDB

```bash
kubectl apply -f k8s/staging/mongo-deployment.yaml
```

Vérifier que MongoDB est prêt:
```bash
kubectl get pods -n solia-staging -l app=mongo
kubectl logs -n solia-staging -l app=mongo
```

### 4. Build et push des images Docker

**Important**: Créer des images avec le tag `staging`

```bash
# Backend
docker build -f Dockerfile.backend -t moros/solia-api:staging .
docker push moros/solia-api:staging

# Frontend
docker build -f Dockerfile.frontend -t moros/solia-client:staging .
docker push moros/solia-client:staging
```

### 5. Déployer le Backend

```bash
kubectl apply -f k8s/staging/backend-deployment.yaml
```

Vérifier:
```bash
kubectl get pods -n solia-staging -l app=backend
kubectl logs -n solia-staging -l app=backend
```

### 6. Déployer le Frontend

```bash
kubectl apply -f k8s/staging/frontend-deployment.yaml
```

### 7. Configurer l'Ingress

```bash
kubectl apply -f k8s/staging/ingress.yaml
```

### 8. Configurer le DNS

Ajouter un enregistrement DNS pointant vers votre Ingress:

```
staging.soliainvest.com -> [IP de votre Ingress Controller]
```

Pour obtenir l'IP:
```bash
kubectl get ingress -n solia-staging
```

## 🔍 Vérification

### Vérifier tous les pods

```bash
kubectl get all -n solia-staging
```

### Vérifier les logs

```bash
# Backend
kubectl logs -n solia-staging -l app=backend -f

# Frontend
kubectl logs -n solia-staging -l app=frontend -f

# MongoDB
kubectl logs -n solia-staging -l app=mongo -f
```

### Tester les endpoints

```bash
# Health check backend
curl https://staging.soliainvest.com/api/health

# Frontend
curl https://staging.soliainvest.com/
```

## 📊 Monitoring

### Ressources utilisées

```bash
kubectl top pods -n solia-staging
kubectl top nodes
```

### État des services

```bash
kubectl get pods -n solia-staging -w
kubectl describe pod <pod-name> -n solia-staging
```

## 🔄 Mise à jour

### Mettre à jour le backend

```bash
# Build nouvelle version
docker build -f Dockerfile.backend -t moros/solia-api:staging .
docker push moros/solia-api:staging

# Forcer le redéploiement
kubectl rollout restart deployment/backend-staging -n solia-staging
kubectl rollout status deployment/backend-staging -n solia-staging
```

### Mettre à jour le frontend

```bash
# Build nouvelle version
docker build -f Dockerfile.frontend -t moros/solia-client:staging .
docker push moros/solia-client:staging

# Forcer le redéploiement
kubectl rollout restart deployment/frontend-staging -n solia-staging
kubectl rollout status deployment/frontend-staging -n solia-staging
```

## 🗑️ Nettoyage

### Supprimer tout l'environnement staging

```bash
kubectl delete namespace solia-staging
```

### Supprimer seulement certaines ressources

```bash
kubectl delete -f k8s/staging/ingress.yaml
kubectl delete -f k8s/staging/frontend-deployment.yaml
kubectl delete -f k8s/staging/backend-deployment.yaml
# Attention: ceci supprime les données!
kubectl delete -f k8s/staging/mongo-deployment.yaml
```

## 🔐 Sécurité

### Bonnes pratiques

1. **Secrets**: Ne jamais commiter les vraies valeurs dans Git
2. **RBAC**: Configurer des permissions appropriées
3. **Network Policies**: Restreindre les communications entre pods
4. **SSL/TLS**: Toujours utiliser HTTPS en staging
5. **Backup**: Sauvegarder régulièrement MongoDB

### Gérer les secrets de manière sécurisée

Option 1: Utiliser kubectl directement
```bash
kubectl create secret generic solia-staging-secrets \
  --from-literal=mongo-username=solia_staging \
  --from-literal=mongo-password=VOTRE_PASSWORD \
  --from-literal=jwt-secret=VOTRE_JWT_SECRET \
  -n solia-staging
```

Option 2: Utiliser un gestionnaire de secrets (recommandé pour production)
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Sealed Secrets

## 📝 Notes

- L'environnement staging utilise **2 réplicas** pour chaque service (backend/frontend)
- Base de données MongoDB avec **10Gi** de stockage persistant
- Logs en mode **debug** pour faciliter le débogage
- Certificats SSL via **Let's Encrypt** (staging)
- Monitoring et health checks configurés sur tous les pods

## 🆘 Dépannage

### Pod en CrashLoopBackOff

```bash
kubectl describe pod <pod-name> -n solia-staging
kubectl logs <pod-name> -n solia-staging --previous
```

### Problèmes de connexion MongoDB

```bash
# Se connecter au pod MongoDB
kubectl exec -it <mongo-pod-name> -n solia-staging -- mongosh

# Vérifier la connectivité depuis le backend
kubectl exec -it <backend-pod-name> -n solia-staging -- sh
nc -zv mongo-staging-service 27017
```

### Problèmes d'Ingress

```bash
kubectl describe ingress solia-staging-ingress -n solia-staging
kubectl logs -n ingress-nginx -l app.kubernetes.io/component=controller
```

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs: `kubectl logs`
2. Vérifier les événements: `kubectl get events -n solia-staging`
3. Consulter la documentation Kubernetes
