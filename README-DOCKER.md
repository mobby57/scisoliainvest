# Dockerisation de l'application MERN - SCI Solia Invest

Ce guide vous explique comment dockeriser et exécuter votre application MERN (MongoDB, Express, React, Node.js) avec Docker et Docker Compose.

## 📋 Prérequis

- Docker Desktop installé ([Télécharger ici](https://www.docker.com/products/docker-desktop))
- Docker Compose installé (inclus avec Docker Desktop)
- Node.js 18+ (pour le développement local si nécessaire)

## 🏗️ Architecture Docker

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network                             │
├─────────────────┬─────────────────┬───────────────────────────┤
│   MongoDB       │   Backend       │   Frontend               │
│   (mongo)       │   (backend)     │   (frontend)             │
│   Port: 27017   │   Port: 5000    │   Port: 5173             │
│   Volume:       │   Hot-reload    │   Hot-reload             │
│   mongo-data    │   enabled       │   enabled                │
└─────────────────┴─────────────────┴───────────────────────────┘
```

## 🚀 Démarrage rapide

### 1. Build et lancement en développement

```bash
# Build des images Docker
docker-compose -f docker-compose.dev.yml build

# Lancer tous les services en arrière-plan
docker-compose -f docker-compose.dev.yml up -d

# Lancer avec logs en temps réel
docker-compose -f docker-compose.dev.yml up
```

### 2. Vérification des services

Après le lancement, vos services seront disponibles à :

- **Frontend React** : http://localhost:5173
- **Backend Express** : http://localhost:5000
- **MongoDB** : localhost:27017
- **API Health Check** : http://localhost:5000/api/health

### 3. Commandes de gestion

```bash
# Arrêter tous les services
docker-compose -f docker-compose.dev.yml down

# Arrêter et supprimer les volumes
docker-compose -f docker-compose.dev.yml down -v

# Voir les logs
docker-compose -f docker-compose.dev.yml logs -f

# Voir les logs d'un service spécifique
docker-compose -f docker-compose.dev.yml logs -f backend

# Reconstruire sans cache
docker-compose -f docker-compose.dev.yml build --no-cache

# Redémarrer un service spécifique
docker-compose -f docker-compose.dev.yml restart backend
```

## 🔧 Configuration des services

### MongoDB
- **Image** : mongo:7.0
- **Port** : 27017
- **Volume** : mongo-data (persistant)
- **Database** : solia-dev

### Backend Express
- **Port** : 5000
- **Hot-reload** : Activé via nodemon
- **Variables d'environnement** :
  - `DATABASE_URL=mongodb://mongo:27017/solia-dev`
  - `JWT_SECRET=your_jwt_secret_change_in_production`
  - `NODE_ENV=development`

### Frontend React
- **Port** : 5173
- **Hot-reload** : Activé via Vite
- **Variables d'environnement** :
  - `VITE_API_URL=http://localhost:5000/api`

## 🗂️ Structure des volumes

```bash
# Données MongoDB persistantes
./mongo-data/
├── diagnostic.data/
├── journal/
├── _mdb_catalog.wt
├── ...
```

## 🐛 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
```bash
# Vérifier les ports utilisés
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :27017

# Changer les ports dans docker-compose.dev.yml si nécessaire
```

2. **Erreur de connexion MongoDB**
```bash
# Vérifier que MongoDB est bien démarré
docker-compose -f docker-compose.dev.yml logs mongo

# Réinitialiser les données MongoDB
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

3. **Build échoué**
```bash
# Nettoyer les images et rebuild
docker-compose -f docker-compose.dev.yml down -v
docker system prune -f
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Logs et debugging

```bash
# Voir l'état des conteneurs
docker-compose -f docker-compose.dev.yml ps

# Accéder à un conteneur en cours d'exécution
docker-compose -f docker-compose.dev.yml exec backend sh
docker-compose -f docker-compose.dev.yml exec frontend sh

# Voir les logs détaillés
docker-compose -f docker-compose.dev.yml logs --tail=100 -f
```

## 🧪 Tests

### Tests backend
```bash
# Lancer les tests dans le conteneur
docker-compose -f docker-compose.dev.yml exec backend npm test
```

### Tests frontend
```bash
# Lancer les tests dans le conteneur
docker-compose -f docker-compose.dev.yml exec frontend npm test
```

## 📊 Monitoring

### Utilisation des ressources
```bash
# Voir l'utilisation des ressources
docker stats

# Voir l'espace disque utilisé
docker system df
```

## 🔄 Mise à jour des images

```bash
# Mettre à jour les images de base
docker-compose -f docker-compose.dev.yml pull

# Rebuild avec les dernières versions
docker-compose -f docker-compose.dev.yml build --no-cache
```

## 📝 Notes importantes

- Les volumes sont persistants, vos données MongoDB seront conservées même après `docker-compose down`
- Le hot-reload est activé pour le backend et le frontend en mode développement
- Les logs sont accessibles via `docker-compose logs`
- Pour la production, utilisez `docker-compose.prod.yml`

## 🚀 Production

Pour la production, utilisez :
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Support

En cas de problème, vérifiez :
1. Que Docker Desktop est bien démarré
2. Que les ports 5000, 5173 et 27017 ne sont pas utilisés
3. Les logs avec `docker-compose logs`
