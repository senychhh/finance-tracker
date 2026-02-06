/**
 * Auth controller: HTTP handlers for register and login.
 */

import type { Request, Response } from 'express';
import * as authService from '../services/authService';

export const registerHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body ?? {};
  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const emailTrimmed = email.trim().toLowerCase();
  if (!emailTrimmed || password.length < 1) {
    res.status(400).json({ error: 'Invalid email or password' });
    return;
  }
  try {
    const user = await authService.register(emailTrimmed, password);
    res.status(201).json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'EMAIL_EXISTS') {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
    }
    console.error('register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body ?? {};
  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }
  const emailTrimmed = (email as string).trim().toLowerCase();
  try {
    const result = await authService.login(emailTrimmed, password);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    console.error('login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
