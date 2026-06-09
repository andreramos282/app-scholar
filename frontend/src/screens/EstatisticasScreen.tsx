import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Header } from '../components/Header';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius, fontSize } from '../styles/theme';

interface EstatisticasAlunos {
  total: number;
  porCurso: Array<{ curso: string; total: number }>;
  porCursoESemestre: Array<{ curso: string; semestre: number; total: number }>;
}

interface EstatisticasProfessores {
  total: number;
  porSemestre: Array<{ semestre: number; total: number }>;
}

interface EstatisticasDisciplinas {
  total: number;
  porCurso: Array<{ curso: string; total: number }>;
  porSemestre: Array<{ semestre: number; total: number }>;
  porCursoESemestre: Array<{ curso: string; semestre: number; total: number }>;
}

export const EstatisticasScreen = () => {
  const navigation = useNavigation();
  const [alunos, setAlunos] = useState<EstatisticasAlunos | null>(null);
  const [professores, setProfessores] = useState<EstatisticasProfessores | null>(null);
  const [disciplinas, setDisciplinas] = useState<EstatisticasDisciplinas | null>(null);
  const [activeTab, setActiveTab] = useState<'alunos' | 'professores' | 'disciplinas'>('alunos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      carregarEstatisticas();
    }, [])
  );

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      const [alunosRes, professoresRes, disciplinasRes] = await Promise.all([
        api.get(`${API_ROUTES.alunos}/estatisticas`).catch(() => null),
        api.get(`${API_ROUTES.professores}/estatisticas`).catch(() => null),
        api.get(`${API_ROUTES.disciplinas}/estatisticas`).catch(() => null)
      ]);

      const alunosData = alunosRes || { total: 0, porCurso: [], porCursoESemestre: [] };
      const professoresData = professoresRes || { total: 0, porSemestre: [] };
      const disciplinasData = disciplinasRes || { total: 0, porCurso: [], porSemestre: [], porCursoESemestre: [] };

      setAlunos({
        total: alunosData?.total || 0,
        porCurso: alunosData?.porCurso || [],
        porCursoESemestre: alunosData?.porCursoESemestre || []
      });
      setProfessores({
        total: professoresData?.total || 0,
        porSemestre: professoresData?.porSemestre || []
      });
      setDisciplinas({
        total: disciplinasData?.total || 0,
        porCurso: disciplinasData?.porCurso || [],
        porSemestre: disciplinasData?.porSemestre || [],
        porCursoESemestre: disciplinasData?.porCursoESemestre || []
      });
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível carregar as estatísticas');
      console.error(error);
      // Definir valores vazios para evitar crash
      setAlunos({ total: 0, porCurso: [], porCursoESemestre: [] });
      setProfessores({ total: 0, porSemestre: [] });
      setDisciplinas({ total: 0, porCurso: [], porSemestre: [], porCursoESemestre: [] });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarEstatisticas();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Estatísticas" />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['alunos', 'professores', 'disciplinas'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'alunos' && alunos && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total de Alunos</Text>
              <Text style={styles.bigNumber}>{alunos.total}</Text>
            </View>

            {alunos.porCurso && alunos.porCurso.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Alunos por Curso</Text>
                {alunos.porCurso.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listLabel}>{item.curso}</Text>
                    <Text style={styles.listValue}>{item.total}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>Nenhum dado de alunos por curso</Text>
              </View>
            )}

            {alunos.porCursoESemestre && alunos.porCursoESemestre.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Alunos por Curso e Semestre</Text>
                {alunos.porCursoESemestre.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listLabel}>{item.curso} - Sem. {item.semestre}</Text>
                    <Text style={styles.listValue}>{item.total}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>Nenhum dado de alunos por curso e semestre</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'professores' && professores && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total de Professores</Text>
              <Text style={styles.bigNumber}>{professores.total}</Text>
            </View>

            {professores.porSemestre && professores.porSemestre.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Professores por Semestre</Text>
                {professores.porSemestre.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listLabel}>Semestre {item.semestre}</Text>
                    <Text style={styles.listValue}>{item.total}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>Nenhum dado de professores por semestre</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'disciplinas' && disciplinas && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Total de Disciplinas</Text>
              <Text style={styles.bigNumber}>{disciplinas.total}</Text>
            </View>

            {disciplinas.porCurso && disciplinas.porCurso.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Disciplinas por Curso</Text>
                {disciplinas.porCurso.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listLabel}>{item.curso}</Text>
                    <Text style={styles.listValue}>{item.total}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>Nenhum dado de disciplinas por curso</Text>
              </View>
            )}

            {disciplinas.porSemestre && disciplinas.porSemestre.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Disciplinas por Semestre</Text>
                {disciplinas.porSemestre.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listLabel}>Semestre {item.semestre}</Text>
                    <Text style={styles.listValue}>{item.total}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>Nenhum dado de disciplinas por semestre</Text>
              </View>
            )}

            {disciplinas.porCursoESemestre && disciplinas.porCursoESemestre.length > 0 ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Disciplinas por Curso e Semestre</Text>
                {disciplinas.porCursoESemestre.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listLabel}>{item.curso} - Sem. {item.semestre}</Text>
                    <Text style={styles.listValue}>{item.total}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.emptyText}>Nenhum dado de disciplinas por curso e semestre</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  bigNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
  },
  listLabel: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  listValue: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
