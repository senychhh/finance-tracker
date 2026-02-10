/**
 * Account repository: data access for accounts table.
 */

import { dbPool } from '../config/db';
import type { Account } from '../types';

type AccountRow = {
  id: number;
  user_id: number;
  name: string;
  type: string;
  balance: number;
  created_at: Date | string;
};

const mapRowToAccount = (row: AccountRow): Account => ({
  id: row.id,
  user_id: row.user_id,
  name: row.name,
  type: row.type,
  balance: Number(row.balance),
  created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});

export type CreateAccountInput = {
  userId: number;
  name: string;
  type: string;
  balance?: number;
};

export const createAccount = async (input: CreateAccountInput): Promise<Account> => {
  const { userId, name, type, balance = 0 } = input;
  const result = await dbPool.query<AccountRow>(
    `INSERT INTO accounts (user_id, name, type, balance)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, name, type, balance, created_at`,
    [userId, name, type, balance]
  );
  if (result.rows.length === 0) {
    throw new Error('createAccount: INSERT did not return a row');
  }
  return mapRowToAccount(result.rows[0]);
};

export const findAccountById = async (
  id: number,
  userId: number
): Promise<Account | null> => {
  const result = await dbPool.query<AccountRow>(
    `SELECT id, user_id, name, type, balance, created_at
     FROM accounts
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  if (result.rows.length === 0) return null;
  return mapRowToAccount(result.rows[0]);
};

export const listAccountsByUserId = async (userId: number): Promise<Account[]> => {
  const result = await dbPool.query<AccountRow>(
    `SELECT id, user_id, name, type, balance, created_at
     FROM accounts
     WHERE user_id = $1
     ORDER BY id`,
    [userId]
  );
  return result.rows.map(mapRowToAccount);
};

