/**
 * RecurringTransaction controller: HTTP handlers for recurring transactions.
 */

import type { Request, Response } from 'express';
import * as recurringTransactionService from '../services/recurringTransactionService';

export const listHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const items = await recurringTransactionService.listRecurringTransactions(userId);
    res.status(200).json(items);
  } catch (err) {
    console.error('listRecurringTransactions error:', err);
    res.status(500).json({ error: 'Failed to list recurring transactions' });
  }
};

export const createHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const {
    accountId,
    categoryId,
    amount,
    note,
    frequency,
    startDate,
    start_date,
    nextRunDate,
    next_run_date,
    endDate,
    end_date,
  } = req.body ?? {};

  const start = startDate ?? start_date;
  const next = nextRunDate ?? next_run_date;
  const end = endDate ?? end_date;

  if (
    accountId === undefined ||
    accountId === null ||
    amount === undefined ||
    amount === null ||
    !frequency ||
    typeof frequency !== 'string' ||
    !start ||
    typeof start !== 'string' ||
    !next ||
    typeof next !== 'string'
  ) {
    res.status(400).json({
      error:
        'accountId, amount, frequency, startDate, and nextRunDate are required',
    });
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

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start.trim()) || !dateRegex.test(next.trim())) {
    res.status(400).json({ error: 'startDate and nextRunDate must be YYYY-MM-DD' });
    return;
  }

  const categoryIdVal =
    categoryId != null && !Number.isNaN(Number(categoryId))
      ? Number(categoryId)
      : null;
  const endDateVal =
    end != null && typeof end === 'string' && end.trim() !== ''
      ? end.trim()
      : null;
  if (endDateVal && !dateRegex.test(endDateVal)) {
    res.status(400).json({ error: 'endDate must be YYYY-MM-DD' });
    return;
  }

  try {
    const item = await recurringTransactionService.createRecurringTransaction(
      userId,
      {
        accountId: accountIdNum,
        categoryId: categoryIdVal,
        amount: amountNum,
        note: note != null ? String(note) : null,
        frequency: frequency.trim(),
        startDate: start.trim(),
        nextRunDate: next.trim(),
        endDate: endDateVal,
      }
    );
    res.status(201).json(item);
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
    console.error('createRecurringTransaction error:', err);
    res.status(500).json({ error: 'Failed to create recurring transaction' });
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
    res.status(400).json({ error: 'Invalid recurring transaction id' });
    return;
  }
  try {
    const item = await recurringTransactionService.getRecurringTransactionById(
      id,
      userId
    );
    if (!item) {
      res.status(404).json({ error: 'Recurring transaction not found' });
      return;
    }
    res.status(200).json(item);
  } catch (err) {
    console.error('getRecurringTransactionById error:', err);
    res.status(500).json({ error: 'Failed to get recurring transaction' });
  }
};
