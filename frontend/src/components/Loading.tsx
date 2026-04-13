import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../styles/theme';

export const Loading = ({ message = 'Carregando...' }: { message?: string }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  text: { marginTop: spacing.md, color: colors.textSecondary, fontSize: fontSize.sm },
});
