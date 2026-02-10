/**
 * Repositories layer.
 * All database access (PostgreSQL). Returns plain data.
 */

export {
  getUserById,
  getUserByEmail,
  createUser,
  deleteUserById,
} from './userRepository';

export * as accountRepository from './accountRepository';
export * as categoryRepository from './categoryRepository';
export * as transactionRepository from './transactionRepository';
export * as budgetRepository from './budgetRepository';
export * as recurringTransactionRepository from './recurringTransactionRepository';
export * as goalRepository from './goalRepository'; 
