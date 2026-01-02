import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Currency } from '../types/expense';
import { CURRENCY_SYMBOLS } from '../constants';

interface CurrencyConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
    expenseCount: number;
    currentCurrency: Currency;
    pendingCurrency: Currency | null;
    onConfirm: (shouldConvert: boolean) => void;
}

const CurrencyConfirmationModal: React.FC<CurrencyConfirmationModalProps> = ({
    show,
    onClose,
    theme,
    expenseCount,
    currentCurrency,
    pendingCurrency,
    onConfirm,
}) => {
    return (
        <Modal
            visible={show}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.confirmationOverlay}>
                <View style={[
                    styles.confirmationDialog,
                    { backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff' }
                ]}>
                    <Text style={[
                        styles.confirmationTitle,
                        { color: theme === 'dark' ? '#f7fafc' : '#2d3748' }
                    ]}>
                        Changement de devise
                    </Text>
                    <Text style={[
                        styles.confirmationMessage,
                        { color: theme === 'dark' ? '#e2e8f0' : '#4a5568' }
                    ]}>
                        Vous avez {expenseCount} dépense(s) enregistrée(s).
                        {'\n\n'}
                        Voulez-vous convertir les montants existants de {currentCurrency} vers {pendingCurrency} ?
                    </Text>

                    <View style={styles.confirmationButtons}>
                        <TouchableOpacity
                            style={[styles.confirmationButton, styles.confirmationButtonSecondary]}
                            onPress={() => onConfirm(false)}
                        >
                            <Text style={styles.confirmationButtonTextSecondary}>
                                Changer seulement la devise
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.confirmationButton, styles.confirmationButtonPrimary]}
                            onPress={() => onConfirm(true)}
                        >
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.confirmationButtonGradient}
                            >
                                <Text style={styles.confirmationButtonTextPrimary}>
                                    Convertir les montants
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.confirmationCancelButton}
                        onPress={onClose}
                    >
                        <Text style={[
                            styles.confirmationCancelText,
                            { color: theme === 'dark' ? '#cbd5e0' : '#718096' }
                        ]}>
                            Annuler
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    confirmationOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    confirmationDialog: {
        width: '100%',
        borderRadius: 28,
        padding: 24,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    confirmationTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 16,
        textAlign: 'center',
    },
    confirmationMessage: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
        textAlign: 'center',
    },
    confirmationButtons: {
        gap: 12,
    },
    confirmationButton: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    confirmationButtonPrimary: {
        height: 56,
    },
    confirmationButtonSecondary: {
        height: 56,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmationButtonTextPrimary: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    confirmationButtonTextSecondary: {
        color: '#4a5568',
        fontSize: 15,
        fontWeight: '700',
    },
    confirmationCancelButton: {
        marginTop: 16,
        padding: 8,
        alignItems: 'center',
    },
    confirmationCancelText: {
        fontSize: 15,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default CurrencyConfirmationModal;
