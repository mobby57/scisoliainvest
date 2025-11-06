import { Request, Response, NextFunction } from 'express';

export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement CSRF protection
  // For now, just pass through
  next();
};
