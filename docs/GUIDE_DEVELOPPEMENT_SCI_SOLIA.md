# 🏢 Guide de Développement SCI Solia Invest

**Version**: 1.0  
**Date**: 26 septembre 2025  
**Auteurs**: Équipe SCI Solia Invest  

---

## 🎯 Vision & Contexte Métier

SCI Solia Invest est une **plateforme SaaS multi-tenant** de gestion de **Sociétés Civiles Immobilières (SCI)**. Chaque SCI constitue une entité autonome avec ses investisseurs, propriétés, locataires et flux financiers. La plateforme gère le cycle complet : création SCI → levée de fonds → acquisition immobilière → gestion locative → distribution des revenus.

### Contraintes Réglementaires Critiques
- **KYC obligatoire** avant tout mouvement de fonds
- **Audit trail immuable** pour conformité fiscale et légale
- **Ségrégation stricte des données** inter-SCI (multi-tenant)
- **Validation notariale** pour actes officiels
- **Respect des quotas de répartition** selon les parts détenues

---

## 🏗️ Patterns Architecturaux Spécifiques SCI

### 1. Multi-Tenant Pattern
```typescript
// Toute entité DOIT avoir un tenantId
interface BaseEntity {
  tenantId: string;  // UUID de la SCI
  createdAt: Date;
  updatedAt: Date;
}

// Exemple - Investisseur lié à une SCI
interface Investor extends BaseEntity {
  sciId: string;     // Référence à la SCI parent
  userId: string;    // Référence utilisateur
  sharesPercent: number; // % de parts détenues
}
```

### 2. Unit of Work / Transactional Integrity
```typescript
// Toute opération financière = transaction atomique
async function processInvestment(investmentData: InvestmentRequest) {
  const transaction = await db.transaction();
  
  try {
    // 1. Valider KYC
    await validateKYC(investmentData.investorId);
    
    // 2. Débiter compte investisseur
    await debitAccount(investmentData.amount, transaction);
    
    // 3. Mettre à jour capital SCI
    await updateSCICapital(investmentData.sciId, transaction);
    
    // 4. Créer parts investisseur
    await createShares(investmentData, transaction);
    
    await transaction.commit();
    
    // 5. Event après commit
    await publishEvent('INVESTMENT_CONFIRMED', investmentData);
    
  } catch (error) {
    await transaction.rollback();
    throw new InvestmentError(`Investissement échoué: ${error.message}`);
  }
}
```

### 3. Audit Trail Pattern
```typescript
interface AuditLog {
  id: string;
  tenantId: string;
  entityType: 'INVESTOR' | 'PROPERTY' | 'TRANSACTION' | 'DOCUMENT';
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VALIDATE';
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  userId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

// Usage automatique via middleware
async function auditableUpdate(entityType, entityId, changes, context) {
  const oldEntity = await fetchEntity(entityType, entityId);
  
  await createAuditLog({
    tenantId: context.tenantId,
    entityType,
    entityId,
    action: 'UPDATE',
    oldValues: oldEntity,
    newValues: changes,
    userId: context.userId,
    timestamp: new Date(),
    ipAddress: context.ip,
    userAgent: context.userAgent
  });
  
  return await updateEntity(entityType, entityId, changes);
}
```

### 4. Domain Events Pattern
```typescript
// Events métier SCI
enum DomainEvents {
  KYC_VALIDATED = 'KYC_VALIDATED',
  INVESTMENT_CONFIRMED = 'INVESTMENT_CONFIRMED',
  RENT_PAYMENT_RECEIVED = 'RENT_PAYMENT_RECEIVED',
  TENANT_LATE_PAYMENT = 'TENANT_LATE_PAYMENT',
  DOCUMENT_SIGNED = 'DOCUMENT_SIGNED',
  GENERAL_MEETING_SCHEDULED = 'GENERAL_MEETING_SCHEDULED'
}

// Handler exemple
async function onKYCValidated(event: KYCValidatedEvent) {
  // 1. Débloquer capacité d'investissement
  await unlockInvestmentCapacity(event.investorId);
  
  // 2. Notification email
  await sendEmail({
    to: event.investorEmail,
    template: 'KYC_APPROVED',
    data: { investorName: event.investorName }
  });
  
  // 3. Notification admin SCI
  await notifyAdmins(event.tenantId, 'NEW_VALIDATED_INVESTOR');
}
```

