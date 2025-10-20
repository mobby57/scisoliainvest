import { Request } from 'express';

export interface AuthUser {
  permissions: string[];
  id: string;
  userId?: string;
  email: string;
  role?: string;
  tenant?: string;
  tenantId?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

