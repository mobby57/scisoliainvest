# Collection Postman et Script de Démonstration SCI Solia Invest

Ce dossier contient une collection Postman et un script Python pour démontrer les fonctionnalités principales de l'API SCI Solia Invest.

## 📦 Contenu

### 1. Collection Postman (`SCI_Solia_Demo_Collection.postman_collection.json`)

Collection complète couvrant les endpoints suivants :

#### 🔑 Authentication
- **POST /auth/token** - Authentification et récupération du token JWT

#### 📁 CRUD Projets
- **POST /projects** - Créer un nouveau projet
- **GET /projects** - Récupérer tous les projets
- **GET /projects/:id** - Récupérer un projet spécifique
- **PUT /projects/:id** - Mettre à jour un projet

#### 🤖 Prédiction IA
- **POST /projects/:id/predict** - Lancer une prédiction IA sur un projet

#### 📡 IoT - Capteurs et Lectures
- **POST /iot/devices/:id/readings** - Enregistrer une lecture IoT
- **GET /iot/devices/:id/readings** - Récupérer les lectures IoT

### 2. Script Python (`../backend/scripts/pop_db_demo.py`)

Script automatisé qui :
1. S'authentifie et récupère un token
2. Crée 2 projets immobiliers
3. Dépose une lecture IoT sur un device pour chaque projet
4. Lance une prédiction IA pour un projet et affiche la réponse

## 🚀 Utilisation

### Import de la Collection Postman

1. Ouvrez Postman
2. Cliquez sur "Import"
3. Sélectionnez le fichier `SCI_Solia_Demo_Collection.postman_collection.json`
4. La collection sera importée avec toutes les requêtes pré-configurées

### Configuration de l'Environnement

La collection utilise les variables suivantes :
- `base_url` : URL de base de l'API (par défaut: http://localhost:3000)
- `auth_token` : Token d'authentification (automatiquement rempli après login)
- `project_id` : ID du projet (automatiquement rempli après création)
- `device_id` : ID du device IoT (à définir manuellement)

### Exécution du Script Python

#### Prérequis
```bash
pip install requests
```

#### Lancement
```bash
# Depuis le répertoire backend/scripts/
python3 pop_db_demo.py

# Ou depuis n'importe où
python3 /chemin/vers/backend/scripts/pop_db_demo.py
```

#### Configuration
Le script utilise par défaut :
- URL de base : `http://localhost:3000`
- Email : `admin@solia.com`
- Mot de passe : `password123`

Pour modifier ces paramètres, éditez les constantes en haut du fichier `pop_db_demo.py`.

## 📝 Notes

### Tests Automatiques

Chaque requête Postman inclut des tests automatiques qui vérifient :
- Le code de statut HTTP
- La présence des champs requis dans la réponse
- La sauvegarde automatique des IDs et tokens dans les variables

### Ordre d'Exécution Recommandé

1. **Authentication** → POST /auth/token
2. **CRUD Projets** → POST /projects (pour créer un projet)
3. **CRUD Projets** → GET /projects (pour lister les projets)
4. **CRUD Projets** → GET /projects/:id (pour voir un projet spécifique)
5. **CRUD Projets** → PUT /projects/:id (pour modifier un projet)
6. **Prédiction IA** → POST /projects/:id/predict
7. **IoT** → POST /iot/devices/:id/readings (définir device_id d'abord)
8. **IoT** → GET /iot/devices/:id/readings

### Script Python - Sortie Attendue

Le script affiche une sortie colorée avec :
- ✓ Succès en vert
- ✗ Erreurs en rouge
- ℹ Informations en cyan
- En-têtes en violet

Exemple de sortie :
```
╔════════════════════════════════════════════════════════════╗
║   Script de Peuplement BD - SCI Solia Invest Demo         ║
╚════════════════════════════════════════════════════════════╝

============================================================
ÉTAPE 1: Authentification
============================================================

✓ Authentification réussie
ℹ Token: eyJhbGciOiJIUzI1NiI...

[...]

✨ Base de données de démonstration peuplée !
```

## 🐛 Dépannage

### Le serveur ne répond pas
Vérifiez que le backend est démarré :
```bash
cd backend
node server.js
```

### Erreur d'authentification
Vérifiez que les credentials dans le script ou la collection Postman correspondent aux utilisateurs existants dans votre base de données.

### Erreur de connexion Python
Assurez-vous que le module `requests` est installé :
```bash
pip install requests
```

## 📚 Ressources Supplémentaires

- [Documentation Postman](https://learning.postman.com/)
- [Documentation API REST](../BACKEND_STATUS.md)
- [Guide de développement](../GUIDE_DEVELOPPEMENT_SCI_SOLIA.md)
