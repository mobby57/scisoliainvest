/**
 * Document Model - For storing user documents, KYC files, contracts, etc.
 * Uses MongoDB for flexible document storage
 */

export interface Document {
  id: string;
  userId: string;
  tenantId: string;
  sciId?: string; // Optional link to SCI
  propertyId?: string; // Optional link to Property
  
  // Document metadata
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  mimeType: string;
  size: number; // in bytes
  
  // Storage
  storageProvider: 'local' | 's3' | 'azure';
  storagePath: string;
  url?: string;
  
  // Verification & Security
  status: DocumentStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  checksum?: string; // For integrity verification
  encrypted?: boolean;
  
  // Metadata
  tags: string[];
  description?: string;
  expiryDate?: Date; // For documents with expiration
  
  // Audit
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export enum DocumentType {
  IDENTITY = 'identity', // ID card, passport
  KYC = 'kyc', // KYC documents
  CONTRACT = 'contract', // Legal contracts
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  TAX = 'tax', // Tax documents
  DIAGNOSTIC = 'diagnostic', // Property diagnostics
  LEGAL = 'legal', // Legal documents
  FINANCIAL = 'financial',
  OTHER = 'other',
}

export enum DocumentCategory {
  PERSONAL = 'personal',
  SCI = 'sci',
  PROPERTY = 'property',
  FINANCIAL = 'financial',
  LEGAL = 'legal',
  TAX = 'tax',
  ADMINISTRATIVE = 'administrative',
}

export enum DocumentStatus {
  PENDING = 'pending', // Uploaded, waiting verification
  VERIFIED = 'verified', // Verified by admin
  REJECTED = 'rejected', // Rejected with reason
  EXPIRED = 'expired', // Document expired
  ARCHIVED = 'archived',
}

export interface CreateDocumentInput {
  userId: string;
  tenantId: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  mimeType: string;
  size: number;
  storageProvider: 'local' | 's3' | 'azure';
  storagePath: string;
  tags?: string[];
  description?: string;
  sciId?: string;
  propertyId?: string;
}

export interface UpdateDocumentInput {
  name?: string;
  tags?: string[];
  description?: string;
  status?: DocumentStatus;
}

// Document validation helpers
export function isValidDocumentType(type: string): type is DocumentType {
  return Object.values(DocumentType).includes(type as DocumentType);
}

export function isValidDocumentCategory(category: string): category is DocumentCategory {
  return Object.values(DocumentCategory).includes(category as DocumentCategory);
}

export function getMaxFileSize(type: DocumentType): number {
  // Return max file size in bytes
  switch (type) {
    case DocumentType.IDENTITY:
    case DocumentType.KYC:
      return 10 * 1024 * 1024; // 10MB
    case DocumentType.CONTRACT:
    case DocumentType.LEGAL:
      return 50 * 1024 * 1024; // 50MB
    case DocumentType.DIAGNOSTIC:
      return 100 * 1024 * 1024; // 100MB
    default:
      return 25 * 1024 * 1024; // 25MB
  }
}

export function getAllowedMimeTypes(type: DocumentType): string[] {
  switch (type) {
    case DocumentType.IDENTITY:
    case DocumentType.KYC:
      return ['image/jpeg', 'image/png', 'application/pdf'];
    case DocumentType.CONTRACT:
    case DocumentType.LEGAL:
      return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    default:
      return ['application/pdf', 'image/jpeg', 'image/png'];
  }
}
