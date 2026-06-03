import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { useAppTheme } from '../styles/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const styles = StyleSheet.create({
    base: {
      borderRadius: radius.md,
      paddingVertical: spacing.md - 2,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    primary: { backgroundColor: colors.primary },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
    danger: { backgroundColor: colors.danger },
    disabled: { opacity: 0.5 },
    text: { color: colors.white, fontSize: fontSize.md, fontWeight: '600' },
    textOutline: { color: colors.primary },
    textWhite: { color: colors.white },
  });

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'outline' && styles.textOutline,
            variant === 'danger' && styles.textWhite,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
