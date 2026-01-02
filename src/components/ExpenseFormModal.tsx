import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react-native';
import { NewExpense } from '../types/expense';
import { isSmallScreen, isTablet } from '../utils/responsive';

interface ExpenseFormModalProps {
    show: boolean;
    onClose: () => void;
    theme: 'light' | 'dark';
    newExpense: NewExpense;
    setNewExpense: (expense: NewExpense) => void;
    categories: string[];
    editingId: number | null;
    handleSave: () => void;
    getCategoryColor: (category: string) => string;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
    show,
    onClose,
    theme,
    newExpense,
    setNewExpense,
    categories,
    editingId,
    handleSave,
    getCategoryColor,
}) => {
    return (
        <Modal
            visible={show}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={[styles.modalContainer, { backgroundColor: theme === 'dark' ? '#1a202c' : '#ffffff' }]}>
                <LinearGradient colors={['#667eea', '#764ba2']} style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                        {editingId ? 'Modifier' : (newExpense.type === 'expense' ? 'Nouvelle' : 'Nouveau')} {newExpense.type === 'expense' ? 'Dépense' : 'Gain'}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#ffffff" />
                    </TouchableOpacity>
                </LinearGradient>

                <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
                    {/* Type Toggle */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }]}>Type</Text>
                        <View style={styles.typeGrid}>
                            <TouchableOpacity
                                onPress={() => setNewExpense({ ...newExpense, type: 'expense', category: 'Alimentation' })}
                                style={[
                                    styles.typeOption,
                                    newExpense.type === 'expense' && styles.typeOptionActive,
                                    newExpense.type === 'expense' && { backgroundColor: '#fee2e2' }
                                ]}
                            >
                                <ArrowDownCircle size={20} color={newExpense.type === 'expense' ? '#ef4444' : '#9ca3af'} />
                                <Text style={[styles.typeText, newExpense.type === 'expense' && { color: '#ef4444', fontWeight: '800' }]}>Dépense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setNewExpense({ ...newExpense, type: 'income', category: 'Salaire' })}
                                style={[
                                    styles.typeOption,
                                    newExpense.type === 'income' && styles.typeOptionActive,
                                    newExpense.type === 'income' && { backgroundColor: '#dcfce7' }
                                ]}
                            >
                                <ArrowUpCircle size={20} color={newExpense.type === 'income' ? '#22c55e' : '#9ca3af'} />
                                <Text style={[styles.typeText, newExpense.type === 'income' && { color: '#22c55e', fontWeight: '800' }]}>Gain</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Amount */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }]}>Montant</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc', color: theme === 'dark' ? '#ffffff' : '#2d3748' }]}
                            keyboardType="numeric"
                            placeholder="0.00"
                            placeholderTextColor="#a0aec0"
                            value={newExpense.amount}
                            onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
                        />
                    </View>

                    {/* Category */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }]}>Catégorie</Text>
                        <View style={styles.categoryGrid}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setNewExpense({ ...newExpense, category: cat })}
                                    style={[
                                        styles.categoryItem,
                                        { backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc' },
                                        newExpense.category === cat && { backgroundColor: '#667eea' }
                                    ]}
                                >
                                    <View style={styles.categoryContent}>
                                        <View style={[styles.colorDot, { backgroundColor: getCategoryColor(cat) }]} />
                                        <Text style={[styles.categoryText, newExpense.category === cat && { color: '#ffffff' }]}>{cat}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Date */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }]}>Date</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc', color: theme === 'dark' ? '#ffffff' : '#2d3748' }]}
                            placeholder="AAAA-MM-JJ"
                            placeholderTextColor="#a0aec0"
                            value={newExpense.date}
                            onChangeText={(text) => setNewExpense({ ...newExpense, date: text })}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.formGroup}>
                        <Text style={[styles.label, { color: theme === 'dark' ? '#cbd5e0' : '#4a5568' }]}>Description (Optionnel)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme === 'dark' ? '#2d3748' : '#f7fafc', color: theme === 'dark' ? '#ffffff' : '#2d3748' }]}
                            placeholder="Ex: Courses mensuelles"
                            placeholderTextColor="#a0aec0"
                            value={newExpense.description}
                            onChangeText={(text) => setNewExpense({ ...newExpense, description: text })}
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveButtonGradient}>
                            <Text style={styles.saveButtonText}>Enregistrer</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        padding: 24,
        paddingTop: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '800',
    },
    closeButton: {
        padding: 8,
    },
    form: {
        flex: 1,
    },
    formContent: {
        padding: 24,
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    typeGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    typeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#f7fafc',
        gap: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    typeOptionActive: {
        borderColor: 'rgba(0,0,0,0.05)',
    },
    typeText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#4a5568',
    },
    input: {
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4a5568',
    },
    categoryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    saveButton: {
        marginTop: 12,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    saveButtonGradient: {
        padding: 18,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
});

export default ExpenseFormModal;
