# TODO PRIORITAIRE - SCI Solia Invest

## ✅ RÉCEMMENT COMPLÉTÉ (Novembre 2025)

### Mise à jour du projet
- [x] Mise à jour de toutes les dépendances (root, backend, frontend)
- [x] Correction de toutes les vulnérabilités de sécurité critiques
- [x] Mise à jour de Next.js vers 14.2.33 (patches de sécurité)
- [x] Mise à jour de la documentation (README.md)
- [x] Installation des dépendances manquantes

## 🔴 CRITIQUE (Faire maintenant)

### 1. BASE DE DONNÉES
- [ ] Configurer PostgreSQL local
- [ ] Ajouter modèles SCI dans schema.prisma
- [ ] Exécuter migrations Prisma
- [ ] Connecter Prisma Client aux routes

### 2. BACKEND FIXES
- [ ] Remplacer arrays par Prisma queries
- [ ] Créer middleware auth centralisé
- [ ] Créer dossier uploads/
- [ ] Ajouter validation Zod

## 🟡 IMPORTANT (Faire cette semaine)

### 3. FRONTEND FIXES
- [ ] Migrer website/ vers frontend/ (Next.js)
- [ ] Corriger types User dupliqués
- [ ] Améliorer gestion erreurs API
- [ ] Fixer redirections auth
- [ ] Tester toutes les routes

### 4. FONCTIONNALITÉS CORE
- [ ] Dashboard avec vraies données
- [ ] Connecter composant Investment
- [ ] Système notifications
- [ ] Upload fichiers KYC

## 🟢 AMÉLIORATIONS (Faire plus tard)

### 5. TESTS & QUALITÉ
- [ ] Tests unitaires backend
- [ ] Tests E2E frontend
- [ ] Linting/Formatting
- [ ] Documentation API

### 6. PRODUCTION
- [ ] Docker fonctionnel
- [ ] Variables d'environnement prod
- [ ] CI/CD pipeline
- [ ] Monitoring

## 📊 STATUT ACTUEL (Mis à jour: Novembre 2025)
✅ Backend API basique (port 3000)
✅ Frontend React components (en préparation)
✅ Authentification JWT
✅ Routes CRUD basiques
✅ **Dépendances à jour (0 vulnérabilités)**
✅ **Documentation améliorée**
❌ Base de données persistante
❌ Upload fichiers
❌ Tests automatisés
❌ Production ready

## 🎯 PROCHAINE ÉTAPE
**Configurer PostgreSQL + Prisma** pour avoir une vraie base de données.