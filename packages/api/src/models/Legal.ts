/**
 * Legal Model - For legal documents, contracts, compliance, and obligations
 */

export interface LegalDocument {
  id: string;
  tenantId: string;
  sciId?: string;
  propertyId?: string;
  
  // Document details
  type: LegalDocumentType;
  title: string;
  reference: string;
  
  // Parties involved
  parties: Array<{
    type: 'sci' | 'partner' | 'tenant' | 'supplier' | 'third_party';
    id: string;
    name: string;
    role: string;
  }>;
  
  // Dates
  effectiveDate: Date;
  expiryDate?: Date;
  renewalDate?: Date;
  
  // Status
  status: LegalDocumentStatus;
  
  // Content
  documentId: string; // Link to Document model
  clauses: LegalClause[];
  
  // Obligations
  obligations: LegalObligation[];
  
  // Amendments
  amendments: Array<{
    date: Date;
    description: string;
    documentId: string;
  }>;
  
  // Validation
  validatedBy?: string;
  validatedAt?: Date;
  signedBy: Array<{
    party: string;
    signedAt: Date;
    signatureId: string;
  }>;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
}

export enum LegalDocumentType {
  // SCI documents
  SCI_STATUTES = 'sci_statutes', // Statuts de la SCI
  SHAREHOLDERS_AGREEMENT = 'shareholders_agreement', // Pacte d'associés
  PARTNERSHIP_AGREEMENT = 'partnership_agreement',
  
  // Property documents
  PURCHASE_DEED = 'purchase_deed', // Acte de vente
  PRELIMINARY_CONTRACT = 'preliminary_contract', // Compromis de vente
  LEASE_AGREEMENT = 'lease_agreement', // Bail
  COMMERCIAL_LEASE = 'commercial_lease', // Bail commercial
  EVICTION_NOTICE = 'eviction_notice',
  
  // Service contracts
  PROPERTY_MANAGEMENT = 'property_management',
  MAINTENANCE_CONTRACT = 'maintenance_contract',
  INSURANCE_POLICY = 'insurance_policy',
  
  // Legal compliance
  GENERAL_ASSEMBLY_MINUTES = 'general_assembly_minutes', // PV d'AG
  BOARD_MINUTES = 'board_minutes',
  LEGAL_NOTICE = 'legal_notice',
  POWER_OF_ATTORNEY = 'power_of_attorney',
  
  // Other
  CONTRACT = 'contract',
  AMENDMENT = 'amendment',
  TERMINATION = 'termination',
}

export enum LegalDocumentStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  PENDING_SIGNATURE = 'pending_signature',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  ARCHIVED = 'archived',
}

export interface LegalClause {
  id: string;
  number: string;
  title: string;
  content: string;
  category: ClauseCategory;
  mandatory: boolean;
}

export enum ClauseCategory {
  GENERAL = 'general',
  FINANCIAL = 'financial',
  TERMINATION = 'termination',
  LIABILITY = 'liability',
  CONFIDENTIALITY = 'confidentiality',
  DISPUTE_RESOLUTION = 'dispute_resolution',
  SPECIFIC = 'specific',
}

export interface LegalObligation {
  id: string;
  type: ObligationType;
  description: string;
  responsibleParty: string;
  dueDate?: Date;
  recurrence?: 'once' | 'monthly' | 'quarterly' | 'annual';
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: Date;
}

export enum ObligationType {
  PAYMENT = 'payment',
  DECLARATION = 'declaration',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  RENEWAL = 'renewal',
  NOTIFICATION = 'notification',
  REPORTING = 'reporting',
  COMPLIANCE = 'compliance',
}

export interface ComplianceCheck {
  id: string;
  tenantId: string;
  sciId: string;
  
  type: ComplianceType;
  status: 'compliant' | 'non_compliant' | 'warning' | 'pending';
  
  // Check details
  checkDate: Date;
  nextCheckDate: Date;
  
