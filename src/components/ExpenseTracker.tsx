import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  AppState,
  AppStateStatus,
  useWindowDimensions,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
import { Expense, NewExpense, ViewMode, Currency, CustomCategory, Budget, RecurringTransaction } from '../types/expense';

// Constants
import {
  STORAGE_KEY,
  CURRENCY_KEY,
  THEME_KEY,
  NOTIFICATIONS_KEY,
  NOTIFICATION_HOURS_KEY,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_CATEGORY_COLORS,
} from '../constants';

// Utils
import { convertAmount } from '../utils/currency';
import { getWeekNumber } from '../utils/date';
import { saveExpenses, saveCurrency, saveTheme, saveCustomCategories, saveBudgets, saveRecurringTransactions, loadExpenses, loadBudgets, loadRecurringTransactions } from '../utils/storage';
import { processRecurringTransactions } from '../utils/recurring';
import {
  isSmallScreen,
  isTablet,
  isLandscape,
  getResponsivePadding,
} from '../utils/responsive';
import {
  requestNotificationPermissions,
  scheduleDailyReminders,
  cancelAllReminders
} from '../utils/notificationHelper';

// Components
import Header from './Header';
import CurrencyDropdown from './CurrencyDropdown';
import CurrencyConfirmationModal from './CurrencyConfirmationModal';
import SettingsModal from './SettingsModal';
import ExpenseFormModal from './ExpenseFormModal';
import ChartSection from './ChartSection';
import RecentExpenses from './RecentExpenses';
import BudgetSection from './BudgetSection';