### 5. Template Factory Pattern
```typescript
interface DocumentTemplate {
  id: string;
  type: 'SCI_STATUTES' | 'LEASE_AGREEMENT' | 'MEETING_MINUTES';
  version: string;
  templatePath: string;
  variables: string[]; // Variables à remplacer
}

class DocumentTemplateFactory {
  async generateDocument(
    templateType: string, 
    variables: Record<string, any>, 
    tenantId: string
  ): Promise<GeneratedDocument> {
    
    const template = await this.getLatestTemplate(templateType);
    const content = await this.renderTemplate(template, variables);
    
    // Signature électronique requise
    const signedDoc = await this.requestSignature(content, variables.signatories);
    
    // Stockage avec hash d'intégrité
    const document = await this.storeDocument({
      tenantId,
      type: templateType,
      content: signedDoc,
      checksum: await this.calculateChecksum(signedDoc),
      variables,
      templateVersion: template.version
    });
    
    return document;
  }
}
```

---

## 🔧 Workflows Développeurs Critiques

### 1. Debug Auth JWT
```bash
# Toujours tester avec des tokens valides
cd packages/api

# Générer token de test
node scripts/generate-test-tokens.js --tenant=test-sci --role=ADMIN

# Tester avec token
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/investors

# Debug refresh flow
node debug-tests.js auth
```

**⚠️ Piège courant**: Tests qui échouent car `req.user.tenantId` est undefined → toujours mocker l'auth middleware.

### 2. Simulation Flux Financiers
```typescript
// Test workflow complet sans PSP réel
const mockPaymentFlow = {
  // 1. Créer SCI test
  sci: await createTestSCI(),
  
  // 2. Investisseur avec KYC validé
  investor: await createValidatedInvestor({ kycStatus: 'APPROVED' }),
  
  // 3. Mock paiement
  payment: await mockStripePayment({ 
    amount: 50000, // 500€
    status: 'succeeded' 
  }),
  
  // 4. Vérifier répartition
  distribution: await calculateRentDistribution(sci.id)
};
```

### 3. Upload & Validation Documents
```typescript
// Pattern en 2 étapes obligatoire
enum DocumentStatus {
  UPLOADED = 'UPLOADED',      // Upload brut
  PENDING = 'PENDING',        // En attente validation
  APPROVED = 'APPROVED',      // Validé par admin
  REJECTED = 'REJECTED',      // Rejeté
  ARCHIVED = 'ARCHIVED'       // Archivé
}

// Workflow de validation
async function uploadDocument(file: FileUpload, metadata: DocumentMetadata) {
  // 1. Upload + scan antivirus
  const uploadedFile = await storeSecureFile(file);
  
  // 2. Création avec statut UPLOADED
  const document = await createDocument({
    ...metadata,
    status: DocumentStatus.UPLOADED,
    filePath: uploadedFile.path
  });
  
  // 3. Queue pour validation admin
  await queueDocumentForReview(document.id);
  
  return document;
}
```

### 4. Testing Multi-Tenant
```typescript
// Tests avec isolation de données
describe('Multi-tenant isolation', () => {
  const tenantA = 'sci-alpha-uuid';
  const tenantB = 'sci-beta-uuid';
  
  it('should not leak data between tenants', async () => {
    // Créer investisseur SCI A
    const investorA = await createInvestor({ tenantId: tenantA });
    
    // Créer investisseur SCI B  
    const investorB = await createInvestor({ tenantId: tenantB });
    
    // Récupérer investisseurs SCI A
    const investorsA = await getInvestors({ tenantId: tenantA });
    
    // Vérifier isolation
    expect(investorsA).toHaveLength(1);
    expect(investorsA[0].id).toBe(investorA.id);
    expect(investorsA).not.toContainEqual(expect.objectContaining({ id: investorB.id }));
  });
});
```

