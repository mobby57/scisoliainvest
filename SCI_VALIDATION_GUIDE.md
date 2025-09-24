# Guide de Validation des Routes SCI

## Prérequis

1. **Démarrer le serveur de test :**
   ```bash
   cd packages/api
   node sci-test-server.cjs
   ```

2. **Importer la collection Postman :**
   - Ouvrir Postman
   - Importer le fichier `SCI_Routes_Validation.postman_collection.json`

## Tests à Effectuer

### 1. Authentification

#### Test 1.1 : Login Admin
- **Endpoint :** `POST /api/auth/login`
- **Body :**
  ```json
  {
    "email": "admin@solia.com",
    "password": "password"
  }
  ```
- **Résultat attendu :** Status 200, token JWT retourné

#### Test 1.2 : Health Check
- **Endpoint :** `GET /api/health`
- **Résultat attendu :** Status 200, `{"status": "OK"}`

### 2. Gestion des SCI

#### Test 2.1 : Créer une SCI
- **Endpoint :** `POST /api/sci`
- **Headers :** `Authorization: Bearer {token}`
- **Body :**
  ```json
  {
    "name": "SCI Test Immobilier",
    "siren": "123456789",
    "capitalCents": 100000
  }
  ```
- **Résultat attendu :** Status 201, SCI créée avec ID

#### Test 2.2 : Lister toutes les SCI
- **Endpoint :** `GET /api/sci`
- **Headers :** `Authorization: Bearer {token}`
- **Résultat attendu :** Status 200, tableau des SCI

#### Test 2.3 : Récupérer une SCI par ID
- **Endpoint :** `GET /api/sci/{id}`
- **Headers :** `Authorization: Bearer {token}`
- **Résultat attendu :** Status 200, détails de la SCI

#### Test 2.4 : Mettre à jour une SCI
- **Endpoint :** `PUT /api/sci/{id}`
- **Headers :** `Authorization: Bearer {token}`
- **Body :**
  ```json
  {
    "name": "SCI Test Immobilier Updated",
    "capitalCents": 150000
  }
  ```
- **Résultat attendu :** Status 200, SCI mise à jour

#### Test 2.5 : Supprimer une SCI
- **Endpoint :** `DELETE /api/sci/{id}`
- **Headers :** `Authorization: Bearer {token}`
- **Résultat attendu :** Status 200, message de confirmation

### 3. Gestion des Erreurs

#### Test 3.1 : Créer SCI sans nom
- **Endpoint :** `POST /api/sci`
- **Body :**
  ```json
  {
    "siren": "123456789",
    "capitalCents": 100000
  }
  ```
- **Résultat attendu :** Status 400, erreur de validation

#### Test 3.2 : Accès non autorisé
- **Endpoint :** `GET /api/sci`
- **Headers :** Aucun token
- **Résultat attendu :** Status 401, erreur d'authentification

#### Test 3.3 : SCI inexistante
- **Endpoint :** `GET /api/sci/999999`
- **Headers :** `Authorization: Bearer {token}`
- **Résultat attendu :** Status 404, SCI non trouvée

## Validation Automatique

### Avec Newman (CLI)
```bash
# Installer Newman si nécessaire
npm install -g newman

# Exécuter les tests
newman run SCI_Routes_Validation.postman_collection.json
```

### Avec PowerShell
```powershell
# Exécuter le script de test automatique
.\run-sci-tests.ps1
```

## Critères de Validation

✅ **Tous les tests doivent passer**
✅ **Les codes de statut HTTP doivent être corrects**
✅ **Les réponses JSON doivent avoir la structure attendue**
✅ **L'authentification doit être requise pour les endpoints protégés**
✅ **Les permissions admin doivent être vérifiées pour les opérations sensibles**
✅ **La gestion d'erreurs doit être appropriée**

## Résultats Attendus

- **Authentification :** 2/2 tests passés
- **Gestion SCI :** 5/5 tests passés  
- **Gestion erreurs :** 3/3 tests passés
- **Total :** 10/10 tests passés

## Troubleshooting

### Erreur de connexion
- Vérifier que le serveur de test est démarré sur le port 3001
- Vérifier l'URL de base dans Postman : `http://localhost:3001`

### Erreur d'authentification
- Vérifier que le token JWT est correctement récupéré lors du login
- Vérifier que le token est inclus dans l'header Authorization

### Erreur de permissions
- Vérifier que l'utilisateur a le rôle 'admin' pour les opérations sensibles
- Utiliser les credentials de test : admin@solia.com / password