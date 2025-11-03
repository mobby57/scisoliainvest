
# 🔧 Services SCI Solia Invest

## Vue d'ensemble

SCI Solia Invest dispose de 7 services métier principaux couvrant tous les aspects de la gestion immobilière collaborative.

## Services Disponibles

### 1. 📄 UnifiedDocumentService.ts
- **Rôle**: Gestion centralisée des documents
- **Technologie**: TypeScript, MongoDB
- **Workflow**: Tenant → Buyer → SCI Associate
- **Fonctionnalités**: 
  - Upload sécurisé multi-format
  - Validation automatique
  - Traçabilité complète
  - Notifications en temps réel

### 2. 💰 FinancialService.js  
- **Rôle**: Gestion financière complète
- **Technologie**: JavaScript, MongoDB
- **Couverture**: Loyers, revenus, pénalités, distributions
- **Fonctionnalités**:
  - Calculs automatiques
  - Intégrations PSP (Stripe/MangoPay)
  - Planification des paiements
  - Analytics financiers

### 3. 🔒 KYCAMLService.js
- **Rôle**: Conformité réglementaire KYC/AML
- **Technologie**: JavaScript, MongoDB  
- **Conformité**: ACPR, AMF, LCB-FT
- **Fonctionnalités**:
  - Vérifications automatisées
  - Scoring de risque
  - Détection de motifs suspects
  - Rapports réglementaires

### 4. 🗳️ GeneralMeetingService.js
- **Rôle**: Assemblées Générales digitales
- **Technologie**: JavaScript, MongoDB
- **Fonctionnalités**:
  - Planification AG
  - Vote en ligne sécurisé  
  - Gestion des procurations
  - Génération PV automatique

### 5. ✍️ ElectronicSignatureService.js
- **Rôle**: Signatures électroniques eIDAS
- **Technologie**: JavaScript, MongoDB
- **Conformité**: Règlement eIDAS
- **Fonctionnalités**:
  - Signatures qualifiées
  - Horodatage certifié
  - Workflow multi-signataires
  - Audit complet

### 6. 📊 AnalyticsReportingService.js
- **Rôle**: Business Intelligence et reporting
- **Technologie**: JavaScript, MongoDB
- **Fonctionnalités**:
  - KPIs temps réel
  - Tableaux de bord interactifs
  - Rapports automatisés
  - Analytics prédictifs

### 7. 📡 MonitoringService.js
- **Rôle**: Surveillance système et alertes
- **Technologie**: JavaScript, MongoDB, EventEmitter
- **Fonctionnalités**:
  - Métriques temps réel
  - Alertes intelligentes
  - Santé système
  - Observabilité complète

## Architecture Technique

### Stack Technologique
- **Backend**: Node.js/Express
- **Langages**: TypeScript + JavaScript
- **Base de données**: MongoDB (document) + PostgreSQL (relationnel)
- **Cache**: Redis (prévu)
- **Queue**: Bull/Agenda (prévu)

### Patterns Utilisés
- **Service Layer**: Logique métier encapsulée
- **Repository Pattern**: Abstraction données
- **Observer Pattern**: Événements système
- **Factory Pattern**: Création d'objets complexes
- **Decorator Pattern**: Augmentation fonctionnalités

### Intégrations Externes
- **PSP**: Stripe, MangoPay
- **eIDAS**: Fournisseurs certifiés
- **Notifications**: SMTP, SMS, Slack
- **Storage**: AWS S3, Azure Blob
- **TSA**: Horodatage qualifié

## Guide d'utilisation

### Import des Services
```javascript
// Import ES6
import UnifiedDocumentService from './services/UnifiedDocumentService.js';
import FinancialService from './services/FinancialService.js';

// Import CommonJS  
const KYCAMLService = require('./services/KYCAMLService.js');
```

### Exemples d'utilisation

#### Gestion Documents
```javascript
// Upload document
const document = await UnifiedDocumentService.uploadDocument({
  tenantId: 'tenant-123',
  profileType: 'TENANT',
  documentType: 'IDENTITY_CARD',
  file: fileBuffer
});

// Valider document
await UnifiedDocumentService.approveDocument(document.id, 'admin-id');
```

#### Gestion Financière
```javascript
// Enregistrer paiement loyer
const payment = await FinancialService.processRentPayment({
  propertyId: 'prop-123',
  tenantId: 'tenant-456', 
  amount: 1200,
  dueDate: new Date()
});

// Calculer distribution
const distribution = await FinancialService.calculateRevenueDistribution('sci-789');
```

#### KYC/AML
```javascript
// Démarrer vérification KYC
const verification = await KYCAMLService.initiateKYCVerification({
  userId: 'user-123',
  level: 'ENHANCED',
  documents: ['passport', 'proof_address']
});

// Analyser transaction
const riskScore = await KYCAMLService.analyzeTransaction({
  amount: 50000,
  sender: 'user-123',
  recipient: 'sci-456'
});
```

## Scripts de Développement

### Validation
```bash
# Valider tous les services
npm run services:validate

# Vérification TypeScript
npm run type-check
```

### Développement
```bash
# Démarrage avec TypeScript
npm run dev:ts

# Démarrage avec JavaScript
npm run dev

# Build production
npm run build
```

### Tests
```bash
# Tests unitaires
npm test

# Tests d'intégration  
npm run test:integration
```

## Monitoring et Logs

### Métriques Disponibles
- Performances des requêtes
- Utilisation mémoire/CPU
- Taux d'erreur par service
- Santé des dépendances externes

### Alertes Configurées
- Latence > 1000ms
- Taux erreur > 5%
- Mémoire > 80%
- Services indisponibles

## Roadmap

### Phase 1 ✅ - Services Core
- [x] Gestion documentaire
- [x] Services financiers
- [x] Conformité KYC/AML

### Phase 2 ✅ - Services Avancés  
- [x] Assemblées Générales
- [x] Signatures électroniques
- [x] Analytics & Reporting

### Phase 3 ✅ - Observabilité
- [x] Monitoring temps réel
- [x] Alertes intelligentes
- [x] Tableaux de bord

### Phase 4 🔄 - Prochaine
- [ ] API Gateway
- [ ] Microservices
- [ ] Cache Redis
- [ ] Queue System

## Support

- 📖 **Documentation**: `docs/`
- 🐛 **Issues**: Utiliser les logs de service
- 🔧 **Debug**: `DEBUG=solia:* npm run dev`
- 📞 **Support**: Équipe DevOps SCI Solia

---
*Dernière mise à jour: 27/09/2025*
