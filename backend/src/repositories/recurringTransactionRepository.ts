/**
 * RecurringTransaction repository: data access for recurring_transactions table.
 */

import { dbPool } from '../config/db';
import type { RecurringTransaction, CreateRecurringTransaction } from '../types';

type RecurringTransactionRow = {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number | null;
  amount: number | string;
  note: string | null;
  frequency: string;
  start_date: string | Date;
  next_run_date: string | Date;
  end_date: string | Date | null;
  created_at: Date | string;
};

const toDateOnly = (value: string | Date | null): string | null => {
  if (value === null) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
};

const mapRowToRecurringTransaction = (row: RecurringTransactionRow): RecurringTransaction => ({
  id: row.id,
  user_id: row.user_id,
  account_id: row.account_id,
  category_id: row.category_id,
  amount: Number(row.amount),
  note: row.note,
  frequency: row.frequency,
  start_date: toDateOnly(row.start_date)!,
  next_run_date: toDateOnly(row.next_run_date)!,
  end_date: toDateOnly(row.end_date),
  created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});

export const createRecurringTransaction = async (
  input: CreateRecurringTransaction
): Promise<RecurringTransaction> => {
  const {
    user_id,
    account_id,
    category_id,
    amount,
    note = null,
    frequency,
    start_date,
    next_run_date,
    end_date = null,
  } = input;

  const result = await dbPool.query<RecurringTransactionRow>(
    `INSERT INTO recurring_transactions (
       user_id, account_id, category_id, amount, note, frequency, start_date, next_run_date, end_date
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, user_id, account_id, category_id, amount, note, frequency,
               start_date, next_run_date, end_date, created_at`,
    [
      user_id,
      account_id,
      category_id ?? null,
      amount,
      note,
      frequency,
      start_date,
      next_run_date,
      end_date,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error('createRecurringTransaction: INSERT did not return a row');
  }

  return mapRowToRecurringTransaction(result.rows[0]);
};

export const findRecurringTransactionById = async (
  id: number,
  userId: number
): Promise<RecurringTransaction | null> => {
  const result = await dbPool.query<RecurringTransactionRow>(
    `SELECT id, user_id, account_id, category_id, amount, note, frequency,
            start_date, next_run_date, end_date, created_at
     FROM recurring_transactions
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (result.rows.length === 0) return null;
  return mapRowToRecurringTransaction(result.rows[0]);
};

export const listRecurringTransactionsByUserId = async (
  userId: number
): Promise<RecurringTransaction[]> => {
  const result = await dbPool.query<RecurringTransactionRow>(
    `SELECT id, user_id, account_id, category_id, amount, note, frequency,
            start_date, next_run_date, end_date, created_at
     FROM recurring_transactions
     WHERE user_id = $1
     ORDER BY next_run_date ASC, id ASC`,
    [userId]
  );

  return result.rows.map(mapRowToRecurringTransaction);
};

