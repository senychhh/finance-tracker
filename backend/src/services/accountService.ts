/**
 * Account service: business logic for accounts.
 */

import type { Account } from '../types';
import * as accountRepository from '../repositories/accountRepository';
import type { CreateAccountInput } from '../repositories/accountRepository';

export const createAccount = async (
  userId: number,
  input: { name: string; type: string; balance?: number }
): Promise<Account> => {
  const payload: CreateAccountInput = {
    userId,
    name: input.name.trim(),
    type: input.type.trim(),
    balance: input.balance ?? 0,
  };
  return accountRepository.createAccount(payload);
};

export const getAccountById = async (
  id: number,
  userId: number
): Promise<Account | null> => {
  return accountRepository.findAccountById(id, userId);
};

export const listAccounts = async (userId: number): Promise<Account[]> => {
  return accountRepository.listAccountsByUserId(userId);
};
