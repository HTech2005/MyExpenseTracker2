import { Currency } from "../types/expense";

export const STORAGE_KEY = '@expenses_data';
export const BACKUP_STORAGE_KEY = '@expenses_data_backup';
export const CURRENCY_KEY = '@expenses_currency';
export const THEME_KEY = '@expenses_theme';
export const NOTIFICATIONS_KEY = '@expenses_notifications';
export const NOTIFICATION_HOURS_KEY = '@expenses_notification_hours';
export const CUSTOM_CATEGORIES_KEY = '@expenses_custom_categories';
export const BUDGETS_KEY = '@expenses_budgets';
export const RECURRING_KEY = '@expenses_recurring';

export const EXCHANGE_RATES = {
  XOF_TO_EUR: 1 / 655.957,
  XOF_TO_USD: 1 / 600,
  XOF_TO_GBP: 1 / 780,
  XOF_TO_CAD: 1 / 440,
  XOF_TO_JPY: 1 / 4.1,
  XOF_TO_CHF: 1 / 700,
  EUR_TO_XOF: 655.957,
  USD_TO_XOF: 600,
  GBP_TO_XOF: 780,
  CAD_TO_XOF: 440,
  JPY_TO_XOF: 4.1,
  CHF_TO_XOF: 700,
};

export const DEFAULT_EXPENSE_CATEGORIES = ['Alimentation', 'Transport', 'Loisirs', 'Santé', 'Logement', 'Autre'];
export const DEFAULT_INCOME_CATEGORIES = ['Salaire', 'Business', 'Cadeau', 'Investissement', 'Autre'];

export const CURRENCIES: Currency[] = ['XOF', 'EUR', 'USD', 'GBP', 'CAD', 'JPY', 'CHF'];

export const CURRENCY_SYMBOLS: { [key in Currency]: string } = {
  'FCFA': 'FCFA',
  'EUR': '€',
  'USD': '$',
  'XOF': 'FCFA',
  'GBP': '£',
  'CAD': 'C$',
  'JPY': '¥',
  'CHF': 'CHF'
};

export const DEFAULT_CATEGORY_COLORS: { [key: string]: string } = {
  'Alimentation': '#ff6b6b',
  'Transport': '#4ecdc4',
  'Loisirs': '#45b7d1',
  'Santé': '#96ceb4',
  'Logement': '#feca57',
  'Salaire': '#16a34a',
  'Business': '#22c55e',
  'Cadeau': '#84cc16',
  'Investissement': '#10b981',
  'Autre': '#b8b8b8'
};
