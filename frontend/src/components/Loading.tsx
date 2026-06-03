import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../styles/theme';

export const Loading = ({ message = 'Carregando...' }: { message?: string }) => {
  const { colors, spacing, fontSize } = useAppTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    text: { marginTop: spacing.md, color: colors.textSecondary, fontSize: fontSize.sm },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};
