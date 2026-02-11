/**
 * Goal controller: HTTP handlers for goals.
 */

import type { Request, Response } from 'express';
import * as goalService from '../services/goalService';

export const listHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const goals = await goalService.listGoals(userId);
    res.status(200).json(goals);
  } catch (err) {
    console.error('listGoals error:', err);
    res.status(500).json({ error: 'Failed to list goals' });
  }
};

export const createHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { name, targetAmount, target_amount, currentAmount, current_amount, deadline } =
    req.body ?? {};

  const target = targetAmount ?? target_amount;
  const current = currentAmount ?? current_amount;

  if (!name || typeof name !== 'string' || target === undefined || target === null) {
    res.status(400).json({ error: 'name and targetAmount are required' });
    return;
  }

  const targetNum = Number(target);
  const currentNum = current !== undefined ? Number(current) : 0;
  if (Number.isNaN(targetNum) || targetNum < 0) {
    res.status(400).json({ error: 'Invalid targetAmount' });
    return;
  }
  if (Number.isNaN(currentNum) || currentNum < 0) {
    res.status(400).json({ error: 'Invalid currentAmount' });
    return;
  }

  const deadlineVal =
    deadline != null && typeof deadline === 'string' && deadline.trim() !== ''
      ? deadline.trim()
      : null;
  if (deadlineVal && !/^\d{4}-\d{2}-\d{2}$/.test(deadlineVal)) {
    res.status(400).json({ error: 'deadline must be YYYY-MM-DD' });
    return;
  }

  try {
    const goal = await goalService.createGoal(userId, {
      name,
      targetAmount: targetNum,
      currentAmount: currentNum,
      deadline: deadlineVal,
    });
    res.status(201).json(goal);
  } catch (err) {
    console.error('createGoal error:', err);
    res.status(500).json({ error: 'Failed to create goal' });
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
    res.status(400).json({ error: 'Invalid goal id' });
    return;
  }
  try {
    const goal = await goalService.getGoalById(id, userId);
    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }
    res.status(200).json(goal);
  } catch (err) {
    console.error('getGoalById error:', err);
    res.status(500).json({ error: 'Failed to get goal' });
  }
};
