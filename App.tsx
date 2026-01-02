import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ExpenseTracker from './src/components/ExpenseTracker';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <ExpenseTracker />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}