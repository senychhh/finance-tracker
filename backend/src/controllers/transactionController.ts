/**
 * Transaction controller: HTTP handlers for transactions.
 */

import type { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const listHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const transactions = await transactionService.listTransactions(userId);
    res.status(200).json(transactions);
  } catch (err) {
    console.error('listTransactions error:', err);
    res.status(500).json({ error: 'Failed to list transactions' });
  }
};

export const createHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { accountId, categoryId, amount, date, note } = req.body ?? {};
  if (
    accountId === undefined ||
    accountId === null ||
    amount === undefined ||
    amount === null ||
    !date ||
    typeof date !== 'string'
  ) {
    res.status(400).json({ error: 'accountId, amount, and date are required' });
    return;
  }
  const accountIdNum = Number(accountId);
  const amountNum = Number(amount);
  if (Number.isNaN(accountIdNum) || accountIdNum < 1) {
    res.status(400).json({ error: 'Invalid accountId' });
    return;
  }
  if (Number.isNaN(amountNum)) {
    res.status(400).json({ error: 'Invalid amount' });
    return;
  }
  const categoryIdVal =
    categoryId != null ? (Number.isNaN(Number(categoryId)) ? null : Number(categoryId)) : null;
  const dateStr = date.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    res.status(400).json({ error: 'date must be in YYYY-MM-DD format' });
    return;
  }
  try {
    const transaction = await transactionService.createTransaction(userId, {
      accountId: accountIdNum,
      categoryId: categoryIdVal,
      amount: amountNum,
      date: dateStr,
      note: note != null ? String(note) : null,
    });
    res.status(201).json(transaction);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'ACCOUNT_NOT_FOUND') {
      res.status(400).json({ error: 'Account not found' });
      return;
    }
    if (message === 'CATEGORY_NOT_FOUND') {
      res.status(400).json({ error: 'Category not found' });
      return;
    }
    console.error('createTransaction error:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
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
    res.status(400).json({ error: 'Invalid transaction id' });
    return;
  }
  try {
    const transaction = await transactionService.getTransactionById(id, userId);
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.status(200).json(transaction);
  } catch (err) {
    console.error('getTransactionById error:', err);
    res.status(500).json({ error: 'Failed to get transaction' });
  }
};
