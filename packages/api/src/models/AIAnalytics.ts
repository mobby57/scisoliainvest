/**
 * AI Analytics Model - For predictive insights and recommendations
 */

export interface AIInsight {
  id: string;
  tenantId: string;
  propertyId?: string;
  sciId?: string;
  
  // Insight details
  type: InsightType;
  category: InsightCategory;
  title: string;
  description: string;
  
  // AI prediction
  confidence: number; // 0-1
  prediction: string;
  recommendedAction: string;
  priority: InsightPriority;
  
  // Impact
  potentialSavings?: number;
  potentialRevenue?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  
  // Data source
  dataSource: string[];
  modelUsed: string;
  modelVersion: string;
  
  // Status
  status: InsightStatus;
  actionTaken?: string;
  actionTakenBy?: string;
  actionTakenAt?: Date;
  
  // Metadata
  tags: string[];
  validUntil?: Date;
  generatedAt: Date;
  createdAt: Date;
}

export enum InsightType {
  // Maintenance
  MAINTENANCE_PREDICTION = 'maintenance_prediction',
  EQUIPMENT_FAILURE = 'equipment_failure',
  PREVENTIVE_MAINTENANCE = 'preventive_maintenance',
  
  // Financial
  RENT_OPTIMIZATION = 'rent_optimization',
  COST_REDUCTION = 'cost_reduction',
  REVENUE_OPPORTUNITY = 'revenue_opportunity',
  BUDGET_FORECAST = 'budget_forecast',
  
  // Energy
  ENERGY_EFFICIENCY = 'energy_efficiency',
  ENERGY_CONSUMPTION_ANOMALY = 'energy_consumption_anomaly',
  SUSTAINABILITY_IMPROVEMENT = 'sustainability_improvement',
  
  // Occupancy
  OCCUPANCY_PREDICTION = 'occupancy_prediction',
  VACANCY_RISK = 'vacancy_risk',
  TENANT_RETENTION = 'tenant_retention',
  
  // Market
  MARKET_TREND = 'market_trend',
  PROPERTY_VALUATION = 'property_valuation',
  INVESTMENT_OPPORTUNITY = 'investment_opportunity',
  
  // Risk
  RISK_ASSESSMENT = 'risk_assessment',
  COMPLIANCE_RISK = 'compliance_risk',
  FINANCIAL_RISK = 'financial_risk',
}

export enum InsightCategory {
  MAINTENANCE = 'maintenance',
  FINANCIAL = 'financial',
  ENERGY = 'energy',
  OCCUPANCY = 'occupancy',
  MARKET = 'market',
  RISK = 'risk',
  SUSTAINABILITY = 'sustainability',
}

export enum InsightPriority {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum InsightStatus {
  NEW = 'new',
  REVIEWED = 'reviewed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISMISSED = 'dismissed',
  EXPIRED = 'expired',
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: ModelType;
  version: string;
  
  // Model details
  algorithm: string;
  framework: 'tensorflow' | 'pytorch' | 'scikit-learn' | 'aws-sagemaker';
  
  // Performance
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  
  // Training
  trainedOn: Date;
  trainingDataSize: number;
  features: string[];
  
  // Deployment
  status: 'active' | 'inactive' | 'training' | 'deprecated';
  endpoint?: string;
  
  // Metadata
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ModelType {
  MAINTENANCE_PREDICTION = 'maintenance_prediction',
  RENT_PREDICTION = 'rent_prediction',
  ENERGY_FORECAST = 'energy_forecast',
  OCCUPANCY_FORECAST = 'occupancy_forecast',
  ANOMALY_DETECTION = 'anomaly_detection',
  PROPERTY_VALUATION = 'property_valuation',
  RISK_ASSESSMENT = 'risk_assessment',
}

export interface AIAnalyticsRequest {
  tenantId: string;
  propertyId?: string;
  sciId?: string;
  analysisType: AnalysisType;
  timeframe: {
    start: Date;
    end: Date;
  };
  parameters?: Record<string, any>;
}

export enum AnalysisType {
  PROPERTY_PERFORMANCE = 'property_performance',
  ENERGY_ANALYSIS = 'energy_analysis',
  FINANCIAL_FORECAST = 'financial_forecast',
  MAINTENANCE_SCHEDULE = 'maintenance_schedule',
  MARKET_COMPARISON = 'market_comparison',
  PORTFOLIO_OPTIMIZATION = 'portfolio_optimization',
  RISK_ANALYSIS = 'risk_analysis',
}

export interface AIAnalyticsReport {
  id: string;
  tenantId: string;
  analysisType: AnalysisType;
  
  // Results
  summary: string;
  insights: AIInsight[];
  metrics: Record<string, number>;
  charts: ChartData[];
  
  // Recommendations
  recommendations: Recommendation[];
  
  // Metadata
  generatedAt: Date;
  generatedBy: string; // model name or user
  dataSource: string[];
  confidence: number;
}

export interface Recommendation {
  title: string;
  description: string;
  category: string;
  priority: InsightPriority;
  estimatedImpact: {
    savings?: number;
    revenue?: number;
    timeframe: string;
  };
  steps: string[];
  resources?: string[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  data: any;
  xAxis?: string;
  yAxis?: string;
}

export interface PropertyPrediction {
  propertyId: string;
  predictionType: PredictionType;
  
  // Prediction
  predictedValue: number;
  unit: string;
  confidence: number;
  
  // Time
  predictedFor: Date;
  validFrom: Date;
  validUntil: Date;
  
  // Context
  factors: Array<{
    name: string;
    impact: number; // -1 to 1
    description: string;
  }>;
  
  // Historical
  historicalAverage: number;
  historicalTrend: 'increasing' | 'decreasing' | 'stable';
  
  generatedAt: Date;
}

export enum PredictionType {
  MAINTENANCE_COST = 'maintenance_cost',
  ENERGY_COST = 'energy_cost',
  RENTAL_INCOME = 'rental_income',
  OCCUPANCY_RATE = 'occupancy_rate',
  PROPERTY_VALUE = 'property_value',
  OPERATING_COST = 'operating_cost',
}

// Helper functions
export function getInsightIcon(type: InsightType): string {
  const icons: Partial<Record<InsightType, string>> = {
    [InsightType.MAINTENANCE_PREDICTION]: '🔧',
    [InsightType.EQUIPMENT_FAILURE]: '⚠️',
    [InsightType.RENT_OPTIMIZATION]: '💰',
    [InsightType.ENERGY_EFFICIENCY]: '⚡',
    [InsightType.OCCUPANCY_PREDICTION]: '👥',
    [InsightType.MARKET_TREND]: '📈',
    [InsightType.RISK_ASSESSMENT]: '🛡️',
  };
  return icons[type] || '💡';
}

export function getPriorityColor(priority: InsightPriority): string {
  const colors: Record<InsightPriority, string> = {
    [InsightPriority.INFO]: 'blue',
    [InsightPriority.LOW]: 'green',
    [InsightPriority.MEDIUM]: 'yellow',
    [InsightPriority.HIGH]: 'orange',
    [InsightPriority.CRITICAL]: 'red',
  };
  return colors[priority];
}
