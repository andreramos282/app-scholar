import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { mockBoletim } from '../services/mockData';
import { colors, spacing, radius, fontSize } from '../styles/theme';

// Altere USE_MOCK para false quando o backend estiver disponível
const USE_MOCK = true;

interface BoletimItem {
  id: number;
  disciplina: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: string;
}

export const BoletimScreen = () => {
  const { token, user } = useAuth();
  const [boletim, setBoletim] = useState<BoletimItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoletim();
  }, []);

  const fetchBoletim = async () => {
    try {
      if (USE_MOCK) {
        // Simula delay de rede
        await new Promise((r) => setTimeout(r, 600));
        setBoletim(mockBoletim);
      } else {
        const data = await api.get<BoletimItem[]>(
          API_ROUTES.BOLETIM_BY_ALUNO(user?.id ?? 0),
          token || undefined
        );
        setBoletim(data);
      }
    } catch {
      setBoletim(mockBoletim); // fallback para mock em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const situacaoColor = (s: string) =>
    s.toLowerCase().includes('aprovado') ? colors.success : colors.danger;

  if (loading) return <Loading message="Carregando boletim..." />;

  return (
    <View style={styles.flex}>
      <Header title="Boletim" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Resumo */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>📋 Resumo do Semestre</Text>
          <Text style={styles.summaryText}>
            {boletim.filter((b) => b.situacao.toLowerCase().includes('aprovado')).length} aprovações ·{' '}
            {boletim.filter((b) => !b.situacao.toLowerCase().includes('aprovado')).length} reprovações
          </Text>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
          {/* Header da tabela */}
          <View style={[styles.row, styles.tableHeader]}>
            <Text style={[styles.cell, styles.cellDisciplina, styles.headerText]}>Disciplina</Text>
            <Text style={[styles.cell, styles.cellNota, styles.headerText]}>N1</Text>
            <Text style={[styles.cell, styles.cellNota, styles.headerText]}>N2</Text>
            <Text style={[styles.cell, styles.cellMedia, styles.headerText]}>Média</Text>
            <Text style={[styles.cell, styles.cellSituacao, styles.headerText]}>Situação</Text>
          </View>

          {boletim.map((item, index) => (
            <View key={item.id} style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
              <Text style={[styles.cell, styles.cellDisciplina]} numberOfLines={2}>{item.disciplina}</Text>
              <Text style={[styles.cell, styles.cellNota]}>{item.nota1.toFixed(1)}</Text>
              <Text style={[styles.cell, styles.cellNota]}>{item.nota2.toFixed(1)}</Text>
              <Text style={[styles.cell, styles.cellMedia, styles.mediaText]}>{item.media.toFixed(1)}</Text>
              <View style={[styles.cell, styles.cellSituacao]}>
                <View style={[styles.badge, { backgroundColor: situacaoColor(item.situacao) + '20' }]}>
                  <Text style={[styles.badgeText, { color: situacaoColor(item.situacao) }]}>
                    {item.situacao.toLowerCase().includes('aprovado') ? '✓' : '✗'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  summary: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary },
  summaryText: { fontSize: fontSize.sm, color: colors.textSecondary, marginTop: 4 },
  table: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  tableHeader: { backgroundColor: colors.primary, paddingVertical: spacing.sm + 2 },
  rowEven: { backgroundColor: colors.white },
  rowOdd: { backgroundColor: colors.background },
  cell: { paddingHorizontal: spacing.xs, fontSize: fontSize.xs, color: colors.textPrimary },
  cellDisciplina: { flex: 3 },
  cellNota: { flex: 1, textAlign: 'center' },
  cellMedia: { flex: 1, textAlign: 'center' },
  cellSituacao: { flex: 1, alignItems: 'center' },
  headerText: { color: colors.white, fontWeight: '700', fontSize: fontSize.xs },
  mediaText: { fontWeight: '700', color: colors.textPrimary },
  badge: {
    width: 24, height: 24, borderRadius: radius.full,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { fontSize: fontSize.xs, fontWeight: '700' },
});