const ExpenseTracker: React.FC = () => {
  // --- State ---
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expenseViewMode, setExpenseViewMode] = useState<ViewMode>('jour');
  const [incomeViewMode, setIncomeViewMode] = useState<ViewMode>('jour');
  const [currency, setCurrency] = useState<Currency>('XOF');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showCurrencyConfirmation, setShowCurrencyConfirmation] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState<Currency | null>(null);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#667eea');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeChart, setActiveChart] = useState<'expense' | 'income'>('expense');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationHours, setNotificationHours] = useState<number[]>([19, 22]);
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newExpense, setNewExpense] = useState<NewExpense>({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Alimentation',
    description: '',
    type: 'expense'
  });

  // --- Reset Handlers ---
  const handleResetData = async () => {
    Alert.alert(
      "Réinitialiser les données",
      "Voulez-vous vraiment effacer toutes vos transactions ? Vos catégories et budgets seront conservés.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: async () => {
            setExpenses([]);
            await saveExpenses([]);
            Alert.alert("Succès", "Toutes les transactions ont été effacées.");
          }
        }
      ]
    );
  };

  const handleResetAll = async () => {
    Alert.alert(
      "Réinitialisation Complète",
      "ATTENTION : Ceci effacera TOUTES les données (transactions, catégories, budgets, réglages) et remettra l'application à zéro. Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Tout effacer",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            setExpenses([]);
            setCustomCategories([]);
            setBudgets([]);
            setRecurringTransactions([]);
            setCurrency('XOF');
            setTheme('light');
            setNotificationsEnabled(false);
            Alert.alert("Réinitialisé", "L'application a été remise à neuf.");
          }
        }
      ]
    );
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const appState = useRef(AppState.currentState);

  // --- Memos ---
  const categories = useMemo(() => {
    const defaults = newExpense.type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES;
    const typeCustom = customCategories.filter(c => c.type === newExpense.type).map(c => c.name);
    return [...defaults, ...typeCustom];
  }, [customCategories, newExpense.type]);

  const expensesOnly = useMemo(() => expenses.filter(e => (e.type || 'expense') === 'expense'), [expenses]);
  const incomeOnly = useMemo(() => expenses.filter(e => e.type === 'income'), [expenses]);
  const totalExpenses = useMemo(() => expensesOnly.reduce((sum, exp) => sum + exp.amount, 0), [expensesOnly]);
  const totalIncome = useMemo(() => incomeOnly.reduce((sum, exp) => sum + exp.amount, 0), [incomeOnly]);

  const expenseCount = expensesOnly.length;
  const incomeCount = incomeOnly.length;
  const avgExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;
  const avgIncome = incomeCount > 0 ? totalIncome / incomeCount : 0;

  const chartWidth = useMemo(() => {
    if (isTablet) return Math.min(screenWidth - 80, 600);
    if (isLandscape) return Math.min(screenWidth - 60, 500);
    return Math.min(screenWidth - getResponsivePadding(20) * 2, 400);
  }, [screenWidth]);

  const chartHeight = useMemo(() => {
    if (isLandscape) return 150;
    if (isTablet) return 220;
    return 180;
  }, [isLandscape, isTablet]);

  // --- Effects ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedExpenses = await loadExpenses();
        const loadedBudgets = await loadBudgets();
        const loadedRecurring = await loadRecurringTransactions();

        setBudgets(loadedBudgets);
        setRecurringTransactions(loadedRecurring);

        // Process recurring transactions
        const lastLaunch = await AsyncStorage.getItem('@expenses_last_launch');
        const { newExpenses, updatedRecurringItems } = processRecurringTransactions(
          loadedRecurring,
          loadedExpenses,
          lastLaunch
        );

        let finalExpenses = loadedExpenses;
        if (newExpenses.length > 0) {
          finalExpenses = [...loadedExpenses, ...newExpenses];
          await saveExpenses(finalExpenses);
          await saveRecurringTransactions(updatedRecurringItems);
          setRecurringTransactions(updatedRecurringItems);
        }
        setExpenses(finalExpenses);
        await AsyncStorage.setItem('@expenses_last_launch', new Date().toISOString());

        const storedCurrency = await AsyncStorage.getItem(CURRENCY_KEY) as Currency;
        if (storedCurrency) setCurrency(storedCurrency);

        const storedTheme = await AsyncStorage.getItem(THEME_KEY) as 'light' | 'dark';
        if (storedTheme) setTheme(storedTheme);

        const storedNotifs = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (storedNotifs === null) {
          setNotificationsEnabled(true); // Default to true
          await AsyncStorage.setItem(NOTIFICATIONS_KEY, 'true');
        } else if (storedNotifs === 'true') {
          setNotificationsEnabled(true);
        }

        const storedHours = await AsyncStorage.getItem(NOTIFICATION_HOURS_KEY);
        if (storedHours) setNotificationHours(JSON.parse(storedHours));

        const storedCats = await AsyncStorage.getItem('@expenses_custom_categories');
        if (storedCats) setCustomCategories(JSON.parse(storedCats));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/)) {
        await saveExpenses(expenses);
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [expenses]);

  useEffect(() => {
    const handleNotifications = async () => {
      if (notificationsEnabled) {
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await scheduleDailyReminders(notificationHours);
        } else {
          setNotificationsEnabled(false);
          await AsyncStorage.setItem(NOTIFICATIONS_KEY, 'false');
        }
      } else {
        await cancelAllReminders();
      }
    };
    handleNotifications();
  }, [notificationsEnabled, notificationHours]);

  // --- Handlers ---
  const handleToggleNotifications = async () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, newState.toString());
  };

  const handleSaveExpense = async () => {
    if (!newExpense.amount || isNaN(parseFloat(newExpense.amount)) || parseFloat(newExpense.amount) <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    let updatedExpenses;
    if (editingId) {
      updatedExpenses = expenses.map(exp => exp.id === editingId ? { ...exp, ...newExpense, amount: parseFloat(newExpense.amount) } : exp);
    } else {
      updatedExpenses = [...expenses, { ...newExpense, id: Date.now(), amount: parseFloat(newExpense.amount) }];
    }

    setExpenses(updatedExpenses);
    await saveExpenses(updatedExpenses);
    setShowForm(false);
    setEditingId(null);
    setNewExpense({ date: new Date().toISOString().split('T')[0], amount: '', category: 'Alimentation', description: '', type: 'expense' });
  };

  const handleDeleteExpense = (id: number) => {
    Alert.alert('Supprimer', 'Êtes-vous sûr ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer', style: 'destructive', onPress: async () => {
          const updated = expenses.filter(e => e.id !== id);
          setExpenses(updated);
          await saveExpenses(updated);
        }
      }
    ]);
  };

  const handleConfirmCurrency = async (shouldConvert: boolean) => {
    if (shouldConvert && pendingCurrency) {
      if (expenses.length > 0) {
        const converted = expenses.map(e => ({ ...e, amount: convertAmount(e.amount, currency, pendingCurrency) }));
        setExpenses(converted);
        await saveExpenses(converted);
      }

      if (budgets.length > 0) {
        const convertedBudgets = budgets.map(b => ({ ...b, limit: convertAmount(b.limit, currency, pendingCurrency) }));
        setBudgets(convertedBudgets);
        await saveBudgets(convertedBudgets);
      }

      if (recurringTransactions.length > 0) {
        const convertedRecurring = recurringTransactions.map(r => ({ ...r, amount: convertAmount(r.amount, currency, pendingCurrency) }));
        setRecurringTransactions(convertedRecurring);
        await saveRecurringTransactions(convertedRecurring);
      }
    }
    if (pendingCurrency) {
      setCurrency(pendingCurrency);
      await saveCurrency(pendingCurrency);
    }
    setShowCurrencyConfirmation(false);
    setPendingCurrency(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const newCat: CustomCategory = { name: newCategoryName.trim(), color: newCategoryColor, type: categoryType };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    await saveCustomCategories(updated);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (name: string) => {
    const updated = customCategories.filter(c => c.name !== name);
    setCustomCategories(updated);
    saveCustomCategories(updated);
  };

  const getCategoryColor = (category: string) => {
    const custom = customCategories.find(c => c.name === category);
    return custom ? custom.color : DEFAULT_CATEGORY_COLORS[category] || '#b8b8b8';
  };

  const getChartData = (type: 'expense' | 'income') => {
    const filtered = expenses.filter(e => (e.type || 'expense') === type);
    const sorted = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const mode = type === 'expense' ? expenseViewMode : incomeViewMode;

    const grouped: { [key: string]: number } = {};
    sorted.forEach(exp => {
      let key = exp.date;
      if (mode === 'semaine') key = `S${getWeekNumber(new Date(exp.date))}`;
      else if (mode === 'mois') key = new Date(exp.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      else if (mode === 'année') key = new Date(exp.date).getFullYear().toString();
      grouped[key] = (grouped[key] || 0) + exp.amount;
    });

    const labels = Object.keys(grouped).map(k => mode === 'jour' ? new Date(k).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : k);

    // Round data values if needed (for CFA/XOF)
    const isCFA = currency === 'XOF' || currency === 'FCFA';
    const dataValues = Object.values(grouped).map(val => isCFA ? Math.round(val) : val);

    return { labels, datasets: [{ data: dataValues }] };
  };

  const getChartConfig = (type: 'expense' | 'income') => ({
    backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
    backgroundGradientFrom: theme === 'dark' ? '#2d3748' : '#f7fafc',
    backgroundGradientTo: theme === 'dark' ? '#1a202c' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => type === 'expense'
      ? (theme === 'dark' ? `rgba(159, 122, 234, ${opacity})` : `rgba(102, 126, 234, ${opacity})`)
      : (theme === 'dark' ? `rgba(34, 197, 94, ${opacity})` : `rgba(22, 163, 74, ${opacity})`),
    labelColor: (opacity = 1) => theme === 'dark' ? `rgba(226, 232, 240, ${opacity})` : `rgba(107, 114, 128, ${opacity})`,
    barPercentage: isSmallScreen ? 0.65 : 0.75,
    barRadius: 8,
    propsForLabels: { fontSize: isSmallScreen ? 10 : 12, rotation: isSmallScreen ? -45 : -30, fontWeight: '700', fill: theme === 'dark' ? '#e2e8f0' : '#4a5568' },
    fillShadowGradient: type === 'income' ? (theme === 'dark' ? '#22c55e' : '#16a34a') : (theme === 'dark' ? '#9f7aea' : '#667eea'),
    fillShadowGradientOpacity: 1,
  });

  const recentExpensesList = useMemo(() => {
    let res = expenses.filter(e => historyFilter === 'all' || (e.type || 'expense') === historyFilter);
    if (searchQuery.trim()) {
      res = res.filter(e =>
        e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    res.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.id - a.id;
    });
    return showAllExpenses ? res : res.slice(0, isSmallScreen ? 5 : isTablet ? 15 : 10);
  }, [expenses, historyFilter, searchQuery, showAllExpenses]);

  // --- Render ---
  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#1a202c' : '#f7fafc' }]}>
      <CurrencyDropdown
        show={showCurrencyDropdown}
        onClose={() => setShowCurrencyDropdown(false)}
        currentCurrency={currency}
        onSelect={(curr) => {
          if (expenses.length > 0 && curr !== currency) {
            setPendingCurrency(curr);
            setShowCurrencyDropdown(false);
            setShowCurrencyConfirmation(true);
          } else {
            setCurrency(curr);
            saveCurrency(curr);
            setShowCurrencyDropdown(false);
          }
        }}
      />

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        setTheme={(t) => { setTheme(t); saveTheme(t); }}
        currency={currency}
        onCurrencyChange={(curr) => {
          if (expenses.length > 0 && curr !== currency) {
            setPendingCurrency(curr);
            setShowSettings(false);
            setShowCurrencyConfirmation(true);
          } else {
            setCurrency(curr);
            saveCurrency(curr);
          }
        }}
        notificationsEnabled={notificationsEnabled}
        toggleNotifications={handleToggleNotifications}
        notificationHours={notificationHours}
        setNotificationHours={async (h) => { setNotificationHours(h); await AsyncStorage.setItem(NOTIFICATION_HOURS_KEY, JSON.stringify(h)); }}
        customCategories={customCategories}
        categoryType={categoryType}
        setCategoryType={setCategoryType}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        newCategoryColor={newCategoryColor}
        setNewCategoryColor={setNewCategoryColor}
        addCustomCategory={handleAddCategory}
        deleteCustomCategory={handleDeleteCategory}
        budgets={budgets}
        setBudgets={setBudgets}
        recurringTransactions={recurringTransactions}
        setRecurringTransactions={setRecurringTransactions}
        onResetData={handleResetData}
        onResetAll={handleResetAll}
      />

      <CurrencyConfirmationModal
        show={showCurrencyConfirmation}
        onClose={() => setShowCurrencyConfirmation(false)}
        theme={theme}
        expenseCount={expenses.length}
        currentCurrency={currency}
        pendingCurrency={pendingCurrency}
        onConfirm={handleConfirmCurrency}
      />

      <ExpenseFormModal
        show={showForm}
        onClose={() => setShowForm(false)}
        theme={theme}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        categories={categories}
        editingId={editingId}
        handleSave={handleSaveExpense}
        getCategoryColor={getCategoryColor}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowForm(true)}
      >
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.fabGradient}>
          <Plus size={isSmallScreen ? 20 : isTablet ? 28 : 24} color="#ffffff" />
        </LinearGradient>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { backgroundColor: theme === 'dark' ? '#1a202c' : '#f7fafc' }]}>
        <Header
          currency={currency}
          showCurrencyDropdown={showCurrencyDropdown}
          setShowCurrencyDropdown={setShowCurrencyDropdown}
          setShowSettings={setShowSettings}
          totalExpenses={totalExpenses}
          totalIncome={totalIncome}
          expenseCount={expenseCount}
          incomeCount={incomeCount}
          avgExpense={avgExpense}
          avgIncome={avgIncome}
        />

        <BudgetSection
          budgets={budgets}
          expenses={expenses}
          currency={currency}
          theme={theme}
        />

        <ChartSection
          activeChart={activeChart}
          setActiveChart={setActiveChart}
          theme={theme}
          expenseViewMode={expenseViewMode}
          setExpenseViewMode={setExpenseViewMode}
          incomeViewMode={incomeViewMode}
          setIncomeViewMode={setIncomeViewMode}
          expenseChartData={getChartData('expense')}
          incomeChartData={getChartData('income')}
          chartWidth={chartWidth}
          chartHeight={chartHeight}
          getChartConfig={getChartConfig}
          expenses={expenses}
          currency={currency}
        />

        <RecentExpenses
          expenses={expenses}
          recentExpenses={recentExpensesList}
          currency={currency}
          theme={theme}
          historyFilter={historyFilter}
          setHistoryFilter={setHistoryFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showAllExpenses={showAllExpenses}
          setShowAllExpenses={setShowAllExpenses}
          startEditing={(exp) => {
            setNewExpense({ ...exp, amount: exp.amount.toString() });
            setEditingId(exp.id);
            setShowForm(true);
          }}
          deleteExpense={handleDeleteExpense}
          getCategoryColor={getCategoryColor}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 999,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExpenseTracker;
