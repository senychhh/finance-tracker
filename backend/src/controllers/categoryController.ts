/**
 * Category controller: HTTP handlers for categories.
 */

import type { Request, Response } from 'express';
import * as categoryService from '../services/categoryService';

export const listHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const categories = await categoryService.listCategories(userId);
    res.status(200).json(categories);
  } catch (err) {
    console.error('listCategories error:', err);
    res.status(500).json({ error: 'Failed to list categories' });
  }
};

export const createHandler = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (userId === undefined) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { name, type } = req.body ?? {};
  if (!name || typeof name !== 'string' || !type || typeof type !== 'string') {
    res.status(400).json({ error: 'name and type are required' });
    return;
  }
  try {
    const category = await categoryService.createCategory(userId, { name, type });
    res.status(201).json(category);
  } catch (err) {
    console.error('createCategory error:', err);
    res.status(500).json({ error: 'Failed to create category' });
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
    res.status(400).json({ error: 'Invalid category id' });
    return;
  }
  try {
    const category = await categoryService.getCategoryById(id, userId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    console.error('getCategoryById error:', err);
    res.status(500).json({ error: 'Failed to get category' });
  }
};
