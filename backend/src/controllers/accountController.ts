/**
 * Account controller: HTTP handlers for accounts.
 */

import type { Request, Response } from 'express';
import * as accountService from '../services/accountService';

export const listHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const accounts = await accountService.listAccounts(userId);
    res.status(200).json(accounts);
  } catch (err) {
    console.error('listAccounts error:', err);
    res.status(500).json({ error: 'Failed to list accounts' });
  }
};

export const createHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { name, type, balance } = req.body ?? {};
  if (!name || typeof name !== 'string' || !type || typeof type !== 'string') {
    res.status(400).json({ error: 'name and type are required' });
    return;
  }
  const balanceNum = balance !== undefined ? Number(balance) : undefined;
  if (balanceNum !== undefined && (Number.isNaN(balanceNum) || balanceNum < 0)) {
    res.status(400).json({ error: 'balance must be a non-negative number' });
    return;
  }
  try {
    const account = await accountService.createAccount(userId, {
      name,
      type,
      balance: balanceNum,
    });
    res.status(201).json(account);
  } catch (err) {
    console.error('createAccount error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
};

export const getByIdHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'Invalid account id' });
    return;
  }
  try {
    const account = await accountService.getAccountById(id, userId);
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    res.status(200).json(account);
  } catch (err) {
    console.error('getAccountById error:', err);
    res.status(500).json({ error: 'Failed to get account' });
  }
};