### 5. Migrations DB Sensibles
```sql
-- ❌ JAMAIS supprimer directement une table financière
-- DROP TABLE transactions; 

-- ✅ Migration prudente avec sauvegarde
BEGIN;

-- 1. Créer nouvelle structure
CREATE TABLE transactions_v2 (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  -- nouvelles colonnes
  tax_amount DECIMAL(15,2),
  net_amount DECIMAL(15,2),
  -- anciennes colonnes préservées
  old_transaction_id UUID REFERENCES transactions(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Migrer données avec calculs
INSERT INTO transactions_v2 (id, tenant_id, amount, tax_amount, net_amount, old_transaction_id)
SELECT 
  gen_random_uuid(),
  tenant_id,
  amount,
  amount * 0.20 as tax_amount,  -- 20% de taxe
  amount * 0.80 as net_amount,  -- 80% net
  id
FROM transactions;

-- 3. Vérifications
SELECT COUNT(*) FROM transactions;      -- Doit égaler
SELECT COUNT(*) FROM transactions_v2;  -- ces deux nombres

-- 4. Seulement après validation complète
-- ALTER TABLE transactions RENAME TO transactions_backup;
-- ALTER TABLE transactions_v2 RENAME TO transactions;

COMMIT;
```

---

## 🔗 Intégrations Services Externes

### 1. Paiements (Stripe, MangoPay, Lemonway)
```typescript
interface PSPIntegration {
  // Pattern KYC obligatoire
  async createUserAccount(userData: UserData): Promise<PSPAccount> {
    // 1. Créer compte PSP
    const account = await this.psp.createAccount({
      tenantId: userData.tenantId,
      email: userData.email,
      legalName: userData.fullName
    });
    
    // 2. Initier KYC
    const kycRequest = await this.psp.initiateKYC(account.id, {
      documents: ['ID_PROOF', 'ADDRESS_PROOF'],
      callback: `${API_BASE}/webhooks/kyc-update`
    });
    
    return { account, kycRequest };
  }
  
  // Pattern webhook validation
  async handleKYCWebhook(payload: KYCWebhookPayload) {
    // 1. Vérifier signature webhook
    const isValid = await this.verifyWebhookSignature(payload);
    if (!isValid) throw new Error('Invalid webhook signature');
    
    // 2. Mettre à jour statut KYC
    await updateKYCStatus(payload.userId, payload.status);
    
    // 3. Débloquer investissements si approuvé
    if (payload.status === 'APPROVED') {
      await enableInvestmentCapacity(payload.userId);
      await publishEvent('KYC_VALIDATED', payload);
    }
  }
}
```

### 2. Stockage Documents (S3/Azure Blob)
```typescript
interface DocumentStorage {
  async storeDocument(
    file: Buffer, 
    metadata: DocumentMetadata
  ): Promise<StoredDocument> {
    
    // 1. Calculer hash d'intégrité
    const checksum = crypto
      .createHash('sha256')
      .update(file)
      .digest('hex');
    
    // 2. Chiffrement si sensible
    const encryptedFile = await this.encryptDocument(file, metadata.tenantId);
    
    // 3. Upload avec versioning
    const key = `${metadata.tenantId}/${metadata.type}/${metadata.id}_v${metadata.version}`;
    await this.s3.upload({
      Bucket: DOCUMENTS_BUCKET,
      Key: key,
      Body: encryptedFile,
      Metadata: {
        checksum,
        tenantId: metadata.tenantId,
        originalName: metadata.filename
      }
    });
    
    // 4. Enregistrer en DB
    return await this.saveDocumentRecord({
      ...metadata,
      storagePath: key,
      checksum,
      encrypted: true
    });
  }
}
```

### 3. Notifications (SMTP + SMS)
```typescript
interface NotificationService {
  // Email transactionnel
  async sendTransactionalEmail(
    template: EmailTemplate, 
    recipient: string, 
    data: any
  ) {
    const content = await this.renderEmailTemplate(template, data);
    
    await this.smtp.send({
      from: process.env.SMTP_FROM,
      to: recipient,
      subject: content.subject,
      html: content.body,
      // Tracking pour audit
      headers: {
        'X-Tenant-ID': data.tenantId,
        'X-Email-Type': template.type
      }
    });
    
    // Log pour audit
    await this.logNotification('EMAIL_SENT', recipient, template.type);
  }
  
  // SMS de rappel
  async sendPaymentReminder(tenantId: string, tenantPhone: string, amount: number) {
    const message = `SCI Solia: Votre loyer de ${amount}€ est en retard. Régularisez rapidement pour éviter les pénalités.`;
    
    await this.sms.send({
      to: tenantPhone,
      body: message
    });
    
    await this.logNotification('SMS_SENT', tenantPhone, 'PAYMENT_REMINDER');
  }
}
```

