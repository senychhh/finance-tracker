/**
 * Goal repository: data access for goals table.
 */

import { dbPool } from '../config/db';
import type { Goal, CreateGoal } from '../types';

type GoalRow = {
  id: number;
  user_id: number;
  name: string;
  target_amount: number | string;
  current_amount: number | string;
  deadline: string | Date | null;
  created_at: Date | string;
};

const mapRowToGoal = (row: GoalRow): Goal => ({
  id: row.id,
  user_id: row.user_id,
  name: row.name,
  target_amount: Number(row.target_amount),
  current_amount: Number(row.current_amount),
  deadline:
    row.deadline === null
      ? null
      : row.deadline instanceof Date
        ? row.deadline.toISOString().slice(0, 10)
        : row.deadline,
  created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});

export const createGoal = async (input: CreateGoal): Promise<Goal> => {
  const { user_id, name, target_amount, current_amount = 0, deadline = null } = input;

  const result = await dbPool.query<GoalRow>(
    `INSERT INTO goals (user_id, name, target_amount, current_amount, deadline)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, name, target_amount, current_amount, deadline, created_at`,
    [user_id, name, target_amount, current_amount, deadline]
  );

  if (result.rows.length === 0) {
    throw new Error('createGoal: INSERT did not return a row');
  }

  return mapRowToGoal(result.rows[0]);
};

export const findGoalById = async (
  id: number,
  userId: number
): Promise<Goal | null> => {
  const result = await dbPool.query<GoalRow>(
    `SELECT id, user_id, name, target_amount, current_amount, deadline, created_at
     FROM goals
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (result.rows.length === 0) return null;
  return mapRowToGoal(result.rows[0]);
};

export const listGoalsByUserId = async (userId: number): Promise<Goal[]> => {
  const result = await dbPool.query<GoalRow>(
    `SELECT id, user_id, name, target_amount, current_amount, deadline, created_at
     FROM goals
     WHERE user_id = $1
     ORDER BY id`,
    [userId]
  );

  return result.rows.map(mapRowToGoal);
};

