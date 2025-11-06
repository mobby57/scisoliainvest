/**
 * Accounting Model - For accounting records, financial statements, and reporting
 */

export interface AccountingEntry {
  id: string;
  tenantId: string;
  sciId: string;
  
  // Entry details
  date: Date;
  reference: string;
  description: string;
  
  // Journal
  journalType: JournalType;
  
  // Transactions (double entry)
  lines: AccountingLine[];
  
  // Validation
  status: EntryStatus;
  validatedBy?: string;
  validatedAt?: Date;
  
  // Documents
  supportingDocuments: string[];
  
  // Period
  fiscalYear: number;
  period: number; // Month (1-12)
  
  // Audit
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountingLine {
  id: string;
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  label: string;
}

export enum JournalType {
  PURCHASE = 'purchase', // Achats
  SALES = 'sales', // Ventes
  BANK = 'bank', // Banque
  CASH = 'cash', // Caisse
  OD = 'od', // Opérations diverses
  PAYROLL = 'payroll', // Paie
}

export enum EntryStatus {
  DRAFT = 'draft',
  PENDING_VALIDATION = 'pending_validation',
  VALIDATED = 'validated',
  POSTED = 'posted',
  CANCELLED = 'cancelled',
}

export interface ChartOfAccounts {
  id: string;
  sciId: string;
  
  accounts: Account[];
  
  updatedAt: Date;
}

export interface Account {
  number: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  balance: number;
  parent?: string;
  isActive: boolean;
}

export enum AccountType {
  ASSET = 'asset', // Actif
  LIABILITY = 'liability', // Passif
  EQUITY = 'equity', // Capitaux propres
  REVENUE = 'revenue', // Produits
  EXPENSE = 'expense', // Charges
}

export enum AccountCategory {
  // Assets (Classes 1-3)
  FIXED_ASSETS = 'fixed_assets', // Immobilisations
  CURRENT_ASSETS = 'current_assets', // Actif circulant
  CASH = 'cash', // Trésorerie
  
  // Liabilities (Classes 4-5)
  EQUITY_CAPITAL = 'equity_capital', // Capital
  LONG_TERM_DEBT = 'long_term_debt', // Dettes long terme
  SHORT_TERM_DEBT = 'short_term_debt', // Dettes court terme
  
  // Income/Expenses (Classes 6-7)
  OPERATING_REVENUE = 'operating_revenue', // Produits exploitation
  FINANCIAL_REVENUE = 'financial_revenue', // Produits financiers
  OPERATING_EXPENSES = 'operating_expenses', // Charges exploitation
  FINANCIAL_EXPENSES = 'financial_expenses', // Charges financières
}

export interface BalanceSheet {
  id: string;
  sciId: string;
  
  // Period
  date: Date;
  fiscalYear: number;
  
  // Assets
  assets: {
    fixedAssets: number;
    currentAssets: number;
    cash: number;
    totalAssets: number;
  };
  
  // Liabilities
  liabilities: {
    equity: number;
    longTermDebt: number;
    shortTermDebt: number;
    totalLiabilities: number;
  };
  
  // Detailed breakdown
  details: {
    assets: AccountBalance[];
    liabilities: AccountBalance[];
  };
  
  generatedAt: Date;
}

export interface IncomeStatement {
  id: string;
  sciId: string;
  
  // Period
  startDate: Date;
  endDate: Date;
  fiscalYear: number;
  
  // Revenue
  revenue: {
    rentalIncome: number;
    otherIncome: number;
    totalRevenue: number;
  };
  
  // Expenses
  expenses: {
    operatingExpenses: number;
    maintenanceExpenses: number;
    financialExpenses: number;
    depreciation: number;
    taxes: number;
    otherExpenses: number;
    totalExpenses: number;
  };
  
  // Results
  operatingProfit: number;
  netProfit: number;
  
  // Detailed breakdown
  details: {
    revenue: AccountBalance[];
    expenses: AccountBalance[];
  };
  
