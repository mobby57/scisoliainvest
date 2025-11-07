# À Quel Moment Puis-je Faire des Essais ? 🧪

## Réponse Rapide

Vous pouvez maintenant faire des essais à **trois moments différents** selon vos besoins:

### 1. 🔧 Mode Développement (Immédiatement)
**Pour**: Développeurs, tests techniques

```bash
# Démarrer
./start-env.sh dev start

# Accès
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

### 2. 🧪 Mode Staging (Avant Production) ⭐ RECOMMANDÉ POUR TESTS UTILISATEURS
**Pour**: Tests utilisateurs, validation fonctionnelle, UAT

```bash
# Démarrer
./start-env.sh staging start

# Accès
Frontend: http://localhost:5174
Backend: http://localhost:5001
```

### 3. 🚀 Mode Production (Après Validation)
**Pour**: Utilisation réelle par les clients

```bash
# Démarrer (avec confirmation)
./start-env.sh prod start

# Accès
Domaine de production configuré
```

## 📅 Calendrier des Phases de Tests

### Phase 1: Développement (En cours)
- ✅ **Disponible maintenant**
- 👨‍💻 **Qui**: Équipe de développement
- 🎯 **But**: Développer et tester le code
- 🔧 **Comment**: `./start-env.sh dev start`

### Phase 2: Staging - Tests Utilisateurs (Disponible maintenant)
- ✅ **Disponible maintenant**
- 👥 **Qui**: Utilisateurs finaux, testeurs, équipe QA
- 🎯 **But**: Valider les fonctionnalités, tests d'acceptation
- 🧪 **Comment**: `./start-env.sh staging start`
- 📖 **Guide**: [QUICK_START_STAGING.md](QUICK_START_STAGING.md)

### Phase 3: Production (Après validation Staging)
- ⏳ **Disponible après validation en staging**
- 🌍 **Qui**: Tous les clients
- 🎯 **But**: Utilisation réelle
- 🚀 **Comment**: Déploiement contrôlé

## 🎯 Pour Répondre à Votre Question

### "À quel moment je vais pouvoir faire des essais utilisateurs ?"

**Réponse**: **DÈS MAINTENANT** en mode Staging !

### Instructions Rapides:

1. **Ouvrez un terminal** (PowerShell sous Windows, Terminal sous Mac/Linux)

2. **Naviguez vers le projet**:
   ```bash
   cd /chemin/vers/scisoliainvest
   ```

3. **Démarrez l'environnement Staging**:
   
   **Windows (PowerShell)**:
   ```powershell
   .\start-env.ps1 -Environment staging -Command start
   ```
   
   **Mac/Linux**:
   ```bash
   ./start-env.sh staging start
   ```

4. **Attendez 30 secondes** que les services démarrent

5. **Ouvrez votre navigateur** et allez sur:
   - http://localhost:5174 (Frontend)
   - http://localhost:5001/api/health (Vérification Backend)

6. **Commencez vos tests utilisateurs** ! 🎉

## 🔄 Workflow Complet

```
┌─────────────────────────────────────────────────────────────┐
│                    Cycle de Développement                    │
└─────────────────────────────────────────────────────────────┘

1. DÉVELOPPEMENT
   ↓
   - Développeur code une nouvelle fonctionnalité
   - Tests locaux en mode DEV (localhost:5173)
   - Commit et Push du code
   
2. STAGING (Tests Utilisateurs) ⭐
   ↓
   - Déploiement automatique ou manuel vers staging
   - 👥 TESTS UTILISATEURS (localhost:5174)
   - Validation fonctionnelle
   - Détection et correction des bugs
   - ✅ Validation finale
   
3. PRODUCTION
   ↓
   - Déploiement vers production
   - Utilisation réelle par les clients
   - Monitoring et support
```

## 📊 Comparaison des Environnements

| Critère | Développement | **Staging** | Production |
|---------|---------------|-------------|------------|
| **Disponibilité** | ✅ Maintenant | ✅ **Maintenant** | Après validation |
| **Port Frontend** | 5173 | **5174** | 80/443 |
| **Port Backend** | 5000 | **5001** | 80/443 |
| **Tests Utilisateurs** | ❌ Non | ✅ **OUI** | ❌ Non |
| **Données** | Test | **Réalistes** | Réelles |
| **Performance** | Variable | **Optimisée** | Maximale |
| **Sécurité** | Minimale | **Intermédiaire** | Maximale |

## ✅ Checklist Avant de Commencer les Tests

- [ ] Docker Desktop installé et démarré
- [ ] Repository cloné localement
- [ ] Script `start-env.sh` ou `start-env.ps1` présent
- [ ] Environnement staging lancé avec succès
- [ ] Frontend accessible sur http://localhost:5174
- [ ] Backend répond sur http://localhost:5001/api/health

## 🎓 Guides et Documentation

Pour plus de détails, consultez:

- **[QUICK_START_STAGING.md](QUICK_START_STAGING.md)** - Guide rapide pour lancer le staging
- **[ENVIRONMENT_GUIDE.md](ENVIRONMENT_GUIDE.md)** - Guide complet des environnements
- **[README-DOCKER.md](README-DOCKER.md)** - Guide Docker détaillé
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guide des tests

## 🆘 Aide et Support

### Problèmes Courants

**"Docker ne démarre pas"**
- Vérifiez que Docker Desktop est installé et en cours d'exécution

**"Les ports sont déjà utilisés"**
- Arrêtez l'environnement dev si il tourne: `./start-env.sh dev stop`
- Les environnements utilisent des ports différents pour coexister

**"L'application ne répond pas"**
- Attendez 30-60 secondes que tous les services démarrent
- Vérifiez les logs: `./start-env.sh staging logs`

### Obtenir de l'Aide

1. Consultez les guides dans ce repository
2. Vérifiez les logs avec `./start-env.sh staging logs`
3. Créez une issue sur GitHub avec les détails de votre problème

## 🎉 Résumé

**Vous pouvez faire des tests utilisateurs DÈS MAINTENANT en mode Staging !**

**Commande Simple**:
```bash
# Windows
.\start-env.ps1 -Environment staging -Command start

# Mac/Linux
./start-env.sh staging start
```

**Puis ouvrez**: http://localhost:5174

**Bon tests ! 🚀**
