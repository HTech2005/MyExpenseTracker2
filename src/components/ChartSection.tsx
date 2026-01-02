import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { ViewMode, Currency } from '../types/expense';
import { isSmallScreen, isTablet, isLandscape } from '../utils/responsive';
import { formatAmount } from '../utils/currency';

interface ChartSectionProps {
    activeChart: 'expense' | 'income';
    setActiveChart: (chart: 'expense' | 'income') => void;
    theme: 'light' | 'dark';
    expenseViewMode: ViewMode;
    setExpenseViewMode: (mode: ViewMode) => void;
    incomeViewMode: ViewMode;
    setIncomeViewMode: (mode: ViewMode) => void;
    expenseChartData: any;
    incomeChartData: any;
    chartWidth: number;
    chartHeight: number;
    getChartConfig: (type: 'expense' | 'income') => any;
    expenses: any[];
    currency: Currency;
}

const ChartSection: React.FC<ChartSectionProps> = ({
    activeChart,
    setActiveChart,
    theme,
    expenseViewMode,
    setExpenseViewMode,
    incomeViewMode,
    setIncomeViewMode,
    expenseChartData,
    incomeChartData,
    chartWidth,
    chartHeight,
    getChartConfig,
    expenses,
    currency,
}) => {
    const [chartType, setChartType] = useState<'temporal' | 'category'>('temporal');
    const currentViewMode = activeChart === 'expense' ? expenseViewMode : incomeViewMode;
    const setViewMode = activeChart === 'expense' ? setExpenseViewMode : setIncomeViewMode;
    const categoryData = useMemo(() => {
        const filtered = expenses.filter(e => (e.type || 'expense') === activeChart);
        const grouped: { [key: string]: number } = {};
        filtered.forEach(e => {
            grouped[e.category] = (grouped[e.category] || 0) + e.amount;
        });

        const colors = ['#667eea', '#fc8181', '#68d391', '#f6ad55', '#4299e1', '#b8b8b8'];
        const isCFA = currency === 'XOF' || currency === 'FCFA';
        return Object.entries(grouped).map(([name, population], i) => ({
            name,
            population: isCFA ? Math.round(population) : population,
            color: colors[i % colors.length],
            legendFontColor: theme === 'dark' ? '#cbd5e0' : '#4a5568',
            legendFontSize: 12
        })).sort((a, b) => b.population - a.population);
    }, [expenses, activeChart, theme, currency]);

    const chartData = activeChart === 'expense' ? expenseChartData : incomeChartData;

    return (
        <View>
            <View style={[
                styles.chartToggleContainer,
                { backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
            ]}>
                <TouchableOpacity
                    onPress={() => setActiveChart('expense')}
                    style={[
                        styles.chartToggleButton,
                        activeChart === 'expense' && styles.chartToggleButtonActive,
                        activeChart === 'expense' && { backgroundColor: theme === 'dark' ? '#ffffff' : '#ffffff' }
                    ]}
                >
                    <Text style={[
                        styles.chartToggleText,
                        { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#718096' },
                        activeChart === 'expense' && styles.chartToggleTextActive
                    ]}>
                        Dépenses
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveChart('income')}
                    style={[
                        styles.chartToggleButton,
                        activeChart === 'income' && styles.chartToggleButtonActive,
                        activeChart === 'income' && { backgroundColor: theme === 'dark' ? '#ffffff' : '#ffffff' }
                    ]}
                >
                    <Text style={[
                        styles.chartToggleText,
                        { color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : '#718096' },
                        activeChart === 'income' && { color: '#48bb78', fontWeight: 'bold' }
                    ]}>
                        Gains
                    </Text>
                </TouchableOpacity>
            </View>

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
                    <View style={styles.cardTitle}>
                        <TrendingUp
                            size={isSmallScreen ? 16 : isTablet ? 24 : 20}
                            color={activeChart === 'expense' ? '#667eea' : '#48bb78'}
                        />
                        <Text style={[
                            styles.cardTitleText,
                            isSmallScreen && styles.cardTitleTextSmall,
                            isTablet && styles.cardTitleTextTablet,
                            { color: theme === 'dark' ? '#f7fafc' : '#2d3748' }
                        ]}>
                            Évolution des {activeChart === 'expense' ? 'Dépenses' : 'Gains'}
                        </Text>
                    </View>
                </View>
                <View style={styles.chartTypeTabs}>
                    <TouchableOpacity
                        onPress={() => setChartType('temporal')}
                        style={[styles.chartTypeTab, chartType === 'temporal' && styles.chartTypeTabActive]}
                    >
                        <Text style={[styles.chartTypeTabText, chartType === 'temporal' && styles.chartTypeTabTextActive]}>Temporel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setChartType('category')}
                        style={[styles.chartTypeTab, chartType === 'category' && styles.chartTypeTabActive]}
                    >
                        <Text style={[styles.chartTypeTabText, chartType === 'category' && styles.chartTypeTabTextActive]}>Catégories</Text>
                    </TouchableOpacity>
                </View>

                {chartType === 'temporal' && (
                    <View style={[
                        styles.viewModeContainer,
                        isSmallScreen && styles.viewModeContainerSmall,
                        isTablet && styles.viewModeContainerTablet,
                        { marginTop: 12 }
                    ]}>
                        {(['jour', 'semaine', 'mois', 'année'] as const).map((mode) => (
                            <TouchableOpacity
                                key={mode}
                                onPress={() => setViewMode(mode)}
                                style={[
                                    styles.viewModeButton,
                                    isSmallScreen && styles.viewModeButtonSmall,
                                    isTablet && styles.viewModeButtonTablet,
                                    currentViewMode === mode ? styles.viewModeButtonActive : styles.viewModeButtonInactive
                                ]}
                            >
                                <Text style={[
                                    styles.viewModeText,
                                    isSmallScreen && styles.viewModeTextSmall,
                                    isTablet && styles.viewModeTextTablet,
                                    currentViewMode === mode ? styles.viewModeTextActive : styles.viewModeTextInactive
                                ]}>
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {chartType === 'temporal' ? (
                chartData.labels.length > 0 ? (
                    <View style={styles.chartWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <BarChart
                                data={chartData}
                                width={Math.max(chartWidth, (chartWidth / 5) * chartData.labels.length)}
                                height={chartHeight}
                                yAxisLabel=""
                                yAxisSuffix=""
                                chartConfig={getChartConfig(activeChart)}
                                style={styles.chart}
                                showValuesOnTopOfBars
                                fromZero
                                withInnerLines={true}
                                segments={4}
                                verticalLabelRotation={isSmallScreen ? -90 : -45}
                                // @ts-ignore
                                formatYLabel={(y) => formatAmount(parseFloat(y), currency)}
                            />
                        </ScrollView>
                    </View>
                ) : (
                    <View style={[
                        styles.noDataContainer,
                        { height: chartHeight }
                    ]}>
                        <Text style={[
                            styles.noDataText,
                            isSmallScreen && styles.noDataTextSmall,
                            isTablet && styles.noDataTextTablet
                        ]}>
                            Aucune donnée à afficher
                        </Text>
                    </View>
                )
            ) : (
                <View style={styles.chartWrapper}>
                    <PieChart
                        data={categoryData}
                        width={chartWidth}
                        height={chartHeight + 40}
                        chartConfig={getChartConfig(activeChart)}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chartToggleContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 4,
    },
    chartToggleButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    chartToggleButtonActive: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chartToggleText: {
        fontSize: 14,
        fontWeight: '700',
    },
    chartToggleTextActive: {
        color: '#667eea',
    },
    chartTypeTabs: {
        flexDirection: 'row',
        marginTop: 12,
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        padding: 2,
    },
    chartTypeTab: {
        flex: 1,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 8,
    },
    chartTypeTabActive: {
        backgroundColor: '#ffffff',
        elevation: 2,
    },
    chartTypeTabText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '700',
    },
    chartTypeTabTextActive: {
        color: '#667eea',
    },
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    viewModeContainer: {
        flexDirection: 'row',
        backgroundColor: '#f7fafc',
        padding: 4,
        borderRadius: 12,
    },
    viewModeContainerSmall: {
        borderRadius: 8,
    },
    viewModeContainerTablet: {
        padding: 6,
        borderRadius: 16,
    },
    viewModeButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    viewModeButtonSmall: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    viewModeButtonTablet: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 14,
    },
    viewModeButtonActive: {
        backgroundColor: '#ffffff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    viewModeButtonInactive: {},
    viewModeText: {
        fontSize: 13,
        fontWeight: '700',
    },
    viewModeTextSmall: {
        fontSize: 12,
    },
    viewModeTextTablet: {
        fontSize: 16,
    },
    viewModeTextActive: {
        color: '#667eea',
    },
    viewModeTextInactive: {
        color: '#a0aec0',
    },
    chartWrapper: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingRight: 10,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noDataText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#718096',
        marginTop: 12,
    },
    noDataTextSmall: {
        fontSize: 14,
    },
    noDataTextTablet: {
        fontSize: 20,
    },
    noDataSubtext: {
        fontSize: 12,
        color: '#a0aec0',
        marginTop: 4,
        textAlign: 'center',
    },
    noDataSubtextSmall: {
        fontSize: 11,
    },
    noDataSubtextTablet: {
        fontSize: 16,
    },
});

export default ChartSection;
