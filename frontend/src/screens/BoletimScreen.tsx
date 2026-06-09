import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius, fontSize } from '../styles/theme';

interface BoletimItem {
  id?: number;
  aluno_matricula?: string;
  aluno_nome?: string;
  disciplina_id: number;
  disciplina_nome: string;
  nota1?: number;
  nota2?: number;
  media?: number;
  situacao?: string;
}

interface DisciplinaItem {
  id: number;
  nome: string;
  curso: string;
  semestre: number;
}

export const BoletimScreen = () => {
  const { token, user } = useAuth();
  const [boletim, setBoletim] = useState<BoletimItem[]>([]);
  const [disciplinas, setDisciplinas] = useState<DisciplinaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMatricula, setFilterMatricula] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [nota1, setNota1] = useState('0');
  const [nota2, setNota2] = useState('0');
  const [refreshing, setRefreshing] = useState(false);

  const isProfessor = user?.perfil === 'professor';
  const isAluno = user?.perfil === 'aluno';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isAluno) {
        const matricula = String(user.id);
        const [disciplinasRes, boletimRes] = await Promise.all([
          api.get<DisciplinaItem[]>(API_ROUTES.ALUNO_DISCIPLINAS(matricula), token || undefined),
          api.get<BoletimItem[]>(API_ROUTES.BOLETIM_BY_ALUNO(matricula), token || undefined),
        ]);
        setDisciplinas(disciplinasRes);
        setBoletim(boletimRes);
      } else if (isProfessor) {
        const professorId = Number(user.id);
        const [disciplinasRes, boletimRes] = await Promise.all([
          api.get<DisciplinaItem[]>(API_ROUTES.PROFESSOR_DISCIPLINAS(professorId), token || undefined),
          api.get<BoletimItem[]>(API_ROUTES.PROFESSOR_BOLETIM(professorId), token || undefined),
        ]);
        setDisciplinas(disciplinasRes);
        setBoletim(boletimRes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleFilterBoletim = async () => {
    if (!isProfessor) return;

    try {
      setLoading(true);
      const professorId = Number(user.id);
      const boletimRes = await api.get<BoletimItem[]>(
        API_ROUTES.PROFESSOR_BOLETIM(professorId, filterMatricula.trim()),
        token || undefined
      );
      setBoletim(boletimRes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEdit = (item: BoletimItem) => {
    setSelectedKey(`${item.aluno_matricula}-${item.disciplina_id}`);
    setNota1(String(item.nota1 ?? 0));
    setNota2(String(item.nota2 ?? 0));
  };

  const handleSaveEdit = async (item: BoletimItem) => {
    if (!item.aluno_matricula) return;

    try {
      setLoading(true);
      await api.post(
        API_ROUTES.BOLETIM,
        {
          aluno_matricula: item.aluno_matricula,
          disciplina_id: item.disciplina_id,
          nota1: Number(nota1),
          nota2: Number(nota2),
        },
        token || undefined
      );
      await fetchData();
      setSelectedKey(null);
      setNota1('0');
      setNota2('0');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const situacaoColor = (situacao: string) =>
    situacao.toLowerCase().includes('aprovado') ? colors.success : colors.danger;

  if (loading) return <Loading message="Carregando boletim..." />;

  return (
    <View style={styles.flex}>
      <Header title="Boletim" showBack />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {isProfessor && (
          <View style={styles.filterBox}>
            <Text style={styles.filterTitle}>Filtrar boletim por matrícula</Text>
            <View style={styles.filterRow}>
              <TextInput
                style={styles.filterInput}
                placeholder="Ex: 20240001"
                value={filterMatricula}
                onChangeText={setFilterMatricula}
              />
              <TouchableOpacity style={styles.filterButton} onPress={handleFilterBoletim}>
                <Text style={styles.filterButtonText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isAluno ? 'Minhas disciplinas deste semestre' : 'Minhas disciplinas'}</Text>
          {disciplinas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma disciplina encontrada.</Text>
          ) : (
            disciplinas.map((disciplina) => (
              <View key={disciplina.id} style={styles.listItem}>
                <Text style={styles.listLabel}>{disciplina.nome}</Text>
                <Text style={styles.listValue}>{disciplina.curso} · {disciplina.semestre}º</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boletim</Text>
          {boletim.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma nota encontrada.</Text>
          ) : (
            boletim.map((item) => (
              <View key={`${item.aluno_matricula}-${item.disciplina_id}`} style={styles.boletimCard}>
                {isProfessor && (
                  <Text style={styles.studentLabel}>{item.aluno_nome || item.aluno_matricula}</Text>
                )}
                <Text style={styles.disciplinaName}>{item.disciplina_nome}</Text>
                <View style={styles.scoreRow}>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>N1</Text>
                    <Text style={styles.scoreValue}>{(item.nota1 ?? 0).toFixed(1)}</Text>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>N2</Text>
                    <Text style={styles.scoreValue}>{(item.nota2 ?? 0).toFixed(1)}</Text>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>Média</Text>
                    <Text style={styles.scoreValue}>{(item.media ?? 0).toFixed(1)}</Text>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreLabel}>Situação</Text>
                    <Text style={[styles.scoreValue, { color: situacaoColor(item.situacao ?? '') }]}> 
                      {item.situacao ?? 'Sem nota'}
                    </Text>
                  </View>
                </View>

                {isProfessor && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleSelectEdit(item)}>
                      <Text style={styles.editButtonText}>Editar notas</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isProfessor && selectedKey === `${item.aluno_matricula}-${item.disciplina_id}` && (
                  <View style={styles.editBox}>
                    <View style={styles.editInputRow}>
                      <TextInput
                        style={styles.editInput}
                        keyboardType="numeric"
                        value={nota1}
                        onChangeText={setNota1}
                        placeholder="N1"
                      />
                      <TextInput
                        style={styles.editInput}
                        keyboardType="numeric"
                        value={nota2}
                        onChangeText={setNota2}
                        placeholder="N2"
                      />
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveEdit(item)}>
                      <Text style={styles.saveButtonText}>Salvar Nota</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  filterBox: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  filterTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  filterRow: { flexDirection: 'row', gap: spacing.sm },
  filterInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  filterButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  filterButtonText: { color: colors.white, fontWeight: '700' },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary, marginBottom: spacing.sm },
  emptyText: { color: colors.textSecondary, fontSize: fontSize.sm },
  listItem: { marginBottom: spacing.sm },
  listLabel: { fontSize: fontSize.sm, fontWeight: '700', color: colors.textPrimary },
  listValue: { fontSize: fontSize.xs, color: colors.textSecondary },
  boletimCard: {
    borderRadius: radius.lg,
    backgroundColor: colors.background,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  studentLabel: { fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.xs, color: colors.textPrimary },
  disciplinaName: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  scoreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  scoreBox: { flex: 1, minWidth: 80, backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm },
  scoreLabel: { fontSize: fontSize.xs, color: colors.textSecondary, marginBottom: spacing.xs },
  scoreValue: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  actionRow: { marginTop: spacing.sm, flexDirection: 'row', justifyContent: 'flex-end' },
  editButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.primary, borderRadius: radius.md },
  editButtonText: { color: colors.white, fontWeight: '700' },
  editBox: { marginTop: spacing.sm, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.sm },
  editInputRow: { flexDirection: 'row', gap: spacing.sm },
  editInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  saveButtonText: { color: colors.white, fontWeight: '700' },
});
