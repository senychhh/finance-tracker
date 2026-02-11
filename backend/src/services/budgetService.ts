/**
 * Budget service: business logic for budgets.
 */

import type { Budget } from '../types';
import * as budgetRepository from '../repositories/budgetRepository';
import * as categoryRepository from '../repositories/categoryRepository';
import type { CreateBudget } from '../types';

export const createBudget = async (
  userId: number,
  input: { categoryId: number; periodDate: string; amount: number }
): Promise<Budget> => {
  const category = await categoryRepository.findCategoryById(
    input.categoryId,
    userId
  );
  if (!category) {
    throw new Error('CATEGORY_NOT_FOUND');
  }
  const payload: CreateBudget = {
    user_id: userId,
    category_id: input.categoryId,
    period_date: input.periodDate,
    amount: input.amount,
  };
  return budgetRepository.createBudget(payload);
};

export const getBudgetById = async (
  id: number,
  userId: number
): Promise<Budget | null> => {
  return budgetRepository.findBudgetById(id, userId);
};

export const listBudgets = async (userId: number): Promise<Budget[]> => {
  return budgetRepository.listBudgetsByUserId(userId);
};
