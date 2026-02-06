/**
 * Shared TypeScript types and interfaces.
 * Used across layers (controllers, services, repositories).
 */

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  type: string;
  balance: number;
  created_at: Date;
}

export interface Category {
  id: number;
  user_id: number;
  name: string;
  type: string;
  created_at: Date;
}

export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number | null;
  amount: number;
  date: string;
  note: string | null;
  created_at: Date;
}

export interface Budget {
  id: number;
  user_id: number;
  category_id: number;
  period_date: string;
  amount: number;
  created_at: Date;
}

export interface RecurringTransaction {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number | null;
  amount: number;
  note: string | null;
  frequency: string;
  start_date: string;
  next_run_date: string;
  end_date: string | null;
  created_at: Date;
}

export interface CreateBudget {
  user_id: number;
  category_id: number;
  period_date: string;
  amount: number;
}

export interface CreateRecurringTransaction {
  user_id: number;
  account_id: number;
  category_id: number | null;
  amount: number;
  note: string | null;
  frequency: string;
  start_date: string;
  next_run_date: string;
  end_date?: string | null;
}

export interface Goal {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  created_at: Date;
}

export interface CreateGoal {
  user_id: number;
  name: string;
  target_amount: number;
  current_amount?: number;
  deadline?: string | null;
}
