import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, radius, fontSize } from '../styles/theme';

type Curso = {
  id?: number;
  nome: string;
  area: string;
  duracao: number | string;
  coordenador: string;
  periodo: 'Diurno' | 'Noturno' | 'Matutino' | 'Vespertino';
};

const inicial: Curso = { nome: '', area: '', duracao: 6, coordenador: '', periodo: 'Noturno' };

export const CadastroCursosScreen = () => {
  const { token, user } = useAuth();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [form, setForm] = useState<Curso>(inicial);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.perfil === 'admin';

  const normalizarLista = (data: any): Curso[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.response)) return data.response;
    return [];
  };

  const carregar = async () => {
    const data = await api.get<{ response: Curso[] } | Curso[]>(API_ROUTES.CURSOS, token || undefined);
    setCursos(normalizarLista(data));
  };

  useEffect(() => { carregar().catch(() => Alert.alert('Erro', 'Não foi possível carregar os cursos.')); }, []);

  const set = (campo: keyof Curso) => (valor: any) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const salvar = async () => {
    if (!isAdmin) return Alert.alert('Acesso negado', 'Somente administradores podem cadastrar ou editar cursos.');
    if (!form.nome.trim() || !form.area.trim() || !form.coordenador.trim()) {
      return Alert.alert('Atenção', 'Preencha nome, área, duração e coordenador.');
    }

    setLoading(true);
    try {
      const body = { ...form, duracao: String(form.duracao).replace(/\D/g, '') || '6' };
      const result: any = form.id
        ? await api.put(API_ROUTES.CURSO_BY_ID(form.id), body, token || undefined)
        : await api.post(API_ROUTES.CURSOS, body, token || undefined);
      const cursoSalvo = result?.response;
      if (cursoSalvo?.id) {
        setCursos((prev) => {
          const jaExiste = prev.some((c) => c.id === cursoSalvo.id);
          const novaLista = jaExiste ? prev.map((c) => c.id === cursoSalvo.id ? cursoSalvo : c) : [...prev, cursoSalvo];
          return novaLista.sort((a, b) => a.nome.localeCompare(b.nome));
        });
      }
      setForm(inicial);
      await carregar();
      Alert.alert('Sucesso', form.id ? 'Curso atualizado!' : 'Curso cadastrado!');
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Falha ao salvar curso.');
    } finally {
      setLoading(false);
    }
  };

  const editar = (curso: Curso) => setForm(curso);

  const remover = (curso: Curso) => {
    if (!isAdmin || !curso.id) return;
    Alert.alert('Remover curso', `Deseja remover ${curso.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: async () => {
        await api.delete(API_ROUTES.CURSO_BY_ID(curso.id!), token || undefined);
        setCursos((prev) => prev.filter((c) => c.id !== curso.id));
        await carregar();
      }},
    ]);
  };

  return (
    <View style={styles.flex}>
      <Header title="Cursos" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cadastro e Gerenciamento de Cursos</Text>
          <Text style={styles.helper}>Controle os cursos da instituição e use estes dados para vincular alunos e disciplinas.</Text>

          {isAdmin && (
            <>
              <Input label="Nome do curso *" placeholder="Ex: Desenvolvimento de Software Multiplataforma" value={form.nome} onChangeText={set('nome')} />
              <Input label="Área *" placeholder="Ex: Tecnologia" value={form.area} onChangeText={set('area')} />
              <Input label="Duração em semestres *" placeholder="Ex: 6" value={String(form.duracao)} onChangeText={(v) => set('duracao')(Number(v.replace(/\D/g, '') || 0))} keyboardType="numeric" />
              <Input label="Coordenador *" placeholder="Nome do coordenador" value={form.coordenador} onChangeText={set('coordenador')} />
              <Text style={styles.pickerLabel}>Período *</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={form.periodo} onValueChange={set('periodo')} style={styles.picker}>
                  {['Diurno', 'Noturno', 'Matutino', 'Vespertino'].map((p) => <Picker.Item key={p} label={p} value={p} />)}
                </Picker>
              </View>
              <Button title={form.id ? 'Atualizar Curso' : 'Cadastrar Curso'} onPress={salvar} loading={loading} style={styles.btn} />
              {form.id && <Button title="Cancelar edição" variant="outline" onPress={() => setForm(inicial)} style={styles.btn} />}
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cursos existentes</Text>
          {cursos.length === 0 ? <Text style={styles.empty}>Nenhum curso cadastrado.</Text> : cursos.map((curso) => (
            <View key={curso.id || curso.nome} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{curso.nome}</Text>
                  <Text style={styles.cardSub}>{curso.area} • {curso.duracao} semestres • {curso.periodo}</Text>
                  <Text style={styles.cardSub}>Coordenação: {curso.coordenador}</Text>
                </View>
              </View>
              {isAdmin && <View style={styles.actions}>
                <TouchableOpacity onPress={() => editar(curso)} style={styles.actionBtn}><Text style={styles.actionText}>Editar</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => remover(curso)} style={[styles.actionBtn, styles.danger]}><Text style={styles.dangerText}>Excluir</Text></TouchableOpacity>
              </View>}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  section: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  helper: { fontSize: fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md },
  pickerContainer: { backgroundColor: colors.primaryLight, borderRadius: radius.md, marginBottom: spacing.md },
  pickerLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs },
  picker: { height: 50 },
  btn: { marginTop: spacing.sm },
  empty: { color: colors.textSecondary },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, backgroundColor: '#FAFAFA' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  cardTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.textPrimary },
  cardSub: { fontSize: fontSize.xs, color: colors.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  actionBtn: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.primaryLight },
  danger: { backgroundColor: '#FEE2E2' },
  actionText: { color: colors.primary, fontWeight: '700' },
  dangerText: { color: '#B91C1C', fontWeight: '700' },
});
