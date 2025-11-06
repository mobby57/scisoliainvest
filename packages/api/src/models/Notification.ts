/**
 * Notification Model - For in-app notifications, emails, and SMS
 * Uses MongoDB for flexible notification storage
 */

export interface Notification {
  id: string;
  userId: string;
  tenantId: string;
  
  // Notification content
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, any>; // Additional metadata
  
  // Notification channels
  channels: NotificationChannel[];
  
  // Status tracking
  status: NotificationStatus;
  readAt?: Date;
  
  // Action link
  actionUrl?: string;
  actionLabel?: string;
  
  // Related entities
  relatedEntityType?: 'sci' | 'property' | 'document' | 'task' | 'user';
  relatedEntityId?: string;
  
  // Delivery tracking
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  retryCount: number;
  
  // Scheduling
  scheduledFor?: Date;
  expiresAt?: Date;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum NotificationType {
  // System notifications
  SYSTEM = 'system',
  ALERT = 'alert',
  WARNING = 'warning',
  INFO = 'info',
  
  // Business notifications
  TASK_ASSIGNED = 'task_assigned',
  TASK_DUE = 'task_due',
  TASK_COMPLETED = 'task_completed',
  
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_VERIFIED = 'document_verified',
  DOCUMENT_REJECTED = 'document_rejected',
  DOCUMENT_EXPIRING = 'document_expiring',
  
  SCI_CREATED = 'sci_created',
  SCI_UPDATED = 'sci_updated',
  PROPERTY_ADDED = 'property_added',
  
  FINANCIAL_DISTRIBUTION = 'financial_distribution',
  PAYMENT_RECEIVED = 'payment_received',
  PAYMENT_DUE = 'payment_due',
  
  KYC_REQUIRED = 'kyc_required',
  KYC_APPROVED = 'kyc_approved',
  KYC_REJECTED = 'kyc_rejected',
  
  // User interactions
  MESSAGE_RECEIVED = 'message_received',
  MENTION = 'mention',
  COMMENT = 'comment',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationChannel {
  IN_APP = 'in_app', // In-app notification
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push', // Push notification
  WEBHOOK = 'webhook',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

export interface CreateNotificationInput {
  userId: string;
  tenantId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  channels: NotificationChannel[];
  data?: Record<string, any>;
  actionUrl?: string;
  actionLabel?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  scheduledFor?: Date;
  expiresAt?: Date;
}

export interface NotificationPreferences {
  userId: string;
  channels: {
    [key in NotificationType]?: NotificationChannel[];
  };
  doNotDisturb: {
    enabled: boolean;
    startTime?: string; // HH:mm format
    endTime?: string;
  };
  emailDigest: {
    enabled: boolean;
    frequency: 'daily' | 'weekly';
    time?: string;
  };
}

// Helper functions
export function getDefaultChannels(type: NotificationType): NotificationChannel[] {
  switch (type) {
    case NotificationType.ALERT:
    case NotificationType.URGENT:
    case NotificationType.KYC_REQUIRED:
      return [NotificationChannel.IN_APP, NotificationChannel.EMAIL, NotificationChannel.PUSH];
    
    case NotificationType.TASK_ASSIGNED:
    case NotificationType.TASK_DUE:
    case NotificationType.PAYMENT_DUE:
      return [NotificationChannel.IN_APP, NotificationChannel.EMAIL];
    
    case NotificationType.MESSAGE_RECEIVED:
    case NotificationType.COMMENT:
      return [NotificationChannel.IN_APP, NotificationChannel.PUSH];
    
    default:
      return [NotificationChannel.IN_APP];
  }
}

export function getPriorityForType(type: NotificationType): NotificationPriority {
  switch (type) {
    case NotificationType.ALERT:
    case NotificationType.KYC_REQUIRED:
    case NotificationType.PAYMENT_DUE:
      return NotificationPriority.URGENT;
    
    case NotificationType.TASK_DUE:
    case NotificationType.DOCUMENT_EXPIRING:
      return NotificationPriority.HIGH;
    
    case NotificationType.TASK_ASSIGNED:
    case NotificationType.DOCUMENT_UPLOADED:
      return NotificationPriority.MEDIUM;
    
    default:
      return NotificationPriority.LOW;
  }
}
