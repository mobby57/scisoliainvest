# Guide de Démarrage Rapide - Tests Utilisateurs

## 🎯 Objectif

Ce guide vous explique **comment lancer rapidement l'environnement de staging** pour effectuer des tests utilisateurs.

## ⚡ Démarrage Rapide (Recommandé)

### Windows (PowerShell)

```powershell
# Démarrer l'environnement de staging
.\start-env.ps1 -Environment staging -Command start

# Accéder à l'application
# Frontend: http://localhost:5174
# Backend API: http://localhost:5001
```

### Linux / macOS (Bash)

```bash
# Démarrer l'environnement de staging
./start-env.sh staging start

# Accéder à l'application
# Frontend: http://localhost:5174
# Backend API: http://localhost:5001
```

## 🔧 Méthode Alternative (Docker Compose Direct)

Si les scripts ne fonctionnent pas, utilisez Docker Compose directement:

```bash
# Démarrer
docker-compose -f docker-compose.staging.yml up -d

# Voir les logs
docker-compose -f docker-compose.staging.yml logs -f

# Arrêter
docker-compose -f docker-compose.staging.yml down
```

## 🌐 Accès aux Services

Une fois démarré, vous pouvez accéder à:

- **Application Frontend**: http://localhost:5174
- **API Backend**: http://localhost:5001
- **Health Check**: http://localhost:5001/api/health
- **MongoDB**: localhost:27018

## 📋 Commandes Utiles

### Voir le statut

**Windows:**
```powershell
.\start-env.ps1 -Environment staging -Command status
```

**Linux/Mac:**
```bash
./start-env.sh staging status
```

### Voir les logs

**Windows:**
```powershell
.\start-env.ps1 -Environment staging -Command logs
```

**Linux/Mac:**
```bash
./start-env.sh staging logs
```

### Arrêter l'environnement

**Windows:**
```powershell
.\start-env.ps1 -Environment staging -Command stop
```

**Linux/Mac:**
```bash
./start-env.sh staging stop
```

### Redémarrer

**Windows:**
```powershell
.\start-env.ps1 -Environment staging -Command restart
```

**Linux/Mac:**
```bash
./start-env.sh staging restart
```

## 🐛 Résolution de Problèmes

### Problème: "Port déjà utilisé"

**Solution**: Vérifiez qu'aucun autre service n'utilise les ports 5001, 5174, ou 27018

**Windows:**
```powershell
# Vérifier les ports
netstat -ano | findstr :5001
netstat -ano | findstr :5174

# Arrêter l'ancien environnement
.\start-env.ps1 -Environment staging -Command stop
```

**Linux/Mac:**
```bash
# Vérifier les ports
lsof -i :5001
lsof -i :5174

# Arrêter l'ancien environnement
./start-env.sh staging stop
```

### Problème: "Docker non démarré"

**Solution**: Assurez-vous que Docker Desktop est en cours d'exécution

- Sous Windows/Mac: Lancez Docker Desktop
- Sous Linux: `sudo systemctl start docker`

### Problème: "Erreur de connexion à la base de données"

**Solution**: Réinitialisez complètement l'environnement

```bash
# Nettoyer complètement
docker-compose -f docker-compose.staging.yml down -v

# Redémarrer
docker-compose -f docker-compose.staging.yml up -d
```

### Problème: "L'application ne répond pas"

**Solution**: Vérifiez les logs et attendez quelques secondes

```bash
# Voir les logs
docker-compose -f docker-compose.staging.yml logs -f backend-staging

# Attendre 30 secondes que les services démarrent complètement
```

## 📊 Différences entre les Environnements

| Aspect | Développement | **Staging** | Production |
|--------|---------------|-------------|------------|
| **Port Frontend** | 5173 | **5174** | 80/443 |
| **Port Backend** | 5000 | **5001** | 80/443 |
| **Port MongoDB** | 27017 | **27018** | Cloud |
| **Usage** | Dev quotidien | **Tests utilisateurs** | Production |
| **Données** | Fictives | **Réalistes** | Réelles |

## ✅ Checklist de Validation

Avant de commencer vos tests utilisateurs, vérifiez:

- [ ] Docker Desktop est démarré
- [ ] L'environnement staging est lancé (`./start-env.sh staging start`)
- [ ] Le frontend est accessible: http://localhost:5174
- [ ] Le backend répond: http://localhost:5001/api/health
- [ ] Les logs ne montrent pas d'erreurs critiques

## 🎓 Prochaines Étapes

1. **Lancez l'environnement staging** avec les commandes ci-dessus
2. **Accédez à l'application** via http://localhost:5174
3. **Effectuez vos tests utilisateurs**
4. **Rapportez les bugs** et suggestions
5. **Arrêtez l'environnement** quand vous avez terminé

## 📞 Besoin d'Aide ?

- Consultez le [Guide Complet des Environnements](ENVIRONMENT_GUIDE.md)
- Consultez le [Guide Docker](README-DOCKER.md)
- Créez une issue sur GitHub

---

**Note**: Ce guide est spécifiquement pour les **tests utilisateurs en staging**. 
Pour le développement quotidien, utilisez l'environnement **dev** à la place.
