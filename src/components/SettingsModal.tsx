import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Sun, Moon, Bell, Plus, Trash2, Calendar, Repeat } from 'lucide-react-native';
import { Currency, CustomCategory, Budget, RecurringTransaction, RecurrencePeriod } from '../types/expense';
import { CURRENCIES, CURRENCY_SYMBOLS, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants';
import { saveBudgets, saveRecurringTransactions } from '../utils/storage';
import { isSmallScreen, isTablet } from '../utils/responsive';
import { formatAmount } from '../utils/currency';

interface SettingsModalProps {
    show: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    currency: Currency;
    onCurrencyChange: (curr: Currency) => void;
    notificationsEnabled: boolean;
    toggleNotifications: () => void;
    notificationHours: number[];
    setNotificationHours: (hours: number[]) => void;
    customCategories: CustomCategory[];
    categoryType: 'expense' | 'income';
    setCategoryType: (type: 'expense' | 'income') => void;
    newCategoryName: string;
    setNewCategoryName: (name: string) => void;
    newCategoryColor: string;
    setNewCategoryColor: (color: string) => void;
    addCustomCategory: () => void;
    deleteCustomCategory: (name: string) => void;
    budgets: Budget[];
    setBudgets: (budgets: Budget[]) => void;
    recurringTransactions: RecurringTransaction[];
    setRecurringTransactions: (items: RecurringTransaction[]) => void;
    onResetData: () => void;
    onResetAll: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    show,
    onClose,
    theme,
    setTheme,
    currency,
    onCurrencyChange,
    notificationsEnabled,
    toggleNotifications,
    notificationHours,
    setNotificationHours,
    customCategories,
    categoryType,
    setCategoryType,
    newCategoryName,
    setNewCategoryName,
    newCategoryColor,
    setNewCategoryColor,
    addCustomCategory,
    deleteCustomCategory,
    budgets,
    setBudgets,
    recurringTransactions,
    setRecurringTransactions,
    onResetData,
    onResetAll,
}) => {
    const [activeTab, setActiveTab] = useState<'general' | 'categories' | 'budgets' | 'recurring'>('general');
    const [budgetLimit, setBudgetLimit] = useState('');
    const [budgetCategory, setBudgetCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);

    const [recAmount, setRecAmount] = useState('');
    const [recCategory, setRecCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[0]);
    const [recType, setRecType] = useState<'expense' | 'income'>('expense');
    const [recDesc, setRecDesc] = useState('');
    const [recPeriod, setRecPeriod] = useState<RecurrencePeriod>('monthly');

    const handleAddBudget = async () => {
        if (!budgetLimit || isNaN(parseFloat(budgetLimit))) return;
        const newBudget: Budget = { category: budgetCategory, limit: parseFloat(budgetLimit) };
        const updated = [...budgets.filter(b => b.category !== budgetCategory), newBudget];
        setBudgets(updated);
        await saveBudgets(updated);
        setBudgetLimit('');
    };

    const handleAddRecurring = async () => {
        if (!recAmount || isNaN(parseFloat(recAmount))) return;
        const newItem: RecurringTransaction = {
            id: Date.now(),
            type: recType,
            amount: parseFloat(recAmount),
            category: recCategory,
            description: recCategory,
            period: recPeriod,
            startDate: new Date().toISOString(),
        };
        const updated = [...recurringTransactions, newItem];
        setRecurringTransactions(updated);
        await saveRecurringTransactions(updated);
        setRecAmount('');
    };
    return (
        <Modal
            visible={show}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={[
                    styles.modalHeader,
                    isSmallScreen && styles.modalHeaderSmall,
                    isTablet && styles.modalHeaderTablet
                ]}>
                    <Text style={[
                        styles.modalTitle,
                        isSmallScreen && styles.modalTitleSmall,
                        isTablet && styles.modalTitleTablet
                    ]}>
                        Paramètres
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={isSmallScreen ? 20 : isTablet ? 28 : 24} color="#ffffff" />
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.tabContainer}>
                    <TouchableOpacity onPress={() => setActiveTab('general')} style={[styles.tab, activeTab === 'general' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>Général</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('categories')} style={[styles.tab, activeTab === 'categories' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'categories' && styles.activeTabText]}>Catégories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('budgets')} style={[styles.tab, activeTab === 'budgets' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'budgets' && styles.activeTabText]}>Budgets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveTab('recurring')} style={[styles.tab, activeTab === 'recurring' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'recurring' && styles.activeTabText]}>Générer</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.form} contentContainerStyle={[
                    styles.formContent,
                    isSmallScreen && styles.formContentSmall,
                    isTablet && styles.formContentTablet
                ]}>
                    {activeTab === 'general' && (
                        <>
                            {/* Currency Section */}
                            <View style={[styles.formGroup, isSmallScreen && styles.formGroupSmall]}>
                                <Text style={[styles.label, isSmallScreen && styles.labelSmall, isTablet && styles.labelTablet]}>
                                    Devise
                                </Text>
                                <View style={styles.categoryGrid}>
                                    {CURRENCIES.map((curr) => (
                                        <TouchableOpacity
                                            key={curr}
                                            onPress={() => onCurrencyChange(curr)}
                                            style={[
                                                styles.categoryOption,
                                                isSmallScreen && styles.categoryOptionSmall,
                                                isTablet && styles.categoryOptionTablet,
                                                currency === curr && styles.categoryOptionActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.categoryOptionText,
                                                isSmallScreen && styles.categoryOptionTextSmall,
                                                isTablet && styles.categoryOptionTextTablet,
                                                currency === curr && styles.categoryOptionTextActive
                                            ]}>
                                                {curr} ({CURRENCY_SYMBOLS[curr]})
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Notifications */}
                            <View style={[styles.formGroup, isSmallScreen && styles.formGroupSmall]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                    <Text style={[styles.label, isSmallScreen && styles.labelSmall, isTablet && styles.labelTablet]}>Notifications</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text style={{ fontSize: 12, color: notificationsEnabled ? '#48bb78' : '#a0aec0' }}>
                                            {notificationsEnabled ? 'Activées' : 'Désactivées'}
                                        </Text>
                                        <TouchableOpacity onPress={toggleNotifications}>
                                            <Bell size={24} color={notificationsEnabled ? '#48bb78' : '#a0aec0'} fill={notificationsEnabled ? '#48bb78' : 'none'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {notificationsEnabled && (
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        {[0, 1].map((index) => (
                                            <View key={index} style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 12, color: '#718096', marginBottom: 4 }}>Heure {index + 1}</Text>
                                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 40 }}>
                                                    {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                                                        <TouchableOpacity
                                                            key={h}
                                                            onPress={() => {
                                                                const newHours = [...notificationHours];
                                                                newHours[index] = h;
                                                                setNotificationHours(newHours);
                                                            }}
                                                            style={{
                                                                paddingHorizontal: 12,
                                                                paddingVertical: 6,
                                                                backgroundColor: notificationHours[index] === h ? '#667eea' : '#edf2f7',
                                                                borderRadius: 8,
                                                                marginRight: 8,
                                                            }}
                                                        >
                                                            <Text style={{ color: notificationHours[index] === h ? '#fff' : '#2d3748', fontWeight: 'bold' }}>{h}h</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Theme */}
                            <View style={[styles.formGroup, isSmallScreen && styles.formGroupSmall]}>
                                <Text style={[styles.label, isSmallScreen && styles.labelSmall, isTablet && styles.labelTablet]}>Apparence</Text>
                                <View style={styles.categoryGrid}>
                                    <TouchableOpacity
                                        onPress={() => setTheme('light')}
                                        style={[
                                            styles.categoryOption,
                                            isSmallScreen && styles.categoryOptionSmall,
                                            theme === 'light' && styles.categoryOptionActive
                                        ]}
                                    >
                                        <Sun size={20} color={theme === 'light' ? '#ffffff' : '#a0aec0'} />
                                        <Text style={[styles.categoryOptionText, theme === 'light' && styles.categoryOptionTextActive]}>Clair</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setTheme('dark')}
                                        style={[
                                            styles.categoryOption,
                                            isSmallScreen && styles.categoryOptionSmall,
                                            theme === 'dark' && styles.categoryOptionActive
                                        ]}
                                    >
                                        <Moon size={20} color={theme === 'dark' ? '#ffffff' : '#a0aec0'} />
                                        <Text style={[styles.categoryOptionText, theme === 'dark' && styles.categoryOptionTextActive]}>Sombre</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Reset */}
                            <View style={[styles.formGroup, { marginTop: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 20 }]}>
                                <Text style={styles.label}>Réinitialisation</Text>
                                <TouchableOpacity
                                    style={[styles.fullSubmitBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e53e3e' }]}
                                    onPress={() => {
                                        Alert.alert(
                                            "Option de réinitialisation",
                                            "Que souhaitez-vous réinitialiser ?",
                                            [
                                                { text: "Annuler", style: "cancel" },
                                                { text: "Transactions uniquement", onPress: onResetData },
                                                { text: "Tout effacer (Complète)", onPress: onResetAll, style: 'destructive' }
                                            ]
                                        );
                                    }}
                                >
                                    <Text style={[styles.fullSubmitBtnText, { color: '#e53e3e' }]}>Réinitialiser</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )
                    }

                    {
                        activeTab === 'categories' && (
                            <View style={[styles.formGroup, isSmallScreen && styles.formGroupSmall]}>
                                <Text style={[styles.label, isSmallScreen && styles.labelSmall, isTablet && styles.labelTablet]}>
                                    Catégories Personnalisées
                                </Text>
                                <View style={styles.filterTabs}>
                                    {(['expense', 'income'] as const).map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            onPress={() => setCategoryType(type)}
                                            style={[
                                                styles.filterTab,
                                                categoryType === type && styles.filterTabActive,
                                                categoryType === type && { borderBottomColor: type === 'expense' ? '#fc8181' : '#48bb78' }
                                            ]}
                                        >
                                            <Text style={[
                                                styles.filterTabText,
                                                categoryType === type && styles.filterTabTextActive,
                                                categoryType === type && { color: type === 'expense' ? '#fc8181' : '#48bb78' }
                                            ]}>
                                                {type === 'expense' ? 'Dépenses' : 'Gains'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {customCategories.filter(c => c.type === categoryType).map((category) => (
                                    <View key={category.name} style={styles.customCategoryItem}>
                                        <View style={styles.customCategoryInfo}>
                                            <View style={[styles.categoryColorDot, { backgroundColor: category.color }]} />
                                            <Text style={styles.customCategoryName}>{category.name}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => deleteCustomCategory(category.name)}>
                                            <Trash2 size={20} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <View style={styles.addCategoryForm}>
                                    <TextInput
                                        style={styles.categoryNameInput}
                                        placeholder="Nom de la catégorie"
                                        value={newCategoryName}
                                        onChangeText={setNewCategoryName}
                                        placeholderTextColor="#9ca3af"
                                    />
                                    <View style={styles.colorOptions}>
                                        {[
                                            // Reds
                                            '#feb2b2', '#fc8181', '#f56565', '#e53e3e', '#c53030',
                                            // Oranges
                                            '#fbd38d', '#f6ad55', '#ed8936', '#dd6b20', '#c05621',
                                            // Yellows
                                            '#faf089', '#f6e05e', '#ecc94b', '#d69e2e', '#b7791f',
                                            // Greens
                                            '#9ae6b4', '#68d391', '#48bb78', '#38a169', '#2f855a',
                                            // Teals
                                            '#81e6d9', '#4fd1c5', '#38b2ac', '#319795', '#285e61',
                                            // Blues
                                            '#90cdf4', '#63b3ed', '#4299e1', '#3182ce', '#2b6cb0',
                                            // Indigos
                                            '#a3bffa', '#7f9cf5', '#667eea', '#5a67d8', '#4c51bf',
                                            // Purples
                                            '#d6bcfa', '#b794f4', '#9f7aea', '#805ad5', '#6b46c1',
                                            // Pinks
                                            '#fbb6ce', '#f687b3', '#ed64a6', '#d53f8c', '#b83280',
                                            // Grays
                                            '#e2e8f0', '#cbd5e0', '#a0aec0', '#718096', '#2d3748'
                                        ].map(color => (
                                            <TouchableOpacity
                                                key={color}
                                                style={[
                                                    styles.colorSquare,
                                                    { backgroundColor: color },
                                                    newCategoryColor === color && styles.colorSquareSelected
                                                ]}
                                                onPress={() => setNewCategoryColor(color)}
                                            />
                                        ))}
                                    </View>
                                    <TouchableOpacity style={styles.addButton} onPress={addCustomCategory}>
                                        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addButtonGradient}>
                                            <Plus size={16} color="#ffffff" />
                                            <Text style={styles.addButtonText}>Ajouter</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }

                    {
                        activeTab === 'budgets' && (
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Nouveau Budget</Text>
                                <View style={styles.tagSelector}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {[...DEFAULT_EXPENSE_CATEGORIES, ...customCategories.filter(c => c.type === 'expense').map(c => c.name)].map(cat => (
                                            <TouchableOpacity
                                                key={cat}
                                                onPress={() => setBudgetCategory(cat)}
                                                style={[styles.tag, budgetCategory === cat && styles.activeTag]}
                                            >
                                                <Text style={[styles.tagText, budgetCategory === cat && styles.activeTagText]}>{cat}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                                <View style={styles.inlineForm}>
                                    <TextInput
                                        style={[styles.input, { flex: 1 }]}
                                        placeholder="Limite"
                                        keyboardType="numeric"
                                        value={budgetLimit}
                                        onChangeText={setBudgetLimit}
                                    />
                                    <TouchableOpacity style={styles.submitBtn} onPress={handleAddBudget}>
                                        <Plus size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={[styles.label, { marginTop: 24 }]}>Vos Budgets</Text>
                                {budgets.map(b => (
                                    <View key={b.category} style={styles.listItem}>
                                        <Text style={styles.listItemText}>{b.category}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                            <Text style={styles.listItemValue}>{formatAmount(b.limit, currency)} {CURRENCY_SYMBOLS[currency]}</Text>
                                            <TouchableOpacity onPress={async () => {
                                                const updated = budgets.filter(x => x.category !== b.category);
                                                setBudgets(updated);
                                                await saveBudgets(updated);
                                            }}>
                                                <Trash2 size={18} color="#ff6b6b" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )
                    }

                    {
                        activeTab === 'recurring' && (
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Automatisation</Text>
                                <View style={styles.filterTabs}>
                                    {(['expense', 'income'] as const).map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            onPress={() => {
                                                setRecType(type);
                                                setRecCategory(type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES[0] : DEFAULT_INCOME_CATEGORIES[0]);
                                            }}
                                            style={[
                                                styles.filterTab,
                                                recType === type && styles.filterTabActive,
                                                recType === type && { borderBottomColor: type === 'expense' ? '#fc8181' : '#48bb78' }
                                            ]}
                                        >
                                            <Text style={[
                                                styles.filterTabText,
                                                recType === type && styles.filterTabTextActive,
                                                recType === type && { color: type === 'expense' ? '#fc8181' : '#48bb78' }
                                            ]}>
                                                {type === 'expense' ? 'Dépense' : 'Gain'}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={{ marginBottom: 12 }}>
                                    <TextInput
                                        style={[styles.input, { width: '100%' }]}
                                        placeholder="Montant"
                                        keyboardType="numeric"
                                        value={recAmount}
                                        onChangeText={setRecAmount}
                                    />
                                </View>

                                <View style={styles.tagSelector}>
                                    <Text style={[styles.label, { fontSize: 12, marginBottom: 8 }]}>Catégorie</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {(recType === 'expense'
                                            ? [...DEFAULT_EXPENSE_CATEGORIES, ...customCategories.filter(c => c.type === 'expense').map(c => c.name)]
                                            : [...DEFAULT_INCOME_CATEGORIES, ...customCategories.filter(c => c.type === 'income').map(c => c.name)]
                                        ).map(cat => (
                                            <TouchableOpacity
                                                key={cat}
                                                onPress={() => setRecCategory(cat)}
                                                style={[styles.tag, recCategory === cat && styles.activeTag]}
                                            >
                                                <Text style={[styles.tagText, recCategory === cat && styles.activeTagText]}>{cat}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                                <View style={[styles.tagSelector, { marginTop: 12 }]}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {['daily', 'weekly', 'monthly', 'yearly'].map(p => (
                                            <TouchableOpacity
                                                key={p}
                                                onPress={() => setRecPeriod(p as RecurrencePeriod)}
                                                style={[styles.tag, recPeriod === p && styles.activeTag]}
                                            >
                                                <Text style={[styles.tagText, recPeriod === p && styles.activeTagText]}>{p}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                                <TouchableOpacity style={styles.fullSubmitBtn} onPress={handleAddRecurring}>
                                    <Text style={styles.fullSubmitBtnText}>Activer l'automatisation</Text>
                                </TouchableOpacity>

                                <Text style={[styles.label, { marginTop: 24 }]}>Actifs</Text>
                                {recurringTransactions.map(r => (
                                    <View key={r.id} style={styles.listItem}>
                                        <View>
                                            <Text style={styles.listItemText}>{r.description || r.category}</Text>
                                            <Text style={styles.listItemSubText}>{formatAmount(r.amount, currency)} {CURRENCY_SYMBOLS[currency]} / {r.period}</Text>
                                        </View>
                                        <TouchableOpacity onPress={async () => {
                                            const updated = recurringTransactions.filter(x => x.id !== r.id);
                                            setRecurringTransactions(updated);
                                            await saveRecurringTransactions(updated);
                                        }}>
                                            <Trash2 size={18} color="#ff6b6b" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )
                    }
                </ScrollView >
            </View >
        </Modal >
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 4,
        margin: 16,
        borderRadius: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#ffffff',
        elevation: 2,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
    },
    activeTabText: {
        color: '#667eea',
    },
    tagSelector: {
        marginBottom: 12,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        marginRight: 8,
    },
    activeTag: {
        backgroundColor: '#667eea',
    },
    tagText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
    },
    activeTagText: {
        color: '#fff',
    },
    inlineForm: {
        flexDirection: 'row',
        gap: 12,
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
    },
    submitBtn: {
        backgroundColor: '#667eea',
        width: 48,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullSubmitBtn: {
        backgroundColor: '#667eea',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 16,
    },
    fullSubmitBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    listItemText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
    listItemValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#667eea',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    modalHeader: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalHeaderSmall: { padding: 16 },
    modalHeaderTablet: { padding: 28 },
    modalTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
    },
    modalTitleSmall: { fontSize: 18 },
    modalTitleTablet: { fontSize: 26 },
    closeButton: {
        padding: 8,
    },
    form: {
        flex: 1,
    },
    formContent: {
        padding: 20,
    },
    formContentSmall: { padding: 16 },
    formContentTablet: { padding: 32 },
    formGroup: {
        marginBottom: 24,
    },
    formGroupSmall: { marginBottom: 16 },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4a5568',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    labelSmall: { fontSize: 13 },
    labelTablet: { fontSize: 16 },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#f7fafc',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    categoryOptionSmall: { paddingHorizontal: 12, paddingVertical: 8 },
    categoryOptionTablet: { paddingHorizontal: 20, paddingVertical: 14 },
    categoryOptionActive: {
        backgroundColor: '#667eea',
    },
    categoryOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4a5568',
    },
    categoryOptionTextSmall: {
        fontSize: 12,
    },
    categoryOptionTextTablet: {
        fontSize: 18,
    },
    categoryOptionTextActive: {
        color: '#ffffff',
    },
    hourRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 12,
    },
    hourButton: {
        backgroundColor: '#667eea',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hourButtonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    hourText: {
        fontSize: 18,
        fontWeight: '800',
        width: 40,
        textAlign: 'center',
    },
    filterTabs: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    filterTabActive: {},
    filterTabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9ca3af',
    },
    filterTabTextActive: {
        fontWeight: '800',
    },
    customCategoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f7fafc',
        borderRadius: 12,
        marginBottom: 8,
    },
    customCategoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    categoryColorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    customCategoryName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2d3748',
    },
    addCategoryForm: {
        marginTop: 16,
        gap: 12,
    },
    categoryNameInput: {
        backgroundColor: '#f7fafc',
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: '#2d3748',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    colorOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    colorSquare: {
        width: 30,
        height: 30,
        borderRadius: 6,
    },
    colorSquareSelected: {
        borderWidth: 3,
        borderColor: '#2d3748',
    },
    addButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    addButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 8,
    },
    addButtonText: {
        color: '#ffffff',
        fontWeight: '700',
    },
    submitButton: {
        backgroundColor: '#667eea',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '800',
    },
    listItemSubText: {
        fontSize: 12,
        color: '#718096',
    },
});

export default SettingsModal;
