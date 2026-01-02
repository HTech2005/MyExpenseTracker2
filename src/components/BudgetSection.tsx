import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Budget, Expense, Currency } from '../types/expense';
import { CURRENCY_SYMBOLS } from '../constants';
import { isSmallScreen } from '../utils/responsive';
import { formatAmount } from '../utils/currency';

interface BudgetSectionProps {
    budgets: Budget[];
    expenses: Expense[];
    currency: Currency;
    theme: 'light' | 'dark';
}

const BudgetSection: React.FC<BudgetSectionProps> = ({ budgets, expenses, currency, theme }) => {
    if (budgets.length === 0) return null;

    // Filter expenses for the current month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && e.type === 'expense';
    });

    return (
        <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
            <Text style={[styles.title, { color: theme === 'dark' ? '#f7fafc' : '#2d3748' }]}>
                Objectifs Budgétaires (Mois En Cours)
            </Text>

            {budgets.map(budget => {
                const spent = monthlyExpenses
                    .filter(e => e.category === budget.category)
                    .reduce((sum, e) => sum + e.amount, 0);

                const percent = Math.min((spent / budget.limit) * 100, 100);
                const isOver = spent > budget.limit;

                return (
                    <View key={budget.category} style={styles.budgetItem}>
                        <View style={styles.budgetHeader}>
                            <Text style={[styles.categoryName, { color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }]}>
                                {budget.category}
                            </Text>
                            <Text style={[styles.budgetAmount, { color: isOver ? '#fc8181' : theme === 'dark' ? '#e2e8f0' : '#2d3748' }]}>
                                {formatAmount(spent, currency)} / {formatAmount(budget.limit, currency)} {CURRENCY_SYMBOLS[currency]}
                            </Text>
                        </View>
                        <View style={[styles.progressBg, { backgroundColor: theme === 'dark' ? '#3d4b64' : '#edf2f7' }]}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${percent}%`,
                                        backgroundColor: isOver ? '#fc8181' : percent > 80 ? '#f6ad55' : '#667eea'
                                    }
                                ]}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    containerSmall: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        marginBottom: 16,
    },
    budgetItem: {
        marginBottom: 14,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    categoryName: {
        fontSize: 14,
        fontWeight: '700',
    },
    budgetAmount: {
        fontSize: 13,
        fontWeight: '800',
    },
    progressBg: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default BudgetSection;
