/**
 * Budget controller: HTTP handlers for budgets.
 */

import type { Request, Response } from 'express';
import * as budgetService from '../services/budgetService';

export const listHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const budgets = await budgetService.listBudgets(userId);
    res.status(200).json(budgets);
  } catch (err) {
    console.error('listBudgets error:', err);
    res.status(500).json({ error: 'Failed to list budgets' });
  }
};

export const createHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { categoryId, periodDate, period_date, amount } = req.body ?? {};
  const catId = categoryId;
  const period = periodDate ?? period_date;
  if (
    catId === undefined ||
    catId === null ||
    !period ||
    typeof period !== 'string' ||
    amount === undefined ||
    amount === null
  ) {
    res.status(400).json({ error: 'categoryId, periodDate, and amount are required' });
    return;
  }
  const categoryIdNum = Number(catId);
  const amountNum = Number(amount);
  if (Number.isNaN(categoryIdNum) || categoryIdNum < 1) {
    res.status(400).json({ error: 'Invalid categoryId' });
    return;
  }
  if (Number.isNaN(amountNum) || amountNum < 0) {
    res.status(400).json({ error: 'Invalid amount' });
    return;
  }
  const periodStr = period.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(periodStr)) {
    res.status(400).json({ error: 'periodDate must be in YYYY-MM-DD format' });
    return;
  }
  try {
    const budget = await budgetService.createBudget(userId, {
      categoryId: categoryIdNum,
      periodDate: periodStr,
      amount: amountNum,
    });
    res.status(201).json(budget);
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (message === 'CATEGORY_NOT_FOUND') {
      res.status(400).json({ error: 'Category not found' });
      return;
    }
    console.error('createBudget error:', err);
    res.status(500).json({ error: 'Failed to create budget' });
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
    res.status(400).json({ error: 'Invalid budget id' });
    return;
  }
  try {
    const budget = await budgetService.getBudgetById(id, userId);
    if (!budget) {
      res.status(404).json({ error: 'Budget not found' });
      return;
    }
    res.status(200).json(budget);
  } catch (err) {
    console.error('getBudgetById error:', err);
    res.status(500).json({ error: 'Failed to get budget' });
  }
};
