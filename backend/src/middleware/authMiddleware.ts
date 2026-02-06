/**
 * JWT auth middleware: reads Bearer token, verifies, sets req.userId. Returns 401 on error.
 */

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

type JwtPayload = { userId: number };

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or invalid' });
    return;
  }
  const token = header.slice(7).trim();
  if (!token) {
    res.status(401).json({ error: 'Token missing' });
    return;
  }
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    if (typeof decoded.userId !== 'number') {
      res.status(401).json({ error: 'Invalid token payload' });
      return;
    }
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
