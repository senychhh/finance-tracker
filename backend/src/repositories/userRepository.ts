/**
 * User repository: data access for users table.
 * Returns full User (including password_hash); strip password at service/controller layer.
 */

import { dbPool } from '../config/db';
import type { User } from '../types';

type UserRow = {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
};

const mapRowToUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  password_hash: row.password_hash,
  created_at: row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await dbPool.query<UserRow>(
    'SELECT id, email, password_hash, created_at FROM users WHERE id = $1',
    [id]
  );
  if (result.rows.length === 0) return null;
  return mapRowToUser(result.rows[0]);
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await dbPool.query<UserRow>(
    'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
    [email]
  );
  if (result.rows.length === 0) return null;
  return mapRowToUser(result.rows[0]);
};

export const createUser = async (
  email: string,
  passwordHash: string
): Promise<User> => {
  const result = await dbPool.query<UserRow>(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, password_hash, created_at`,
    [email, passwordHash]
  );
  if (result.rows.length === 0) {
    throw new Error('createUser: INSERT did not return a row');
  }
  return mapRowToUser(result.rows[0]);
};

export const deleteUserById = async (id: number): Promise<boolean> => {
  const result = await dbPool.query('DELETE FROM users WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
};
