/**
 * Tax & Fiscal Model - For tax calculations, declarations, and compliance
 */

export interface TaxDeclaration {
  id: string;
  tenantId: string;
  sciId: string;
  
  // Declaration details
  year: number;
  type: TaxDeclarationType;
  status: TaxStatus;
  
  // Financial data
  revenue: number;
  expenses: number;
  taxableIncome: number;
  
  // Tax calculations
  taxRate: number;
  taxAmount: number;
  socialContributions: number;
  totalTaxDue: number;
  
  // Payments
  amountPaid: number;
  paymentStatus: PaymentStatus;
  paymentDueDate: Date;
  
  // Documents
  declarationDocumentId?: string;
  supportingDocuments: string[];
  
  // Submission
  submittedAt?: Date;
  submittedBy?: string;
  confirmationNumber?: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  validatedBy?: string;
  validatedAt?: Date;
}

export enum TaxDeclarationType {
  // SCI taxes
  INCOME_TAX = 'income_tax', // Impôt sur le revenu
  CORPORATE_TAX = 'corporate_tax', // IS - Impôt sur les sociétés
  VAT = 'vat', // TVA
  PROPERTY_TAX = 'property_tax', // Taxe foncière
  HOUSING_TAX = 'housing_tax', // Taxe d'habitation
  
  // Social contributions
  SOCIAL_CONTRIBUTIONS = 'social_contributions', // Contributions sociales
  CSG_CRDS = 'csg_crds', // CSG/CRDS
  
  // Wealth tax
  IFI = 'ifi', // Impôt sur la Fortune Immobilière
  
  // Other
  CAPITAL_GAINS_TAX = 'capital_gains_tax', // Plus-values
  WITHHOLDING_TAX = 'withholding_tax', // Prélèvement à la source
}

export enum TaxStatus {
  DRAFT = 'draft',
  PENDING_VALIDATION = 'pending_validation',
  VALIDATED = 'validated',
  SUBMITTED = 'submitted',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  AMENDED = 'amended',
}

export enum PaymentStatus {
  NOT_DUE = 'not_due',
  DUE = 'due',
  OVERDUE = 'overdue',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
}

export interface TaxCalculation {
  id: string;
  sciId: string;
  year: number;
  
  // Income
  rentalIncome: number;
  otherIncome: number;
  totalIncome: number;
  
  // Deductible expenses
  maintenanceExpenses: number;
  managementFees: number;
  insurancePremiums: number;
  propertyTax: number;
  interestExpenses: number;
  depreciation: number;
  otherDeductions: number;
  totalDeductions: number;
  
  // Net income
  netIncome: number;
  
  // Tax breakdown
  incomeTax: number;
  socialContributions: number;
  csgCrds: number;
  totalTax: number;
  
  // Rates applied
  incomeTaxRate: number;
  socialContributionRate: number;
  
  calculatedAt: Date;
  calculatedBy: string;
}

export interface TaxOptimization {
  id: string;
  sciId: string;
  year: number;
  
  // Current situation
  currentTaxLiability: number;
  
  // Optimization suggestions
  suggestions: Array<{
    type: OptimizationType;
    description: string;
    potentialSavings: number;
    complexity: 'low' | 'medium' | 'high';
    legalRisk: 'low' | 'medium' | 'high';
    requirements: string[];
    deadline?: Date;
  }>;
  
  // Total potential savings
  totalPotentialSavings: number;
  
  generatedAt: Date;
}

export enum OptimizationType {
  EXPENSE_DEDUCTION = 'expense_deduction',
  DEPRECIATION_OPTIMIZATION = 'depreciation_optimization',
  TAX_REGIME_CHANGE = 'tax_regime_change',
  COST_RESTRUCTURING = 'cost_restructuring',
  TIMING_OPTIMIZATION = 'timing_optimization',
  LEGAL_STRUCTURE = 'legal_structure',
}

export interface TaxDeadline {
  id: string;
  type: TaxDeclarationType;
  year: number;
  description: string;
  dueDate: Date;
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  penalties?: {
    lateFilingPenalty: number;
    latePaymentPenalty: number;
    interestRate: number;
  };
}

export interface TaxAudit {
  id: string;
  tenantId: string;
  sciId: string;
  
  type: 'preliminary' | 'desk_audit' | 'field_audit';
  status: 'initiated' | 'in_progress' | 'pending_response' | 'closed';
  
  // Audit details
  taxYears: number[];
  initiatedBy: string;
  initiatedAt: Date;
  reference: string;
  
  // Findings
  findings: Array<{
    issue: string;
    amount: number;
    severity: 'info' | 'warning' | 'critical';
    response?: string;
  }>;
  
  // Documents
  requestedDocuments: string[];
  providedDocuments: string[];
  
  // Resolution
  additionalTaxAssessed?: number;
  penaltiesAssessed?: number;
  settlementAmount?: number;
  closedAt?: Date;
}

// Helper functions
export function getTaxRate(taxType: TaxDeclarationType, income: number): number {
  // Simplified tax rate calculation
  // TODO: Implement actual French tax brackets
  switch (taxType) {
    case TaxDeclarationType.INCOME_TAX:
      if (income <= 10000) return 0;
      if (income <= 27000) return 0.11;
      if (income <= 74000) return 0.30;
      return 0.41;
    
    case TaxDeclarationType.CORPORATE_TAX:
      return income <= 38120 ? 0.15 : 0.25;
    
    case TaxDeclarationType.SOCIAL_CONTRIBUTIONS:
      return 0.172; // 17.2%
    
    case TaxDeclarationType.CSG_CRDS:
      return 0.172; // CSG 9.2% + CRDS 0.5% + others
    
    default:
      return 0;
  }
}

export function calculateDeadline(taxType: TaxDeclarationType, year: number): Date {
  const deadlines: Record<TaxDeclarationType, { month: number; day: number }> = {
    [TaxDeclarationType.INCOME_TAX]: { month: 4, day: 30 }, // May deadline
    [TaxDeclarationType.CORPORATE_TAX]: { month: 4, day: 15 },
    [TaxDeclarationType.VAT]: { month: 0, day: 20 }, // Monthly/quarterly
    [TaxDeclarationType.PROPERTY_TAX]: { month: 9, day: 15 }, // October
    [TaxDeclarationType.HOUSING_TAX]: { month: 10, day: 15 }, // November
    [TaxDeclarationType.SOCIAL_CONTRIBUTIONS]: { month: 4, day: 30 },
    [TaxDeclarationType.CSG_CRDS]: { month: 4, day: 30 },
    [TaxDeclarationType.IFI]: { month: 5, day: 15 }, // June
    [TaxDeclarationType.CAPITAL_GAINS_TAX]: { month: 4, day: 30 },
    [TaxDeclarationType.WITHHOLDING_TAX]: { month: 0, day: 15 },
  };
  
  const deadline = deadlines[taxType] || { month: 11, day: 31 };
  return new Date(year + 1, deadline.month, deadline.day);
}
