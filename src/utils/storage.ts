import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Currency, CustomCategory, Budget, RecurringTransaction } from '../types/expense';
import {
    STORAGE_KEY,
    BACKUP_STORAGE_KEY,
    CURRENCY_KEY,
    THEME_KEY,
    NOTIFICATIONS_KEY,
    NOTIFICATION_HOURS_KEY,
    CUSTOM_CATEGORIES_KEY,
    BUDGETS_KEY,
    RECURRING_KEY
} from '../constants';

export const saveExpenses = async (data: Expense[]) => {
    try {
        const dataString = JSON.stringify(data);
        await AsyncStorage.multiSet([
            [STORAGE_KEY, dataString],
            [BACKUP_STORAGE_KEY, dataString]
        ]);
    } catch (error) {
        console.error('Error saving expenses:', error);
    }
};

export const saveCurrency = async (newCurrency: Currency) => {
    try {
        await AsyncStorage.setItem(CURRENCY_KEY, newCurrency);
    } catch (error) {
        console.error('Error saving currency:', error);
    }
};

export const saveTheme = async (newTheme: 'light' | 'dark') => {
    try {
        await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
        console.error('Error saving theme:', error);
    }
};

export const saveCustomCategories = async (categories: CustomCategory[]) => {
    try {
        await AsyncStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
        console.error('Error saving custom categories:', error);
    }
};

export const saveBudgets = async (budgets: Budget[]) => {
    try {
        await AsyncStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    } catch (error) {
        console.error('Error saving budgets:', error);
    }
};

export const loadBudgets = async (): Promise<Budget[]> => {
    try {
        const stored = await AsyncStorage.getItem(BUDGETS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading budgets:', error);
        return [];
    }
};

export const saveRecurringTransactions = async (items: RecurringTransaction[]) => {
    try {
        await AsyncStorage.setItem(RECURRING_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Error saving recurring transactions:', error);
    }
};

export const loadRecurringTransactions = async (): Promise<RecurringTransaction[]> => {
    try {
        const stored = await AsyncStorage.getItem(RECURRING_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading recurring transactions:', error);
        return [];
    }
};

export const loadExpenses = async (): Promise<Expense[]> => {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        let parsed: Expense[] = [];

        if (stored) {
            parsed = JSON.parse(stored);
        } else {
            const backup = await AsyncStorage.getItem(BACKUP_STORAGE_KEY);
            if (backup) {
                parsed = JSON.parse(backup);
            }
        }

        if (Array.isArray(parsed) && parsed.every(item =>
            item.id && typeof item.id === 'number' &&
            item.date && typeof item.date === 'string' &&
            item.amount && typeof item.amount === 'number' &&
            item.category && typeof item.category === 'string'
        )) {
            return parsed;
        }
        return [];
    } catch (error) {
        console.error('Error loading expenses:', error);
        return [];
    }
};
