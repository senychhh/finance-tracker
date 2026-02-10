/**
 * Budget repository: data access for budgets table.
 */

import { dbPool } from '../config/db';
import type { Budget, CreateBudget } from '../types';

type BudgetRow = {
  id: number;
  user_id: number;
  category_id: number;
  period_date: string | Date;
  amount: number | string;
  created_at: Date | string;
};

const mapRowToBudget = (row: BudgetRow): Budget => ({
  id: row.id,
  user_id: row.user_id,
  category_id: row.category_id,
  period_date:
    row.period_date instanceof Date
      ? row.period_date.toISOString().slice(0, 10)
      : row.period_date,
  amount: Number(row.amount),
  created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});

export const createBudget = async (input: CreateBudget): Promise<Budget> => {
  const { user_id, category_id, period_date, amount } = input;
  const result = await dbPool.query<BudgetRow>(
    `INSERT INTO budgets (user_id, category_id, period_date, amount)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, category_id, period_date, amount, created_at`,
    [user_id, category_id, period_date, amount]
  );
  if (result.rows.length === 0) {
    throw new Error('createBudget: INSERT did not return a row');
  }
  return mapRowToBudget(result.rows[0]);
};

export const findBudgetById = async (
  id: number,
  userId: number
): Promise<Budget | null> => {
  const result = await dbPool.query<BudgetRow>(
    `SELECT id, user_id, category_id, period_date, amount, created_at
     FROM budgets
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  if (result.rows.length === 0) return null;
  return mapRowToBudget(result.rows[0]);
};

export const listBudgetsByUserId = async (userId: number): Promise<Budget[]> => {
  const result = await dbPool.query<BudgetRow>(
    `SELECT id, user_id, category_id, period_date, amount, created_at
     FROM budgets
     WHERE user_id = $1
     ORDER BY period_date DESC, id DESC`,
    [userId]
  );
  return result.rows.map(mapRowToBudget);
};

