import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useAppTheme } from '../styles/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const styles = StyleSheet.create({
    container: { marginBottom: spacing.md },
    label: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      fontSize: fontSize.md,
      color: colors.textPrimary,
      backgroundColor: colors.white,
    },
    inputError: { borderColor: colors.danger },
    error: { fontSize: fontSize.xs, color: colors.danger, marginTop: spacing.xs },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

// styles are created dynamically inside the component to follow device theme
