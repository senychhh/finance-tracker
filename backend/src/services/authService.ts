/**
 * Auth service: registration, login, JWT. Uses userRepository and strips password from responses.
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { getUserByEmail, createUser } from '../repositories';
import type { UserPublic } from '../types';

const SALT_ROUNDS = 10;

const toUserPublic = (user: { id: number; email: string; created_at: Date }): UserPublic => ({
  id: user.id,
  email: user.email,
  created_at: user.created_at,
});

export const register = async (
  email: string,
  password: string
): Promise<UserPublic> => {
  const existing = await getUserByEmail(email);
  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser(email, passwordHash);
  return toUserPublic(user);
};

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: UserPublic }> => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const token = jwt.sign(
    { userId: user.id },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions
  );
  return { token, user: toUserPublic(user) };
};
