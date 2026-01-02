import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DollarSign, Settings, ChevronUp, ChevronDown, ArrowDownCircle, ArrowUpCircle } from 'lucide-react-native';
import { Currency } from '../types/expense';
import { CURRENCY_SYMBOLS } from '../constants';
import { isSmallScreen, isTablet, isLandscape } from '../utils/responsive';
import { formatAmount } from '../utils/currency';

interface HeaderProps {
    currency: Currency;
    showCurrencyDropdown: boolean;
    setShowCurrencyDropdown: (show: boolean) => void;
    setShowSettings: (show: boolean) => void;
    totalExpenses: number;
    totalIncome: number;
    expenseCount: number;
    incomeCount: number;
    avgExpense: number;
    avgIncome: number;
}

const Header: React.FC<HeaderProps> = ({
    currency,
    showCurrencyDropdown,
    setShowCurrencyDropdown,
    setShowSettings,
    totalExpenses,
    totalIncome,
    expenseCount,
    incomeCount,
    avgExpense,
    avgIncome,
}) => {
    return (
        <LinearGradient colors={['#667eea', '#764ba2']} style={[
            styles.headerCard,
            isSmallScreen && styles.headerCardSmall,
            isTablet && styles.headerCardTablet,
            isLandscape && styles.headerCardLandscape
        ]}>
            <View style={[
                styles.headerTop,
                isSmallScreen && styles.headerTopSmall,
                isLandscape && styles.headerTopLandscape
            ]}>
                <View style={styles.headerInfo}>
                    <View style={[
                        styles.iconContainer,
                        isSmallScreen && styles.iconContainerSmall,
                        isTablet && styles.iconContainerTablet
                    ]}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[
                            styles.title,
                            isSmallScreen && styles.titleSmall,
                            isTablet && styles.titleTablet
                        ]}>
                            Mes Dépenses
                        </Text>
                        <Text style={[
                            styles.subtitle,
                            isSmallScreen && styles.subtitleSmall,
                            isTablet && styles.subtitleTablet
                        ]}>
                            Suivez votre budget facilement
                        </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity
                        style={[
                            styles.currencySelector,
                            isSmallScreen && styles.currencySelectorSmall,
                            isTablet && styles.currencySelectorTablet
                        ]}
                        onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                    >
                        <Text style={[
                            styles.currencyText,
                            isSmallScreen && styles.currencyTextSmall,
                            isTablet && styles.currencyTextTablet
                        ]}>
                            {currency} {showCurrencyDropdown ? <ChevronUp size={14} color="#ffffff" /> : <ChevronDown size={14} color="#ffffff" />}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowSettings(true)}>
                        <Settings size={isSmallScreen ? 18 : isTablet ? 24 : 20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.totalSection}>
                <View style={styles.mainStatsRow}>
                    <View style={styles.mainStatCard}>
                        <View style={[styles.mainStatIcon, { backgroundColor: 'rgba(252, 129, 129, 0.2)' }]}>
                            <ArrowDownCircle size={20} color="#fc8181" />
                        </View>
                        <View style={styles.mainStatInfo}>
                            <Text style={styles.mainStatLabel}>Dépenses</Text>
                            <Text style={[styles.mainStatValue, { color: '#ffffff' }]}>
                                {formatAmount(totalExpenses, currency)} <Text style={styles.mainStatCurrency}>{CURRENCY_SYMBOLS[currency]}</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.mainStatCard}>
                        <View style={[styles.mainStatIcon, { backgroundColor: 'rgba(104, 211, 145, 0.2)' }]}>
                            <ArrowUpCircle size={20} color="#68d391" />
                        </View>
                        <View style={styles.mainStatInfo}>
                            <Text style={styles.mainStatLabel}>Gains</Text>
                            <Text style={[styles.mainStatValue, { color: '#ffffff' }]}>
                                {formatAmount(totalIncome, currency)} <Text style={styles.mainStatCurrency}>{CURRENCY_SYMBOLS[currency]}</Text>
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.statsContainer, isSmallScreen && styles.statsContainerSmall]}>
                    <View style={styles.statsBox}>
                        <Text style={styles.statsBoxTitle}>DÉPENSES</Text>
                        <View style={styles.statsBoxGrid}>
                            <View style={styles.statsBoxItem}>
                                <Text style={styles.statsBoxLabel}>Nombre</Text>
                                <Text style={styles.statsBoxValue}>{expenseCount}</Text>
                            </View>
                            <View style={styles.statsBoxDivider} />
                            <View style={styles.statsBoxItem}>
                                <Text style={styles.statsBoxLabel}>Moyenne</Text>
                                <Text style={styles.statsBoxValue}>{formatAmount(avgExpense, currency)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.statsVerticalDivider} />

                    <View style={styles.statsBox}>
                        <Text style={styles.statsBoxTitle}>GAINS</Text>
                        <View style={styles.statsBoxGrid}>
                            <View style={styles.statsBoxItem}>
                                <Text style={styles.statsBoxLabel}>Nombre</Text>
                                <Text style={styles.statsBoxValue}>{incomeCount}</Text>
                            </View>
                            <View style={styles.statsBoxDivider} />
                            <View style={styles.statsBoxItem}>
                                <Text style={styles.statsBoxLabel}>Moyenne</Text>
                                <Text style={styles.statsBoxValue}>{formatAmount(avgIncome, currency)}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    headerCard: {
        padding: 24,
        paddingTop: 48,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 8,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    headerCardSmall: {
        padding: 16,
        paddingTop: 40,
    },
    headerCardTablet: {
        padding: 32,
        paddingTop: 60,
    },
    headerCardLandscape: {
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTopSmall: {
        marginBottom: 16,
    },
    headerTopLandscape: {
        marginBottom: 10,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconContainerSmall: {
        width: 36,
        height: 36,
        marginRight: 12,
    },
    iconContainerTablet: {
        width: 60,
        height: 60,
        marginRight: 20,
    },
    headerText: {
        justifyContent: 'center',
    },
    title: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    titleSmall: {
        fontSize: 18,
    },
    titleTablet: {
        fontSize: 32,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '500',
    },
    subtitleSmall: {
        fontSize: 12,
    },
    subtitleTablet: {
        fontSize: 18,
    },
    currencySelector: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySelectorSmall: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    currencySelectorTablet: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    currencyText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    currencyTextSmall: {
        fontSize: 12,
    },
    currencyTextTablet: {
        fontSize: 18,
    },
    totalSection: {
        gap: 20,
    },
    mainStatsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    mainStatCard: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mainStatIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainStatInfo: {
        flex: 1,
    },
    mainStatLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    mainStatValue: {
        fontSize: 18,
        fontWeight: '800',
    },
    mainStatCurrency: {
        fontSize: 12,
        fontWeight: '600',
        opacity: 0.8,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 24,
        padding: 16,
    },
    statsContainerSmall: {
        padding: 12,
    },
    statsBox: {
        flex: 1,
        alignItems: 'center',
    },
    statsBoxTitle: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 8,
    },
    statsBoxGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statsBoxItem: {
        alignItems: 'center',
    },
    statsBoxLabel: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 9,
        fontWeight: '600',
    },
    statsBoxValue: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '800',
    },
    statsBoxDivider: {
        width: 1,
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    statsVerticalDivider: {
        width: 1,
        height: '60%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginHorizontal: 8,
    },
});

export default Header;