---

## 📋 Contraintes Métier SCI Critiques

### 1. KYC Obligatoire
```typescript
// Middleware de validation KYC
async function requireValidKYC(req: Request, res: Response, next: NextFunction) {
  const userId = req.user.id;
  
  const kycProfile = await KYCProfile.findOne({ 
    userId, 
    tenantId: req.user.tenantId 
  });
  
  if (!kycProfile || kycProfile.status !== 'APPROVED') {
    return res.status(403).json({
      error: 'KYC_REQUIRED',
      message: 'Validation KYC requise avant toute transaction financière',
      redirectUrl: '/kyc/complete'
    });
  }
  
  next();
}

// Usage sur routes sensibles
router.post('/investments', requireValidKYC, createInvestment);
router.post('/withdrawals', requireValidKYC, processWithdrawal);
```

### 2. Répartition Stricte des Loyers
```typescript
async function distributeRentPayment(
  sciId: string, 
  totalRentReceived: number,
  tenantId: string
) {
  // 1. Récupérer tous les investisseurs et leurs parts
  const investors = await Investor.find({ sciId, tenantId });
  const totalShares = investors.reduce((sum, inv) => sum + inv.sharesPercent, 0);
  
  // 2. Vérifier cohérence (doit = 100%)
  if (Math.abs(totalShares - 100) > 0.01) {
    throw new BusinessError('Incohérence dans la répartition des parts');
  }
  
  // 3. Calculer distribution
  const distributions = investors.map(investor => ({
    investorId: investor.id,
    amount: (totalRentReceived * investor.sharesPercent) / 100,
    percentage: investor.sharesPercent
  }));
  
  // 4. Transaction atomique
  const transaction = await db.transaction();
  try {
    for (const dist of distributions) {
      await createRentDistribution(dist, transaction);
      await creditInvestorAccount(dist.investorId, dist.amount, transaction);
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
  
  // 5. Notifications
  await Promise.all(distributions.map(dist => 
    notifyInvestor(dist.investorId, 'RENT_RECEIVED', dist.amount)
  ));
}
```

### 3. Blocage des Retraits
```typescript
enum WithdrawalRestriction {
  MINIMUM_HOLDING_PERIOD = 'MINIMUM_HOLDING_PERIOD',  // Ex: 2 ans minimum
  PENDING_GENERAL_MEETING = 'PENDING_GENERAL_MEETING', // Attente décision AG
  INSUFFICIENT_LIQUIDITY = 'INSUFFICIENT_LIQUIDITY',   // Pas assez de cash
  LEGAL_DISPUTE = 'LEGAL_DISPUTE'                      // Litige en cours
}

async function validateWithdrawal(
  investorId: string, 
  amount: number, 
  tenantId: string
): Promise<WithdrawalValidation> {
  
  const investor = await Investor.findOne({ id: investorId, tenantId });
  const sci = await SCI.findById(investor.sciId);
  
  // 1. Vérifier période minimale
  const holdingPeriod = Date.now() - investor.investmentDate.getTime();
  const minimumPeriod = sci.minimumHoldingPeriod || (2 * 365 * 24 * 60 * 60 * 1000); // 2 ans
  
  if (holdingPeriod < minimumPeriod) {
    return {
      allowed: false,
      restriction: WithdrawalRestriction.MINIMUM_HOLDING_PERIOD,
      message: `Période de détention minimum non atteinte. Reste ${Math.ceil((minimumPeriod - holdingPeriod) / (24 * 60 * 60 * 1000))} jours.`
    };
  }
  
  // 2. Vérifier liquidités SCI
  const availableCash = await getSCIAvailableCash(sci.id);
  if (amount > availableCash) {
    return {
      allowed: false,
      restriction: WithdrawalRestriction.INSUFFICIENT_LIQUIDITY,
      message: `Liquidités insuffisantes. Disponible: ${availableCash}€`
    };
  }
  
  // 3. Vérifier décisions AG en cours
  const pendingMeetings = await GeneralMeeting.find({
    sciId: sci.id,
    status: 'SCHEDULED',
    topics: { $in: ['CAPITAL_REDUCTION', 'INVESTOR_EXIT'] }
  });
  
  if (pendingMeetings.length > 0) {
    return {
      allowed: false,
      restriction: WithdrawalRestriction.PENDING_GENERAL_MEETING,
      message: 'Retrait suspendu en attente de décision en Assemblée Générale'
    };
  }
  
  return { allowed: true };
}
```

