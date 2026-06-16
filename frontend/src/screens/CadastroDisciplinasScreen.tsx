import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius, fontSize } from '../styles/theme';

type Periodo = 'Matutino' | 'Vespertino' | 'Noturno' | 'Diurno';

interface DisciplinaForm {
  nome: string;
  carga_horaria: string;
  professor_id: number | null;
  curso: string;
  curso_id?: number;
  semestre: number;
  periodo: Periodo;
}

interface ProfessorItem { id: number; nome: string; email: string; }
interface CursoItem { id: number; nome: string; periodo?: Periodo; duracao?: number; }

type Errors = Partial<Record<keyof DisciplinaForm, string>>;

const INITIAL_FORM: DisciplinaForm = { nome: '', carga_horaria: '80', professor_id: null, curso: '', curso_id: undefined, semestre: 1, periodo: 'Noturno' };
const normalizarLista = (data: any): any[] => Array.isArray(data) ? data : (Array.isArray(data?.response) ? data.response : []);

export const CadastroDisciplinasScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState<DisciplinaForm>(INITIAL_FORM);
  const [professores, setProfessores] = useState<ProfessorItem[]>([]);
  const [cursos, setCursos] = useState<CursoItem[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof DisciplinaForm) => (value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => { carregarBase(); }, []);

  const carregarBase = async () => {
    try {
      const [profRes, cursoRes] = await Promise.all([
        api.get<any>(API_ROUTES.PROFESSORES, token || undefined),
        api.get<any>(API_ROUTES.CURSOS, token || undefined),
      ]);
      const listaProf = normalizarLista(profRes);
      const listaCursos = normalizarLista(cursoRes);
      setProfessores(listaProf);
      setCursos(listaCursos);
      setForm((prev) => ({ ...prev, professor_id: prev.professor_id || listaProf[0]?.id || null }));
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar cursos/professores. Cadastre esses dados antes da disciplina.');
    }
  };

  const selecionarCurso = (cursoId: number) => {
    const curso = cursos.find((c) => Number(c.id) === Number(cursoId));
    setForm((prev) => ({ ...prev, curso_id: curso?.id, curso: curso?.nome || '', periodo: curso?.periodo || prev.periodo, semestre: Math.min(prev.semestre, curso?.duracao || 6) }));
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.nome.trim()) newErrors.nome = 'Campo obrigatório';
    if (!form.carga_horaria.trim() || Number(form.carga_horaria) <= 0) newErrors.carga_horaria = 'Informe uma carga horária válida';
    if (!form.professor_id) newErrors.professor_id = 'Selecione um professor';
    if (!form.curso.trim() || !form.curso_id) newErrors.curso = 'Selecione um curso cadastrado';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post(API_ROUTES.DISCIPLINAS, {
        nome: form.nome.trim(),
        carga_horaria: Number(form.carga_horaria),
        professor_id: form.professor_id,
        curso: form.curso.trim(),
        semestre: Number(form.semestre),
        periodo: form.periodo,
      }, token || undefined);
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!', [{ text: 'OK', onPress: () => { setForm(INITIAL_FORM); navigation.goBack(); } }]);
    } catch (err: any) {
      Alert.alert('Erro ao salvar disciplina', err.message || 'Não foi possível cadastrar a disciplina.');
    } finally {
      setLoading(false);
    }
  };

  const semestresDisponiveis = Array.from({ length: Math.max(1, cursos.find(c => c.id === form.curso_id)?.duracao || 6) }, (_, i) => i + 1);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Cadastro de Disciplinas" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados da matéria</Text>
          <Text style={styles.helper}>A disciplina fica vinculada a um curso, semestre, período e professor. O professor só verá boletins dessas disciplinas.</Text>
          <Input label="Nome da Disciplina *" placeholder="Ex: Programação Mobile I" value={form.nome} onChangeText={set('nome')} error={errors.nome} />
          <Input label="Carga Horária (h) *" placeholder="Ex: 80" value={form.carga_horaria} onChangeText={set('carga_horaria')} keyboardType="numeric" error={errors.carga_horaria} />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Curso *</Text>
            <Picker selectedValue={form.curso_id || 0} onValueChange={(value) => selecionarCurso(Number(value))} style={styles.picker}>
              <Picker.Item label="Selecione um curso cadastrado" value={0} />
              {cursos.map((curso) => <Picker.Item key={curso.id} label={`${curso.nome} • ${curso.periodo || 'sem período'}`} value={curso.id} />)}
            </Picker>
            {errors.curso ? <Text style={styles.errorText}>{errors.curso}</Text> : null}
          </View>

          <View style={styles.row}>
            <View style={styles.halfPicker}>
              <Text style={styles.pickerLabel}>Semestre *</Text>
              <Picker selectedValue={form.semestre} onValueChange={(value) => setForm((prev) => ({ ...prev, semestre: Number(value) }))} style={styles.picker}>
                {semestresDisponiveis.map((sem) => <Picker.Item key={sem} label={`${sem}º Semestre`} value={sem} />)}
              </Picker>
            </View>
            <View style={styles.halfPicker}>
              <Text style={styles.pickerLabel}>Período *</Text>
              <Picker selectedValue={form.periodo} onValueChange={(value) => setForm((prev) => ({ ...prev, periodo: value }))} style={styles.picker}>
                {['Matutino', 'Vespertino', 'Noturno', 'Diurno'].map((periodo) => <Picker.Item key={periodo} label={periodo} value={periodo} />)}
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Professor responsável *</Text>
            <Picker selectedValue={form.professor_id || 0} onValueChange={(value) => setForm((prev) => ({ ...prev, professor_id: Number(value) || null }))} style={styles.picker}>
              <Picker.Item label="Selecione um professor" value={0} />
              {professores.map((professor) => <Picker.Item key={professor.id} label={`${professor.nome} · ${professor.email}`} value={professor.id} />)}
            </Picker>
            {errors.professor_id ? <Text style={styles.errorText}>{errors.professor_id}</Text> : null}
          </View>
        </View>

        <Button title="Salvar Disciplina" onPress={handleSalvar} loading={loading} style={styles.btn} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" style={styles.btnCancel} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 60 },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  helper: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.md },
  pickerContainer: { marginBottom: spacing.md },
  pickerLabel: { fontSize: fontSize.sm, fontWeight: '600', color: colors.textPrimary, marginBottom: spacing.xs },
  picker: { backgroundColor: colors.primaryLight, borderRadius: radius.md, height: 50 },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  halfPicker: { flex: 1 },
  errorText: { color: colors.danger, fontSize: fontSize.xs, marginTop: spacing.xs },
  btn: { marginTop: spacing.sm },
  btnCancel: { marginTop: spacing.sm },
});
