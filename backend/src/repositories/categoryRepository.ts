/**
 * Category repository: data access for categories table.
 */

import { dbPool } from '../config/db';
import type { Category } from '../types';

type CategoryRow = {
  id: number;
  user_id: number;
  name: string;
  type: string;
  created_at: Date | string;
};

const mapRowToCategory = (row: CategoryRow): Category => ({
  id: row.id,
  user_id: row.user_id,
  name: row.name,
  type: row.type,
  created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});

export type CreateCategoryInput = {
  userId: number;
  name: string;
  type: string;
};

export const createCategory = async (input: CreateCategoryInput): Promise<Category> => {
  const { userId, name, type } = input;
  const result = await dbPool.query<CategoryRow>(
    `INSERT INTO categories (user_id, name, type)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, name, type, created_at`,
    [userId, name, type]
  );
  if (result.rows.length === 0) {
    throw new Error('createCategory: INSERT did not return a row');
  }
  return mapRowToCategory(result.rows[0]);
};

export const findCategoryById = async (
  id: number,
  userId: number
): Promise<Category | null> => {
  const result = await dbPool.query<CategoryRow>(
    `SELECT id, user_id, name, type, created_at
     FROM categories
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  if (result.rows.length === 0) return null;
  return mapRowToCategory(result.rows[0]);
};

export const listCategoriesByUserId = async (userId: number): Promise<Category[]> => {
  const result = await dbPool.query<CategoryRow>(
    `SELECT id, user_id, name, type, created_at
     FROM categories
     WHERE user_id = $1
     ORDER BY id`,
    [userId]
  );
  return result.rows.map(mapRowToCategory);
};