### 4. Validation Notariale
```typescript
enum NotarialStatus {
  DRAFT = 'DRAFT',
  SUBMITTED_TO_NOTARY = 'SUBMITTED_TO_NOTARY',
  NOTARY_REVIEWING = 'NOTARY_REVIEWING',
  NOTARY_APPROVED = 'NOTARY_APPROVED',
  NOTARY_REJECTED = 'NOTARY_REJECTED',
  EXECUTED = 'EXECUTED'
}

interface NotarialDocument {
  id: string;
  tenantId: string;
  type: 'SCI_CREATION' | 'STATUTE_AMENDMENT' | 'PROPERTY_ACQUISITION';
  status: NotarialStatus;
  notaryOfficeId: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  executedAt?: Date;
  rejectionReason?: string;
}

async function submitToNotary(documentId: string, notaryOfficeId: string) {
  // 1. Générer dossier complet
  const document = await NotarialDocument.findById(documentId);
  const dossier = await generateNotarialDossier(document);
  
  // 2. Transmission sécurisée
  await transmitToNotaryOffice(notaryOfficeId, dossier);
  
  // 3. Mise à jour statut
  await NotarialDocument.findByIdAndUpdate(documentId, {
    status: NotarialStatus.SUBMITTED_TO_NOTARY,
    submittedAt: new Date(),
    notaryOfficeId
  });
  
  // 4. Notification parties prenantes
  await notifyStakeholders(document.tenantId, 'DOCUMENT_SUBMITTED_TO_NOTARY');
}
```

### 5. Gestion Pénalités Locataires
```typescript
interface RentPaymentPolicy {
  gracePeriodDays: number;      // Période de grâce (ex: 3 jours)
  penaltyRate: number;          // Taux de pénalité (ex: 0.1% par jour)
  maxPenaltyAmount: number;     // Plafond des pénalités
  reminderSchedule: number[];   // Jours de rappel [5, 15, 30]
}

async function processLateRentPayment(leaseId: string, dueDate: Date) {
  const lease = await Lease.findById(leaseId);
  const policy = await getRentPaymentPolicy(lease.tenantId);
  const daysLate = Math.ceil((Date.now() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
  
  if (daysLate <= policy.gracePeriodDays) {
    return; // Encore dans la période de grâce
  }
  
  // 1. Calculer pénalités
  const penaltyDays = daysLate - policy.gracePeriodDays;
  const penaltyAmount = Math.min(
    lease.monthlyRent * policy.penaltyRate * penaltyDays,
    policy.maxPenaltyAmount
  );
  
  // 2. Créer charge de pénalité
  await createPenaltyCharge({
    leaseId,
    tenantId: lease.tenantId,
    amount: penaltyAmount,
    daysLate,
    dueDate,
    createdAt: new Date()
  });
  
  // 3. Envoi rappels selon planning
  for (const reminderDay of policy.reminderSchedule) {
    if (daysLate === reminderDay) {
      await sendPaymentReminder({
        tenantPhone: lease.tenant.phone,
        tenantEmail: lease.tenant.email,
        amountDue: lease.monthlyRent + penaltyAmount,
        daysLate
      });
    }
  }
  
  // 4. Génération courrier type si > 30 jours
  if (daysLate > 30) {
    await generateFormalNotice({
      leaseId,
      tenant: lease.tenant,
      totalAmountDue: lease.monthlyRent + penaltyAmount,
      daysLate
    });
  }
}
```

