# Guide de Démarrage - Tests Utilisateurs en 5 Minutes ⚡

## 🎯 Objectif

Lancer l'environnement de staging pour faire des tests utilisateurs **en moins de 5 minutes**.

## ✅ Prérequis

- [ ] Docker Desktop installé et démarré
- [ ] Repository cloné localement
- [ ] Terminal ouvert (PowerShell pour Windows, Terminal pour Mac/Linux)

## 🚀 Étapes Rapides

### Étape 1: Configuration Initiale (1 minute - une seule fois)

**Windows (PowerShell)**:
```powershell
cd chemin\vers\scisoliainvest
.\setup-env.ps1
```

**Linux/Mac (Terminal)**:
```bash
cd /chemin/vers/scisoliainvest
./setup-env.sh
```

Cette commande va créer les fichiers de configuration nécessaires.

### Étape 2: Configurer les Mots de Passe (2 minutes - une seule fois)

Ouvrez le fichier `.env.staging` créé et remplacez les valeurs par défaut:

```bash
# Exemple de valeurs à configurer
MONGO_STAGING_USER=staging_admin
MONGO_STAGING_PASSWORD=MonMotDePasseSecurise2024!
MONGO_STAGING_DB=solia-staging
STAGING_JWT_SECRET=UnSecretTresLongEtComplexeDeMinimum64Caracteres123456789
STAGING_JWT_REFRESH_SECRET=UnAutreSecretDifferentEtTresLongPourLeRefresh987654321
```

💡 **Astuce**: Générez des secrets sécurisés avec:
```bash
openssl rand -base64 64
```

### Étape 3: Démarrer l'Environnement Staging (1 minute)

**Windows (PowerShell)**:
```powershell
.\start-env.ps1 -Environment staging -Command start
```

**Linux/Mac (Terminal)**:
```bash
./start-env.sh staging start
```

Attendez environ 30-60 secondes que les services démarrent.

### Étape 4: Accéder à l'Application (30 secondes)

Ouvrez votre navigateur et allez sur:

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:5001/api/health

## ✅ Vérification

Pour vérifier que tout fonctionne:

**Windows**:
```powershell
.\start-env.ps1 -Environment staging -Command status
```

**Linux/Mac**:
```bash
./start-env.sh staging status
```

Vous devriez voir tous les services avec le statut "healthy" ou "running".

## 🎉 C'est Tout!

Vous pouvez maintenant:
- ✅ Tester les fonctionnalités de l'application
- ✅ Faire des tests utilisateurs
- ✅ Valider les nouvelles fonctionnalités
- ✅ Rapporter les bugs

## 📋 Commandes Utiles

### Voir les Logs

**Windows**:
```powershell
.\start-env.ps1 -Environment staging -Command logs
```

**Linux/Mac**:
```bash
./start-env.sh staging logs
```

### Arrêter l'Environnement

**Windows**:
```powershell
.\start-env.ps1 -Environment staging -Command stop
```

**Linux/Mac**:
```bash
./start-env.sh staging stop
```

### Redémarrer

**Windows**:
```powershell
.\start-env.ps1 -Environment staging -Command restart
```

**Linux/Mac**:
```bash
./start-env.sh staging restart
```

## 🔄 Workflow Quotidien

Une fois configuré, pour les utilisations suivantes:

1. **Démarrer**: `./start-env.sh staging start` (ou `.ps1` pour Windows)
2. **Tester**: Ouvrez http://localhost:5174
3. **Arrêter**: `./start-env.sh staging stop`

C'est aussi simple que ça! 🎉

## 🆘 Problèmes Courants

### "Port already in use"
**Solution**: Arrêtez l'environnement dev si il tourne
```bash
./start-env.sh dev stop
```

### "Docker is not running"
**Solution**: Lancez Docker Desktop

### "Cannot connect to database"
**Solution**: Vérifiez que vous avez bien configuré le fichier `.env.staging`

### "Permission denied"
**Linux/Mac**: Rendez les scripts exécutables
```bash
chmod +x start-env.sh setup-env.sh
```

## 📚 Pour Aller Plus Loin

- [Guide Complet des Environnements](ENVIRONMENT_GUIDE.md)
- [Guide Rapide Staging](QUICK_START_STAGING.md)
- [Quand Faire des Essais](QUAND_FAIRE_ESSAIS.md)

## 💡 Astuces

1. **Dev et Staging ensemble**: Vous pouvez lancer dev (port 5173) et staging (port 5174) en même temps
2. **Logs en temps réel**: Utilisez la commande `logs` pour voir ce qui se passe
3. **Clean start**: Si quelque chose ne fonctionne pas, utilisez `./start-env.sh staging clean` puis `start`

---

**Temps total**: 5 minutes la première fois, 30 secondes les fois suivantes

**Questions?** Consultez la documentation complète ou créez une issue sur GitHub.
