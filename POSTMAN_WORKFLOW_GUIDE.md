# 🚀 Solia SCI Invest - Postman Workflow Guide

## 📋 Fichiers Disponibles

1. **`Solia-SCI-Invest.postman_collection.json`** - Collection Postman complète
2. **`Solia-SCI-Invest-Postman-Runner.json`** - Configuration pour Postman Runner (workflow automatique)
3. **`SCI_Solia_Invest.postman_environment.json`** - Environnement existant (à utiliser)

## 🎯 Utilisation de la Collection

### 1. Importation dans Postman

1. Ouvrir Postman
2. Cliquer sur **Import** → **Upload Files**
3. Sélectionner `Solia-SCI-Invest.postman_collection.json`
4. Sélectionner `SCI_Solia_Invest.postman_environment.json` (environnement existant)

### 2. Configuration de l'Environnement

Dans l'onglet **Environments**, sélectionner `Solia-SCI-Invest` et vérifier les variables :

- `baseUrl`: `http://localhost:4000/api`
- `authToken`: (vide - sera rempli automatiquement)
- `sciId`: (vide - sera rempli automatiquement)
- `investorId`: `REPLACE_WITH_ACTUAL_USER_ID` (à remplacer manuellement)
- `propertyId`: (vide - sera rempli automatiquement)
- `transactionId`: (vide - sera rempli automatiquement)
- `kycProfileId`: (vide - sera rempli automatiquement)

### 3. Exécution Manuel des Requêtes

Exécuter les requêtes dans l'ordre :

1. **Auth - Register** → Crée un utilisateur de test
2. **Auth - Login** → Récupère le token JWT (`authToken`)
3. **SCI - Create** → Crée une SCI (`sciId`)
4. **Investor - Add** → Ajoute un investisseur (nécessite `investorId`)
5. **Property - Add** → Ajoute une propriété (`propertyId`)
6. **Transaction - Add** → Ajoute une transaction (`transactionId`)
7. **KYC - Create Profile** → Crée un profil KYC (`kycProfileId`)

## ⚡ Utilisation du Postman Runner (Workflow Automatique)

### 1. Importation du Runner

1. Ouvrir Postman
2. Cliquer sur **Runner** (en haut à gauche)
3. Glisser-déposer `Solia-SCI-Invest-Postman-Runner.json`
4. Sélectionner l'environnement `Solia-SCI-Invest`

### 2. Prérequis

**IMPORTANT**: Avant d'exécuter le runner, vous devez :

1. **Démarrer l'API backend** : `npm run dev` dans le dossier `backend/`
2. **Définir manuellement l'`investorId`** dans l'environnement Postman :
   - Soit en utilisant l'ID d'un utilisateur existant
   - Soit en exécutant d'abord manuellement la requête "Auth - Register" et en copiant l'ID retourné

### 3. Exécution du Runner

1. Dans Postman Runner, sélectionner la collection importée
2. Vérifier que l'environnement `Solia-SCI-Invest` est sélectionné
3. Cliquer sur **Run Solia SCI Invest - Complete Workflow**

### 4. Résultat Attendue

Le runner exécutera automatiquement toutes les étapes dans l'ordre :

✅ User registered successfully  
✅ Login successful (token capturé)  
✅ SCI created successfully (ID capturé)  
✅ Investor added successfully  
✅ Property added successfully (ID capturé)  
✅ Transaction added successfully (ID capturé)  
✅ KYC profile created successfully (ID capturé)  
✅ Complete workflow executed successfully!

## 🔧 Configuration des Variables d'Environnement

### Variables Automatiques (remplies par les tests)

- `authToken` → Rempli après le login
- `sciId` → Rempli après création SCI
- `propertyId` → Rempli après ajout propriété
- `transactionId` → Rempli après ajout transaction
- `kycProfileId` → Rempli après création profil KYC

### Variables Manuelles (à définir)

- `investorId` → Doit être défini manuellement avant l'exécution

## 🐛 Dépannage

### Problèmes Courants

1. **`investorId` non défini** :
   - Définir manuellement dans l'environnement Postman
   - Utiliser l'ID d'un utilisateur existant

2. **API non démarrée** :

   ```bash
   cd backend/
   npm run dev
   ```

3. **Erreurs CORS** :
   - Vérifier que le backend est configuré pour accepter les requêtes de Postman

4. **Token expiré** :
   - Ré-exécuter la requête "Auth - Login" pour obtenir un nouveau token

## 📊 Validation des Résultats

Après l'exécution, vérifier dans la console Postman que :

- Tous les tests passent (✅ vert)
- Tous les IDs sont correctement capturés
- Les variables d'environnement sont mises à jour

## 🔄 Réinitialisation

Pour réinitialiser complètement :

1. Vider les variables dans l'environnement Postman
2. Redémarrer le runner
3. Redéfinir manuellement l'`investorId` si nécessaire

---

**Note**: Le workflow est conçu pour être exécuté séquentiellement. Chaque étape dépend des variables définies par les étapes précédentes.
