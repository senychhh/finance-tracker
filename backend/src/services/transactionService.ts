/**
 * Transaction service: business logic for transactions.
 */

import type { Transaction } from '../types';
import * as transactionRepository from '../repositories/transactionRepository';
import * as accountRepository from '../repositories/accountRepository';
import * as categoryRepository from '../repositories/categoryRepository';
import type { CreateTransactionInput } from '../repositories/transactionRepository';

export const createTransaction = async (
  userId: number,
  input: {
    accountId: number;
    categoryId?: number | null;
    amount: number;
    date: string;
    note?: string | null;
  }
): Promise<Transaction> => {
  const account = await accountRepository.findAccountById(input.accountId, userId);
  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }
  if (input.categoryId != null) {
    const category = await categoryRepository.findCategoryById(
      input.categoryId,
      userId
    );
    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }
  }
  const payload: CreateTransactionInput = {
    userId,
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    amount: input.amount,
    date: input.date,
    note: input.note ?? null,
  };
  return transactionRepository.createTransaction(payload);
};

export const getTransactionById = async (
  id: number,
  userId: number
): Promise<Transaction | null> => {
  return transactionRepository.findTransactionById(id, userId);
};

export const listTransactions = async (userId: number): Promise<Transaction[]> => {
  return transactionRepository.listTransactionsByUserId(userId);
};
