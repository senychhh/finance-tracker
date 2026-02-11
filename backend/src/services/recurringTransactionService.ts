/**
 * RecurringTransaction service: business logic for recurring transactions.
 */

import type { RecurringTransaction, CreateRecurringTransaction } from '../types';
import * as recurringTransactionRepository from '../repositories/recurringTransactionRepository';
import * as accountRepository from '../repositories/accountRepository';
import * as categoryRepository from '../repositories/categoryRepository';

export const createRecurringTransaction = async (
  userId: number,
  input: {
    accountId: number;
    categoryId?: number | null;
    amount: number;
    note?: string | null;
    frequency: string;
    startDate: string;
    nextRunDate: string;
    endDate?: string | null;
  }
): Promise<RecurringTransaction> => {
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
  const payload: CreateRecurringTransaction = {
    user_id: userId,
    account_id: input.accountId,
    category_id: input.categoryId ?? null,
    amount: input.amount,
    note: input.note ?? null,
    frequency: input.frequency,
    start_date: input.startDate,
    next_run_date: input.nextRunDate,
    end_date: input.endDate ?? null,
  };
  return recurringTransactionRepository.createRecurringTransaction(payload);
};

export const getRecurringTransactionById = async (
  id: number,
  userId: number
): Promise<RecurringTransaction | null> => {
  return recurringTransactionRepository.findRecurringTransactionById(id, userId);
};

export const listRecurringTransactions = async (
  userId: number
): Promise<RecurringTransaction[]> => {
  return recurringTransactionRepository.listRecurringTransactionsByUserId(userId);
};
