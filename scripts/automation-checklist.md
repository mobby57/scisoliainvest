# 🚀 Checklist d'Automatisation - SCI Solia Invest

## ✅ Priorité 1 - CI de Base (CRITIQUE)
- [x] Pipeline Azure DevOps (`azure-pipelines.yml`)
- [ ] Tests unitaires avec couverture minimale (80%)
- [ ] Lint + TypeScript check obligatoire
- [ ] Cache pnpm pour performance CI
- [ ] Échec de build = blocage PR/merge

**Critères de succès**: Pipeline vert = déploiement autorisé

## 🧪 Priorité 2 - Tests d'Intégration
- [ ] Tests DB avec containers (Postgres + Redis)
- [ ] Tests multi-tenant isolation
- [ ] Tests Playwright e2e
- [ ] Mock PSP (Stripe/MangoPay sandbox)

**Contract**: Input (tenantId, action) → Output (isolation garantie)

## 🗄️ Priorité 3 - Migrations Automatisées
- [ ] `prisma migrate deploy` en staging/prod
- [ ] Scripts seed automatisés
- [ ] Backup avant migration prod
- [ ] Rollback automatique si échec

**Edge cases**: Migration partielle, données corrompues

## 🐳 Priorité 4 - Déploiement Docker
- [ ] Build image multi-stage
- [ ] Push vers registre (ACR/Docker Hub)
- [ ] Déploiement staging automatique
- [ ] Promotion prod manuelle avec approbation

**Contract**: Git tag → Image versionnée → Déploiement

## 💳 Priorité 5 - Webhooks & Paiements
- [ ] Validation signature PSP
- [ ] Protection replay (idempotency)
- [ ] Tests sandbox automatisés
- [ ] Audit trail complet

**Edge cases**: Signature invalide, replay attack, timeout PSP

## ⏰ Priorité 6 - Jobs Planifiés (CRITIQUE BUSINESS)
- [ ] Distribution loyers (cron mensuel)
- [ ] Rappels paiement automatiques
- [ ] Liquidation/retraits contrôlés
- [ ] Lock distribué (éviter double exécution)

**Contract**: 
- Input: tenantId, period, funds, shares
- Output: allocations atomiques + audit
- Failure: rollback complet

## 💾 Priorité 7 - Backup & Restore
- [ ] Backup nightly automatique
- [ ] Test restore hebdomadaire
- [ ] Rétention 30j + archivage
- [ ] Alertes si échec backup

## 🔒 Priorité 8 - Sécurité
- [ ] SAST scan (SonarQube/CodeQL)
- [ ] Dependency scanning (Dependabot)
- [ ] Secret scanning
- [ ] DAST staging (OWASP ZAP)

## 🛠️ Priorité 9 - Dev Experience
- [ ] Husky + lint-staged
- [ ] Commitlint (conventional commits)
- [ ] Scripts dev unifiés
- [ ] Bootstrap env automatique

## 📊 Priorité 10 - Observabilité
- [ ] Health checks endpoints
- [ ] Sentry error tracking
- [ ] Métriques Prometheus
- [ ] Alertes PagerDuty/Teams

---

## 🎯 Actions Immédiates (Cette Semaine)

### Jour 1-2: CI Foundation
1. Activer `azure-pipelines.yml` dans Azure DevOps
2. Configurer branch policies (require PR + CI success)
3. Ajouter badges de build dans README

### Jour 3-4: Tests & Quality
1. Implémenter tests d'isolation multi-tenant
2. Configurer Playwright pipeline
3. Ajouter coverage reports

### Jour 5: Déploiement
1. Créer Dockerfiles optimisés
2. Setup registre images
3. Pipeline staging automatique

---

## 📋 Contrats Critiques

### Distribution de Loyers
```typescript
interface RentDistribution {
  input: {
    tenantId: string;
    period: string; // YYYY-MM
    availableFunds: number;
    investors: Array<{id: string, sharesPercent: number}>;
  };
  output: {
    allocations: Array<{investorId: string, amount: number}>;
    auditLogId: string;
    transactionIds: string[];
    status: 'success' | 'partial' | 'failed';
  };
  errors: ['insufficient_funds', 'kyc_pending', 'duplicate_run'];
}
```

### Multi-Tenant Isolation
```typescript
interface TenantIsolation {
  rule: "Toute requête DOIT inclure tenantId dans WHERE clause";
  test: "Créer 2 tenants → Vérifier accès croisé impossible";
  enforcement: "Middleware automatique + tests CI";
}
```

---

## 🚨 Cas Limites à Tester

### Paiements
- [ ] Webhook signature invalide
- [ ] Replay attack (même idempotency key)
- [ ] Timeout PSP (> 30s)
- [ ] Montant négatif/zéro
- [ ] Devise incorrecte

### Distribution
- [ ] Somme shares != 100%
- [ ] KYC expiré pendant distribution
- [ ] Fonds insuffisants
- [ ] Double exécution (race condition)
- [ ] Rollback partiel

### Multi-tenant
- [ ] tenantId manquant dans requête
- [ ] tenantId modifié en cours de session
- [ ] Accès croisé via URL manipulation
- [ ] Fuite données dans logs/erreurs

---

## 📈 Métriques de Succès

### CI/CD
- Build time < 5min
- Test coverage > 80%
- Zero failed deployments
- MTTR < 15min

### Business
- Distribution loyers: 100% automatique
- Échec paiement: < 1%
- Isolation tenant: 0 faille
- Uptime: > 99.9%

---

*Prochaine étape: Choisir 1-3 items à implémenter cette semaine*