import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useColorScheme } from 'react-native';

export default function App() {
  const scheme = useColorScheme();
  const barStyle = scheme === 'dark' ? 'light' : 'dark';

  return (
    <AuthProvider>
      <StatusBar style={barStyle} />
      <AppNavigator />
    </AuthProvider>
  );
}
