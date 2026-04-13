import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize } from '../styles/theme';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export const Header = ({ title, showBack = false }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      {showBack && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  backBtn: { marginBottom: spacing.xs },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: fontSize.sm },
  title: { color: colors.white, fontSize: fontSize.xl, fontWeight: '700' },
});
