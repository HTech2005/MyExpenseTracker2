import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Calendar, Edit2, Trash2, DollarSign, Search, X } from 'lucide-react-native';
import { Expense, Currency } from '../types/expense';
import { CURRENCY_SYMBOLS } from '../constants';
import { isSmallScreen, isTablet, isLandscape } from '../utils/responsive';
import { formatAmount } from '../utils/currency';
import EmptyState from './EmptyState';

interface RecentExpensesProps {
    expenses: Expense[];
    recentExpenses: Expense[];
    currency: Currency;
    theme: 'light' | 'dark';
    historyFilter: 'all' | 'expense' | 'income';
    setHistoryFilter: (filter: 'all' | 'expense' | 'income') => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    showAllExpenses: boolean;
    setShowAllExpenses: (show: boolean) => void;
    startEditing: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
    getCategoryColor: (category: string) => string;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({
    expenses,
    recentExpenses,
    currency,
    theme,
    historyFilter,
    setHistoryFilter,
    searchQuery,
    setSearchQuery,
    showAllExpenses,
    setShowAllExpenses,
    startEditing,
    deleteExpense,
    getCategoryColor,
}) => {
    return (
        <View style={[
            styles.card,
            isSmallScreen && styles.cardSmall,
            isTablet && styles.cardTablet,
            { backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff', borderColor: theme === 'dark' ? '#4a5568' : '#e2e8f0' }
        ]}>
            <View style={[
                styles.cardHeader,
                isSmallScreen && styles.cardHeaderSmall,
                (isTablet || isLandscape) && styles.cardHeaderTablet
            ]}>
                <View style={[styles.cardTitle, { backgroundColor: 'transparent', marginBottom: 12 }]}>
                    <Calendar
                        size={isSmallScreen ? 16 : isTablet ? 24 : 20}
                        color={theme === 'dark' ? '#9f7aea' : '#667eea'}
                    />
                    <Text style={[
                        styles.cardTitleText,
                        isSmallScreen && styles.cardTitleTextSmall,
                        isTablet && styles.cardTitleTextTablet,
                        { color: theme === 'dark' ? '#f7fafc' : '#2d3748' }
                    ]}>
                        Dépenses & Gains
                    </Text>
                </View>
                <View style={styles.historyFilterTabs}>
                    {(['all', 'expense', 'income'] as const).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setHistoryFilter(filter)}
                            style={[
                                styles.historyFilterTab,
                                historyFilter === filter && styles.historyFilterTabActive,
                                historyFilter === filter && { borderBottomColor: filter === 'expense' ? '#fc8181' : filter === 'income' ? '#68d391' : '#667eea' }
                            ]}
                        >
                            <Text style={[
                                styles.historyFilterTabText,
                                historyFilter === filter && styles.historyFilterTabTextActive,
                                historyFilter === filter && { color: filter === 'expense' ? '#fc8181' : filter === 'income' ? '#68d391' : '#667eea' }
                            ]}>
                                {filter === 'all' ? 'Tous' : filter === 'expense' ? 'Dépenses' : 'Gains'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme === 'dark' ? '#1a202c' : '#f1f5f9' }]}>
                    <Search size={16} color="#94a3b8" />
                    <TextInput
                        style={[styles.searchInput, { color: theme === 'dark' ? '#f7fafc' : '#1e293b' }]}
                        placeholder="Rechercher par catégorie ou description..."
                        placeholderTextColor="#94a3b8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <X size={16} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.expenseList}>
                {recentExpenses.map(exp => (
                    <View key={exp.id} style={[
                        styles.expenseItem,
                        isSmallScreen && styles.expenseItemSmall,
                        isTablet && styles.expenseItemTablet,
                        {
                            backgroundColor: theme === 'dark' ? '#4a5568' : '#ffffff',
                            borderLeftWidth: 4,
                            borderLeftColor: getCategoryColor(exp.category)
                        }
                    ]}>
                        <View style={styles.expenseLeft}>
                            <View style={styles.expenseInfo}>
                                {/* Ligne Titre : Point + Catégorie */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                    <View style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: 6,
                                        backgroundColor: getCategoryColor(exp.category),
                                        marginRight: 10
                                    }} />
                                    <Text style={[
                                        styles.expenseCategory,
                                        isSmallScreen && styles.expenseCategorySmall,
                                        isTablet && styles.expenseCategoryTablet,
                                        { color: theme === 'dark' ? '#f7fafc' : '#2d3748' }
                                    ]}>
                                        {exp.category}
                                    </Text>
                                </View>

                                {exp.description ? (
                                    <Text style={[
                                        styles.expenseDescription,
                                        isSmallScreen && styles.expenseDescriptionSmall,
                                        isTablet && styles.expenseDescriptionTablet,
                                        { color: theme === 'dark' ? '#a0aec0' : '#718096', paddingLeft: 22 }
                                    ]}>
                                        {exp.description}
                                    </Text>
                                ) : null}
                                <Text style={[
                                    styles.expenseDate,
                                    isSmallScreen && styles.expenseDateSmall,
                                    isTablet && styles.expenseDateTablet,
                                    { color: theme === 'dark' ? '#a0aec0' : '#718096', paddingLeft: 22 }
                                ]}>
                                    {new Date(exp.date).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: isTablet ? 'numeric' : undefined
                                    })}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.expenseRight}>
                            <Text style={[
                                styles.expenseAmount,
                                isSmallScreen && styles.expenseAmountSmall,
                                isTablet && styles.expenseAmountTablet,
                                { color: exp.type === 'income' ? (theme === 'dark' ? '#4ade80' : '#16a34a') : (theme === 'dark' ? '#fc8181' : '#f56565') }
                            ]}>
                                {exp.type === 'income' ? '+' : '-'}{formatAmount(exp.amount, currency)} <Text style={{ fontSize: 12 }}>{CURRENCY_SYMBOLS[currency]}</Text>
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                                <TouchableOpacity
                                    onPress={() => startEditing(exp)}
                                    style={[
                                        styles.deleteButton,
                                        isSmallScreen && styles.deleteButtonSmall,
                                        isTablet && styles.deleteButtonTablet,
                                        { backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc' } // Light gray
                                    ]}
                                >
                                    <Edit2
                                        size={isSmallScreen ? 16 : isTablet ? 20 : 18}
                                        color={theme === 'dark' ? '#a0aec0' : '#718096'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteExpense(exp.id)}
                                    style={[
                                        styles.deleteButton,
                                        isSmallScreen && styles.deleteButtonSmall,
                                        isTablet && styles.deleteButtonTablet,
                                        { backgroundColor: theme === 'dark' ? 'rgba(252, 129, 129, 0.2)' : '#fee2e2' } // Light red
                                    ]}
                                >
                                    <Trash2
                                        size={isSmallScreen ? 16 : isTablet ? 20 : 18}
                                        color="#ef4444"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {expenses.length === 0 && <EmptyState theme={theme} />}

                {expenses.length > (isSmallScreen ? 5 : isTablet ? 15 : 10) && (
                    <TouchableOpacity
                        style={styles.showAllButton}
                        onPress={() => setShowAllExpenses(!showAllExpenses)}
                    >
                        <Text style={styles.showAllText}>
                            {showAllExpenses ? 'Voir moins' : 'Voir tout'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardSmall: {
        marginHorizontal: 12,
        marginBottom: 16,
    },
    cardTablet: {
        marginHorizontal: 40,
        marginBottom: 32,
    },
    cardHeader: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    cardHeaderSmall: {
        padding: 12,
    },
    cardHeaderTablet: {
        padding: 28,
    },
    cardTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardTitleText: {
        fontSize: 18,
        fontWeight: '800',
    },
    cardTitleTextSmall: {
        fontSize: 14,
    },
    cardTitleTextTablet: {
        fontSize: 24,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 12,
        height: 40,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    historyFilterTabs: {
        flexDirection: 'row',
        gap: 8,
    },
    historyFilterTab: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    historyFilterTabActive: {},
    historyFilterTabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#a0aec0',
    },
    historyFilterTabTextActive: {
        fontWeight: '800',
    },
    expenseList: {
        padding: 12,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    expenseItemSmall: {
        padding: 12,
    },
    expenseItemTablet: {
        padding: 24,
        marginBottom: 16,
    },
    expenseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        marginRight: 16,
    },
    categoryIconSmall: {
        width: 36,
        height: 36,
        marginRight: 10,
    },
    categoryIconTablet: {
        width: 56,
        height: 56,
        marginRight: 20,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseCategory: {
        fontSize: 16,
        fontWeight: '700',
    },
    expenseCategorySmall: {
        fontSize: 14,
    },
    expenseCategoryTablet: {
        fontSize: 20,
    },
    expenseDescription: {
        fontSize: 12,
        marginTop: 2,
    },
    expenseDescriptionSmall: {
        fontSize: 11,
    },
    expenseDescriptionTablet: {
        fontSize: 14,
    },
    expenseDate: {
        fontSize: 10,
        marginTop: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    expenseDateSmall: {
        fontSize: 9,
    },
    expenseDateTablet: {
        fontSize: 12,
    },
    expenseRight: {
        alignItems: 'flex-end',
        gap: 8,
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: '800',
    },
    expenseAmountSmall: {
        fontSize: 15,
    },
    expenseAmountTablet: {
        fontSize: 24,
    },
    deleteButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonSmall: {
        width: 28,
        height: 28,
    },
    deleteButtonTablet: {
        width: 40,
        height: 40,
    },
    showAllButton: {
        alignItems: 'center',
        paddingVertical: 12,
        marginTop: 8,
    },
    showAllText: {
        color: '#667eea',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default RecentExpenses;
