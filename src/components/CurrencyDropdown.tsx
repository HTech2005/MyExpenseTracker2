import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Currency } from '../types/expense';
import { CURRENCIES, CURRENCY_SYMBOLS } from '../constants';
import { isSmallScreen, isTablet } from '../utils/responsive';

interface CurrencyDropdownProps {
    show: boolean;
    onClose: () => void;
    currentCurrency: Currency;
    onSelect: (currency: Currency) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
    show,
    onClose,
    currentCurrency,
    onSelect,
}) => {
    return (
        <Modal
            visible={show}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.currencyDropdownOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[
                    styles.currencyDropdown,
                    isSmallScreen && styles.currencyDropdownSmall,
                    isTablet && styles.currencyDropdownTablet
                ]}>
                    {CURRENCIES.map((curr) => (
                        <TouchableOpacity
                            key={curr}
                            style={[
                                styles.currencyOption,
                                isSmallScreen && styles.currencyOptionSmall,
                                isTablet && styles.currencyOptionTablet,
                                currentCurrency === curr && styles.currencyOptionActive
                            ]}
                            onPress={() => onSelect(curr)}
                        >
                            <Text style={[
                                styles.currencyOptionText,
                                isSmallScreen && styles.currencyOptionTextSmall,
                                isTablet && styles.currencyOptionTextTablet,
                                currentCurrency === curr && styles.currencyOptionTextActive
                            ]}>
                                {curr} ({CURRENCY_SYMBOLS[curr]})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    currencyDropdownOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    currencyDropdown: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 8,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
    },
    currencyDropdownSmall: {
        width: '90%',
    },
    currencyDropdownTablet: {
        width: 300,
    },
    currencyOption: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    currencyOptionSmall: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    currencyOptionTablet: {
        paddingVertical: 20,
        paddingHorizontal: 24,
    },
    currencyOptionActive: {
        backgroundColor: '#f0f4ff',
    },
    currencyOptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4a5568',
    },
    currencyOptionTextSmall: {
        fontSize: 14,
    },
    currencyOptionTextTablet: {
        fontSize: 20,
    },
    currencyOptionTextActive: {
        color: '#667eea',
        fontWeight: '800',
    },
});

export default CurrencyDropdown;
