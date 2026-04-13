import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius, fontSize } from '../styles/theme';
import { AppStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<AppStackParamList>;

interface MenuCard {
  icon: string;
  title: string;
  subtitle: string;
  screen: keyof AppStackParamList;
  color: string;
}

const MENU_CARDS: MenuCard[] = [
  { icon: '👤', title: 'Alunos', subtitle: 'Gerenciar cadastros', screen: 'CadastroAlunos', color: '#4F46E5' },
  { icon: '👨‍🏫', title: 'Professores', subtitle: 'Gerenciar corpo docente', screen: 'CadastroProfessores', color: '#0891B2' },
  { icon: '📚', title: 'Disciplinas', subtitle: 'Gerenciar matérias', screen: 'CadastroDisciplinas', color: '#059669' },
  { icon: '📋', title: 'Boletim', subtitle: 'Consultar notas', screen: 'Boletim', color: '#D97706' },
];

export const DashboardScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome?.split(' ')[0] || 'Usuário'} 👋</Text>
          <Text style={styles.subGreeting}>O que deseja fazer hoje?</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Cards de navegação */}
      <View style={styles.grid}>
        {MENU_CARDS.map((item) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.card, { borderTopColor: item.color }]}
            onPress={() => navigation.navigate(item.screen as any)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.version}>App Scholar v1.0 — Fatec Jacareí</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  greeting: { fontSize: fontSize.xl, fontWeight: '700', color: colors.textPrimary },
  subGreeting: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  logoutText: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '47%',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: radius.md,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.sm,
  },
  icon: { fontSize: 24 },
  cardTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xl },
});