  // Results
  findings: Array<{
    requirement: string;
    status: 'met' | 'not_met' | 'partial';
    severity: 'info' | 'warning' | 'critical';
    description: string;
    remediation?: string;
  }>;
  
  // Actions
  actionsRequired: Array<{
    action: string;
    deadline: Date;
    priority: 'low' | 'medium' | 'high';
    assignedTo?: string;
  }>;
  
  score: number; // 0-100
}

export enum ComplianceType {
  // Legal compliance
  CORPORATE_GOVERNANCE = 'corporate_governance',
  ANNUAL_FILINGS = 'annual_filings',
  REGISTER_UPDATES = 'register_updates',
  
  // Property compliance
  SAFETY_REGULATIONS = 'safety_regulations',
  BUILDING_CODES = 'building_codes',
  ENERGY_PERFORMANCE = 'energy_performance',
  ACCESSIBILITY = 'accessibility',
  
  // Tenant compliance
  LEASE_COMPLIANCE = 'lease_compliance',
  RENT_CONTROLS = 'rent_controls',
  
  // Financial compliance
  ACCOUNTING_STANDARDS = 'accounting_standards',
  TAX_COMPLIANCE = 'tax_compliance',
  
  // Data protection
  GDPR = 'gdpr',
  DATA_SECURITY = 'data_security',
}

export interface LegalAlert {
  id: string;
  tenantId: string;
  sciId?: string;
  
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  
  // Deadline
  deadline?: Date;
  daysUntilDeadline?: number;
  
  // Actions
  recommendedAction: string;
  legalReference?: string;
  
  status: 'new' | 'acknowledged' | 'in_progress' | 'resolved';
  
  createdAt: Date;
}

export enum AlertType {
  CONTRACT_EXPIRY = 'contract_expiry',
  DEADLINE_APPROACHING = 'deadline_approaching',
  COMPLIANCE_ISSUE = 'compliance_issue',
  LEGAL_CHANGE = 'legal_change',
  OBLIGATION_DUE = 'obligation_due',
  RENEWAL_REQUIRED = 'renewal_required',
}

export interface LegalRegister {
  id: string;
  sciId: string;
  
  // Corporate register
  registrationNumber: string; // SIREN
  vatNumber?: string;
  tradeRegister?: string; // RCS
  
  // Partners
  partners: Array<{
    id: string;
    name: string;
    shares: number;
    percentage: number;
    joinedAt: Date;
    leftAt?: Date;
  }>;
  
  // Management
  managers: Array<{
    id: string;
    name: string;
    role: 'president' | 'manager' | 'secretary';
    appointedAt: Date;
    mandateEnd?: Date;
  }>;
  
  // Capital
  capitalAmount: number;
  sharesTotal: number;
  shareValue: number;
  
  // Updates
  lastUpdated: Date;
  changes: Array<{
    date: Date;
    type: string;
    description: string;
    documentId?: string;
  }>;
}

// Helper functions
export function calculateContractRenewalDate(expiryDate: Date, noticePeriod: number): Date {
  const renewalDate = new Date(expiryDate);
  renewalDate.setMonth(renewalDate.getMonth() - noticePeriod);
  return renewalDate;
}

export function isComplianceExpiring(compliance: ComplianceCheck, daysThreshold = 30): boolean {
  if (!compliance.nextCheckDate) return false;
  const daysUntil = Math.floor((compliance.nextCheckDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return daysUntil <= daysThreshold && daysUntil > 0;
}

export function getLegalDocumentIcon(type: LegalDocumentType): string {
  const icons: Partial<Record<LegalDocumentType, string>> = {
    [LegalDocumentType.SCI_STATUTES]: '📜',
    [LegalDocumentType.LEASE_AGREEMENT]: '🏠',
    [LegalDocumentType.PURCHASE_DEED]: '🏛️',
    [LegalDocumentType.CONTRACT]: '📄',
    [LegalDocumentType.INSURANCE_POLICY]: '🛡️',
  };
  return icons[type] || '📋';
}
