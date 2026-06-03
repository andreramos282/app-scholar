import { useColorScheme } from 'react-native';

const LIGHT = {
  primary: '#1A56DB',
  primaryDark: '#1340A8',
  primaryLight: '#EBF1FF',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#F4F6FA',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#1E293B',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  white: '#FFFFFF',
};

const DARK = {
  primary: '#0F172A',
  primaryDark: '#0b1220',
  primaryLight: '#0b1220',
  accent: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  background: '#0B1220',
  surface: '#071024',
  border: '#111827',
  textPrimary: '#E6EEF8',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export const useAppTheme = () => {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? DARK : LIGHT;
  return { colors, spacing, radius, fontSize, scheme };
};

// legacy export for quick imports (defaults to light)
export const colors = LIGHT;
