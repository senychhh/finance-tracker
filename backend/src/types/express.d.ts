/**
 * Extend Express Request with userId set by authMiddleware.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export {};