  generatedAt: Date;
}

export interface AccountBalance {
  accountNumber: string;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CashFlowStatement {
  id: string;
  sciId: string;
  
  // Period
  startDate: Date;
  endDate: Date;
  fiscalYear: number;
  
  // Operating activities
  operatingCashFlow: {
    netIncome: number;
    depreciation: number;
    changeInReceivables: number;
    changeInPayables: number;
    other: number;
    total: number;
  };
  
  // Investing activities
  investingCashFlow: {
    propertyPurchases: number;
    propertySales: number;
    other: number;
    total: number;
  };
  
  // Financing activities
  financingCashFlow: {
    capitalIncrease: number;
    distributions: number;
    loanProceeds: number;
    loanRepayments: number;
    other: number;
    total: number;
  };
  
  // Net change
  netCashChange: number;
  beginningCash: number;
  endingCash: number;
  
  generatedAt: Date;
}

export interface FinancialRatio {
  id: string;
  sciId: string;
  fiscalYear: number;
  
  // Liquidity ratios
  currentRatio: number;
  quickRatio: number;
  
  // Profitability ratios
  returnOnAssets: number; // ROA
  returnOnEquity: number; // ROE
  netProfitMargin: number;
  
  // Leverage ratios
  debtToEquity: number;
  debtToAssets: number;
  interestCoverage: number;
  
  // Efficiency ratios
  assetTurnover: number;
  
  calculatedAt: Date;
}

export interface AccountingPeriod {
  id: string;
  sciId: string;
  
  fiscalYear: number;
  startDate: Date;
  endDate: Date;
  
  status: 'open' | 'closed' | 'archived';
  
  // Totals
  totalRevenue: number;
  totalExpenses: number;
  netResult: number;
  
  // Closing
  closedBy?: string;
  closedAt?: Date;
}

export interface AccountingReport {
  id: string;
  sciId: string;
  
  type: ReportType;
  period: {
    start: Date;
    end: Date;
  };
  
  // Report data
  balanceSheet?: BalanceSheet;
  incomeStatement?: IncomeStatement;
  cashFlowStatement?: CashFlowStatement;
  ratios?: FinancialRatio;
  
  // Format
  format: 'pdf' | 'excel' | 'json';
  documentId?: string;
  
  generatedBy: string;
  generatedAt: Date;
}

export enum ReportType {
  BALANCE_SHEET = 'balance_sheet', // Bilan
  INCOME_STATEMENT = 'income_statement', // Compte de résultat
  CASH_FLOW = 'cash_flow', // Tableau de flux
  TRIAL_BALANCE = 'trial_balance', // Balance
  GENERAL_LEDGER = 'general_ledger', // Grand livre
  JOURNAL = 'journal', // Journal
  TAX_REPORT = 'tax_report', // Liasse fiscale
  MANAGEMENT_REPORT = 'management_report', // Rapport de gestion
}

// Helper functions
export function calculateBalance(lines: AccountingLine[]): boolean {
  const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
  const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);
  return Math.abs(totalDebit - totalCredit) < 0.01; // Allow for rounding errors
}

export function getAccountType(accountNumber: string): AccountType {
  const firstDigit = accountNumber.charAt(0);
  switch (firstDigit) {
    case '1':
    case '2':
      return AccountType.ASSET;
    case '4':
    case '5':
      return AccountType.LIABILITY;
    case '3':
      return AccountType.EQUITY;
    case '7':
      return AccountType.REVENUE;
    case '6':
      return AccountType.EXPENSE;
    default:
      return AccountType.ASSET;
  }
}

export function calculateRatios(balanceSheet: BalanceSheet, incomeStatement: IncomeStatement): FinancialRatio {
  const { assets, liabilities } = balanceSheet;
  const { operatingProfit, netProfit } = incomeStatement;
  
  return {
    id: '',
    sciId: balanceSheet.sciId,
    fiscalYear: balanceSheet.fiscalYear,
    currentRatio: assets.currentAssets / liabilities.shortTermDebt || 0,
    quickRatio: (assets.currentAssets - assets.fixedAssets) / liabilities.shortTermDebt || 0,
    returnOnAssets: netProfit / assets.totalAssets || 0,
    returnOnEquity: netProfit / liabilities.equity || 0,
    netProfitMargin: netProfit / incomeStatement.revenue.totalRevenue || 0,
    debtToEquity: (liabilities.longTermDebt + liabilities.shortTermDebt) / liabilities.equity || 0,
    debtToAssets: (liabilities.longTermDebt + liabilities.shortTermDebt) / assets.totalAssets || 0,
    interestCoverage: operatingProfit / incomeStatement.expenses.financialExpenses || 0,
    assetTurnover: incomeStatement.revenue.totalRevenue / assets.totalAssets || 0,
    calculatedAt: new Date(),
  };
}
