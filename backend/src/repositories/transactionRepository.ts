/**
 * Transaction repository: data access for transactions table.
 */

import { dbPool } from '../config/db';
import type { Transaction } from '../types';

type TransactionRow = {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number | null;
  amount: number | string;
  date: string | Date;
  note: string | null;
  created_at: Date | string;
};

const mapRowToTransaction = (row: TransactionRow): Transaction => ({
  id: row.id,
  user_id: row.user_id,
  account_id: row.account_id,
  category_id: row.category_id,
  amount: Number(row.amount),
  date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date,
  note: row.note,
  created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});

export type CreateTransactionInput = {
  userId: number;
  accountId: number;
  categoryId?: number | null;
  amount: number;
  date: string; // YYYY-MM-DD
  note?: string | null;
};

export const createTransaction = async (
  input: CreateTransactionInput
): Promise<Transaction> => {
  const { userId, accountId, categoryId = null, amount, date, note = null } = input;
  const result = await dbPool.query<TransactionRow>(
    `INSERT INTO transactions (user_id, account_id, category_id, amount, date, note)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, account_id, category_id, amount, date, note, created_at`,
    [userId, accountId, categoryId, amount, date, note]
  );
  if (result.rows.length === 0) {
    throw new Error('createTransaction: INSERT did not return a row');
  }
  return mapRowToTransaction(result.rows[0]);
};

export const findTransactionById = async (
  id: number,
  userId: number
): Promise<Transaction | null> => {
  const result = await dbPool.query<TransactionRow>(
    `SELECT id, user_id, account_id, category_id, amount, date, note, created_at
     FROM transactions
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  if (result.rows.length === 0) return null;
  return mapRowToTransaction(result.rows[0]);
};

export const listTransactionsByUserId = async (
  userId: number
): Promise<Transaction[]> => {
  const result = await dbPool.query<TransactionRow>(
    `SELECT id, user_id, account_id, category_id, amount, date, note, created_at
     FROM transactions
     WHERE user_id = $1
     ORDER BY date DESC, id DESC`,
    [userId]
  );
  return result.rows.map(mapRowToTransaction);
};

