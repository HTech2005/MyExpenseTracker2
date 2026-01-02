export type ViewMode = 'jour' | 'semaine' | 'mois' | 'année';
export type Currency = 'FCFA' | 'EUR' | 'USD' | 'XOF' | 'GBP' | 'CAD' | 'JPY' | 'CHF';

export interface CustomCategory {
  name: string;
  color: string;
  type: 'expense' | 'income';
}

export interface Budget {
  category: string;
  limit: number;
}

export type RecurrencePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringTransaction {
  id: number;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description?: string;
  period: RecurrencePeriod;
  startDate: string;
  lastProcessedDate?: string;
}

export interface Expense {
  id: number;
  date: string;
  amount: number;
  category: string;
  description?: string;
  type: 'expense' | 'income';
  isRecurring?: boolean;
}

export interface NewExpense {
  date: string;
  amount: string;
  category: string;
  description?: string;
  type: 'expense' | 'income';
}