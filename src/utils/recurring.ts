import { RecurringTransaction, Expense, RecurrencePeriod } from '../types/expense';

export const processRecurringTransactions = (
    recurringItems: RecurringTransaction[],
    expenses: Expense[],
    lastProcessedDate: string | null
): { newExpenses: Expense[], updatedRecurringItems: RecurringTransaction[] } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newExpenses: Expense[] = [];
    const updatedRecurringItems = [...recurringItems];

    updatedRecurringItems.forEach((item, index) => {
        let checkDate = item.lastProcessedDate ? new Date(item.lastProcessedDate) : new Date(item.startDate);
        checkDate.setHours(0, 0, 0, 0);

        // Skip if future start date
        if (new Date(item.startDate) > today) return;

        while (true) {
            let nextDate = new Date(checkDate);

            if (item.period === 'daily') nextDate.setDate(nextDate.getDate() + 1);
            else if (item.period === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
            else if (item.period === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
            else if (item.period === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);

            if (nextDate > today) break;

            // Create new expense
            const newExp: Expense = {
                id: Date.now() + Math.random(),
                date: nextDate.toISOString().split('T')[0],
                amount: item.amount,
                category: item.category,
                description: `[Récurrent] ${item.description}`,
                type: item.type,
                isRecurring: true
            };

            newExpenses.push(newExp);
            checkDate = nextDate;
        }

        updatedRecurringItems[index] = { ...item, lastProcessedDate: checkDate.toISOString() };
    });

    return { newExpenses, updatedRecurringItems };
};