### 6. Document Officiel avec Horodatage
```typescript
interface OfficialDocument {
  id: string;
  tenantId: string;
  type: 'LEASE' | 'SCI_STATUTES' | 'MEETING_MINUTES';
  version: string;
  content: string;
  checksum: string;
  
  // Horodatage qualifié
  timestampToken: string;      // Token d'horodatage TSA
  timestampedAt: Date;         // Date d'horodatage
  timestampAuthority: string;  // Autorité d'horodatage
  
  // Signatures électroniques
  signatures: ElectronicSignature[];
  signingCompleted: boolean;
  eIDASCompliant: boolean;     // Conformité eIDAS
}

interface ElectronicSignature {
  signerId: string;
  signerRole: 'INVESTOR' | 'ADMIN' | 'TENANT' | 'NOTARY';
  signedAt: Date;
  signatureToken: string;      // Token de signature
  certificateChain: string[];  // Chaîne de certificats
  signatureValid: boolean;
}

async function createOfficialDocument(
  template: DocumentTemplate, 
  data: DocumentData,
  requiredSignatures: SignatureRequirement[]
): Promise<OfficialDocument> {
  
  // 1. Générer contenu depuis template
  const content = await renderDocument(template, data);
  
  // 2. Calculer empreinte
  const checksum = crypto.createHash('sha256').update(content).digest('hex');
  
  // 3. Horodatage qualifié
  const timestamp = await requestQualifiedTimestamp(content);
  
  // 4. Créer document en attente de signature
  const document = await OfficialDocument.create({
    ...data,
    content,
    checksum,
    timestampToken: timestamp.token,
    timestampedAt: timestamp.date,
    timestampAuthority: timestamp.authority,
    signatures: [],
    signingCompleted: false,
    eIDASCompliant: requiredSignatures.some(req => req.eIDASLevel === 'SUBSTANTIAL')
  });
  
  // 5. Initier processus de signature
  for (const sigReq of requiredSignatures) {
    await initiateElectronicSignature(document.id, sigReq);
  }
  
  return document;
}
```

---

## 🚀 Scripts & Commandes Essentiels

### Développement Local
```bash
# Setup complet
./quick-start.bat

# Dev avec hot-reload
pnpm dev

# Tests avec patterns spécifiques
cd packages/api
node debug-tests.js kyc        # Tests KYC
node debug-tests.js projects   # Tests projets/SCI
node debug-tests.js auth       # Tests authentification

# Validation TypeScript
pnpm --filter api build:ts
pnpm --filter client build
```

### Base de Données
```bash
# Migration Prisma
cd packages/api
npx prisma migrate dev
npx prisma generate

# Seed avec données SCI test
npx prisma db seed

# Backup avant migration sensible
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Déploiement
```bash
# Build production
pnpm build

# Tests complets
pnpm test
pnpm test:e2e

# Deploy (via Azure DevOps)
git push origin main
```

---

## 📚 Ressources & Documentation

### APIs Externes
- **Stripe**: [Documentation Connect](https://stripe.com/docs/connect)
- **MangoPay**: [Guide KYC](https://docs.mangopay.com/guide/kyc)
- **eIDAS**: [Signature électronique](https://ec.europa.eu/digital-building-blocks/wikis/display/DIGITAL/eIDAS)

### Conformité & Réglementation
- **Code Civil**: Articles 1832-1870 (sociétés civiles)
- **RGPD**: Protection données personnelles
- **LCB-FT**: Lutte contre blanchiment et financement terrorisme

### Architecture & Patterns
- **Multi-tenancy**: [Microsoft Guide](https://docs.microsoft.com/en-us/azure/architecture/guide/multitenant/overview)
- **Domain Events**: [Martin Fowler](https://martinfowler.com/articles/201701-event-driven.html)
- **Audit Logging**: [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

---

## ✅ Checklist Développeur

### Avant chaque feature
- [ ] Vérifier isolation multi-tenant (`tenantId` partout)
- [ ] Valider contraintes KYC si financier
- [ ] Implémenter audit trail pour actions sensibles
- [ ] Tester avec plusieurs tenants différents
- [ ] Vérifier gestion des erreurs et rollbacks

### Avant chaque déploiement
- [ ] Tests multi-tenant passent
- [ ] Migration DB testée sur copie production
- [ ] Webhooks PSP fonctionnels
- [ ] Notifications email/SMS opérationnelles
- [ ] Monitoring et alertes configurés

### Code Review
- [ ] Pas de fuite de données inter-tenant
- [ ] Transactions atomiques pour opérations financières
- [ ] Validation métier respectée (KYC, pénalités, etc.)
- [ ] Logs d'audit complets
- [ ] Gestion d'erreurs explicite et user-friendly

---

**💡 Conseil**: Garde toujours en tête que chaque ligne de code peut avoir un impact financier ou légal. En cas de doute sur une contrainte métier, consulte toujours l'équipe juridique ou comptable.

**📞 Support**: Pour toute question technique → `tech@scisoliainvest.com`  
**📞 Métier**: Pour clarifications business → `product@scisoliainvest.com`