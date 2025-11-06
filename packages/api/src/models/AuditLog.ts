/**
 * Audit Log Model - For tracking all system actions for compliance and security
 * Uses MongoDB for high-volume audit logging
 */

export interface AuditLog {
  id: string;
  tenantId: string;
  
  // Actor information
  userId?: string;
  userEmail?: string;
  userRole?: string;
  actorType: ActorType;
  
  // Action details
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;
  
  // Resource details
  resourceType: string; // 'user', 'sci', 'property', 'document', etc.
  resourceId?: string;
  resourceName?: string;
  
  // Request details
  method?: string; // HTTP method
  endpoint?: string;
  ipAddress?: string;
  userAgent?: string;
  
  // Changes tracking
  changesBefore?: Record<string, any>;
  changesAfter?: Record<string, any>;
  
  // Result
  status: 'success' | 'failure' | 'error';
  statusCode?: number;
  errorMessage?: string;
  
  // Additional context
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  
  // Session
  sessionId?: string;
  requestId?: string;
  
  // Timing
  duration?: number; // in milliseconds
  timestamp: Date;
  
  // Compliance
  complianceNote?: string;
  retentionUntil?: Date;
}

export enum ActorType {
  USER = 'user',
  SYSTEM = 'system',
  API = 'api',
  CRON = 'cron',
  ADMIN = 'admin',
}

export enum AuditAction {
  // Authentication
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_RESET = 'password_reset',
  PASSWORD_CHANGE = 'password_change',
  
  // CRUD operations
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  RESTORE = 'restore',
  
  // Permissions
  GRANT_ACCESS = 'grant_access',
  REVOKE_ACCESS = 'revoke_access',
  PERMISSION_CHANGE = 'permission_change',
  
  // Documents
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  VERIFY = 'verify',
  REJECT = 'reject',
  SHARE = 'share',
  
  // Financial
  PAYMENT = 'payment',
  REFUND = 'refund',
  DISTRIBUTION = 'distribution',
  
  // Security
  SECURITY_ALERT = 'security_alert',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  DATA_EXPORT = 'data_export',
  GDPR_REQUEST = 'gdpr_request',
  
  // System
  CONFIGURATION_CHANGE = 'configuration_change',
  SYSTEM_ERROR = 'system_error',
}

export enum AuditCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  DATA_ACCESS = 'data_access',
  DATA_MODIFICATION = 'data_modification',
  SECURITY = 'security',
  FINANCIAL = 'financial',
  COMPLIANCE = 'compliance',
  SYSTEM = 'system',
  USER_MANAGEMENT = 'user_management',
  DOCUMENT_MANAGEMENT = 'document_management',
}

export enum AuditSeverity {
  INFO = 'info',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface CreateAuditLogInput {
  tenantId: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  actorType: ActorType;
  action: AuditAction;
  category: AuditCategory;
  severity: AuditSeverity;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  method?: string;
  endpoint?: string;
  ipAddress?: string;
  userAgent?: string;
  changesBefore?: Record<string, any>;
  changesAfter?: Record<string, any>;
  status: 'success' | 'failure' | 'error';
  statusCode?: number;
  errorMessage?: string;
  description?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  sessionId?: string;
  requestId?: string;
  duration?: number;
}

// Audit search filters
export interface AuditLogFilters {
  tenantId: string;
  userId?: string;
  action?: AuditAction;
  category?: AuditCategory;
  severity?: AuditSeverity;
  resourceType?: string;
  resourceId?: string;
  status?: 'success' | 'failure' | 'error';
  startDate?: Date;
  endDate?: Date;
  ipAddress?: string;
  limit?: number;
  offset?: number;
}

// Helper functions
export function getSeverityForAction(action: AuditAction): AuditSeverity {
  switch (action) {
    case AuditAction.DELETE:
    case AuditAction.GRANT_ACCESS:
    case AuditAction.REVOKE_ACCESS:
    case AuditAction.SECURITY_ALERT:
    case AuditAction.SUSPICIOUS_ACTIVITY:
    case AuditAction.GDPR_REQUEST:
      return AuditSeverity.HIGH;
    
    case AuditAction.PASSWORD_RESET:
    case AuditAction.PERMISSION_CHANGE:
    case AuditAction.DATA_EXPORT:
    case AuditAction.CONFIGURATION_CHANGE:
      return AuditSeverity.MEDIUM;
    
    case AuditAction.LOGIN_FAILED:
    case AuditAction.UPDATE:
    case AuditAction.REJECT:
      return AuditSeverity.LOW;
    
    default:
      return AuditSeverity.INFO;
  }
}

export function getCategoryForAction(action: AuditAction): AuditCategory {
  if ([AuditAction.LOGIN, AuditAction.LOGOUT, AuditAction.LOGIN_FAILED].includes(action)) {
    return AuditCategory.AUTHENTICATION;
  }
  if ([AuditAction.GRANT_ACCESS, AuditAction.REVOKE_ACCESS, AuditAction.PERMISSION_CHANGE].includes(action)) {
    return AuditCategory.AUTHORIZATION;
  }
  if ([AuditAction.UPLOAD, AuditAction.DOWNLOAD, AuditAction.VERIFY, AuditAction.REJECT].includes(action)) {
    return AuditCategory.DOCUMENT_MANAGEMENT;
  }
  if ([AuditAction.PAYMENT, AuditAction.REFUND, AuditAction.DISTRIBUTION].includes(action)) {
    return AuditCategory.FINANCIAL;
  }
  if ([AuditAction.SECURITY_ALERT, AuditAction.SUSPICIOUS_ACTIVITY].includes(action)) {
    return AuditCategory.SECURITY;
  }
  if ([AuditAction.CREATE, AuditAction.UPDATE, AuditAction.DELETE].includes(action)) {
    return AuditCategory.DATA_MODIFICATION;
  }
  return AuditCategory.SYSTEM;
}

// Retention policy helper
export function getRetentionDate(category: AuditCategory): Date {
  const now = new Date();
  switch (category) {
    case AuditCategory.FINANCIAL:
    case AuditCategory.COMPLIANCE:
      // Financial and compliance logs: 7 years
      return new Date(now.setFullYear(now.getFullYear() + 7));
    
    case AuditCategory.SECURITY:
    case AuditCategory.AUTHENTICATION:
      // Security logs: 3 years
      return new Date(now.setFullYear(now.getFullYear() + 3));
    
    default:
      // Other logs: 1 year
      return new Date(now.setFullYear(now.getFullYear() + 1));
  }
}
