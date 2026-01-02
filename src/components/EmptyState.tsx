import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DollarSign } from 'lucide-react-native';
import { isSmallScreen, isTablet } from '../utils/responsive';

interface EmptyStateProps {
    theme: 'light' | 'dark';
}

const EmptyState: React.FC<EmptyStateProps> = ({ theme }) => {
    return (
        <View style={[
            styles.emptyState,
            isSmallScreen && styles.emptyStateSmall,
            isTablet && styles.emptyStateTablet
        ]}>
            <DollarSign
                size={isSmallScreen ? 32 : isTablet ? 56 : 48}
                color="#cbd5e0"
            />
            <Text style={[
                styles.emptyStateText,
                isSmallScreen && styles.emptyStateTextSmall,
                isTablet && styles.emptyStateTextTablet,
                { color: theme === 'dark' ? '#a0aec0' : '#718096' }
            ]}>
                Aucune donnée enregistrée
            </Text>
            <Text style={[
                styles.emptyStateSubtext,
                isSmallScreen && styles.emptyStateSubtextSmall,
                isTablet && styles.emptyStateSubtextTablet,
                { color: theme === 'dark' ? '#718096' : '#a0aec0' }
            ]}>
                Appuyez sur le bouton + pour commencer
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyStateSmall: {
        paddingVertical: 20,
    },
    emptyStateTablet: {
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
    },
    emptyStateTextSmall: {
        fontSize: 16,
        marginTop: 12,
    },
    emptyStateTextTablet: {
        fontSize: 22,
        marginTop: 20,
    },
    emptyStateSubtext: {
        fontSize: 14,
        marginTop: 8,
    },
    emptyStateSubtextSmall: {
        fontSize: 12,
    },
    emptyStateSubtextTablet: {
        fontSize: 16,
    },
});

export default EmptyState;
