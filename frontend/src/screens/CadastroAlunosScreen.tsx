import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { buscarCepIBGE } from '../services/cepService';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius, fontSize } from '../styles/theme';

type Periodo = 'Diurno' | 'Noturno' | 'Matutino' | 'Vespertino';

type Curso = {
  id: number;
  nome: string;
  area?: string;
  duracao?: number;
  coordenador?: string;
  periodo?: Periodo;
};

interface AlunoForm {
  nome: string;
  matricula: string;
  curso: string;
  curso_id?: number;
  periodo: Periodo;
  email: string;
  senha: string;
  semestre: number;
  telefone: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
}

type Errors = Partial<Record<keyof AlunoForm, string>>;

const INITIAL_FORM: AlunoForm = {
  nome: '', matricula: '', curso: '', curso_id: undefined, periodo: 'Noturno', email: '', senha: '123456', semestre: 1,
  telefone: '', cep: '', endereco: '', cidade: '', estado: '',
};

const normalizarLista = (data: any): any[] => Array.isArray(data) ? data : (Array.isArray(data?.response) ? data.response : []);

export const CadastroAlunosScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState<AlunoForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => { carregarCursos(); }, []);

  const carregarCursos = async () => {
    try {
      const data = await api.get<any>(API_ROUTES.CURSOS, token || undefined);
      setCursos(normalizarLista(data));
    } catch (error) {
      setCursos([]);
      Alert.alert('Cursos', 'Não foi possível carregar os cursos. Cadastre um curso antes de cadastrar aluno.');
    }
  };

  const set = (field: keyof AlunoForm) => (value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const selecionarCurso = (cursoId: number) => {
    const curso = cursos.find((c) => Number(c.id) === Number(cursoId));
    setForm((prev) => ({
      ...prev,
      curso_id: curso?.id,
      curso: curso?.nome || '',
      periodo: curso?.periodo || prev.periodo,
      semestre: Math.min(prev.semestre || 1, curso?.duracao || 6),
    }));
  };

  const buscarCep = async (cep: string) => {
    if (cep.length < 8) return;
    setCepLoading(true);
    try {
      const resultado = await buscarCepIBGE(cep);
      if (!resultado) return Alert.alert('CEP', 'CEP não encontrado');
      setForm((prev) => ({ ...prev, endereco: resultado.endereco, cidade: resultado.cidade, estado: resultado.estado }));
    } catch {
      Alert.alert('Erro', 'Não foi possível buscar o CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    set('cep')(cep);
    if (cepLimpo.length === 8) buscarCep(cepLimpo);
  };

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.nome.trim()) newErrors.nome = 'Campo obrigatório';
    if (!form.matricula.trim()) newErrors.matricula = 'Campo obrigatório';
    if (!form.curso.trim() || !form.curso_id) newErrors.curso = 'Selecione um curso cadastrado';
    if (!form.email.trim()) newErrors.email = 'Campo obrigatório';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) newErrors.email = 'E-mail inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        nome: form.nome.trim(),
        matricula: form.matricula.trim(),
        email: form.email.trim().toLowerCase(),
        curso: form.curso.trim(),
        semestre: Number(form.semestre),
        curso_id: form.curso_id,
      };
      await api.post(API_ROUTES.ALUNOS, payload, token || undefined);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso! Login inicial: matrícula e senha 123456.', [
        { text: 'OK', onPress: () => { setForm(INITIAL_FORM); navigation.goBack(); } },
      ]);
    } catch (err: any) {
      Alert.alert('Erro ao cadastrar aluno', err.message || 'Verifique matrícula/e-mail duplicado e se o backend está conectado ao banco.');
    } finally {
      setLoading(false);
    }
  };

  const semestresDisponiveis = Array.from({ length: Math.max(1, cursos.find(c => c.id === form.curso_id)?.duracao || 6) }, (_, i) => i + 1);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Cadastro de Alunos" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados acadêmicos</Text>
          <Text style={styles.helper}>O curso é selecionado da lista já cadastrada. Isso garante que boletim, disciplinas e frequência apareçam corretamente.</Text>
          <Input label="Nome *" placeholder="Nome completo" value={form.nome} onChangeText={set('nome')} error={errors.nome} />
          <Input label="Matrícula *" placeholder="Ex: 20240001" value={form.matricula} onChangeText={set('matricula')} error={errors.matricula} />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Curso *</Text>
            <Picker selectedValue={form.curso_id || 0} onValueChange={(value) => selecionarCurso(Number(value))} style={styles.picker}>
              <Picker.Item label="Selecione um curso cadastrado" value={0} />
              {cursos.map((curso) => <Picker.Item key={curso.id} label={`${curso.nome} • ${curso.periodo || 'Período não informado'}`} value={curso.id} />)}
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
                {['Diurno', 'Noturno', 'Matutino', 'Vespertino'].map((periodo) => <Picker.Item key={periodo} label={periodo} value={periodo} />)}
              </Picker>
            </View>
          </View>

          <Input label="E-mail *" placeholder="aluno@email.com" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="Senha inicial" placeholder="123456" value={form.senha} onChangeText={set('senha')} secureTextEntry />
          <Input label="Telefone" placeholder="(12) 99999-0000" value={form.telefone} onChangeText={set('telefone')} keyboardType="phone-pad" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Input label={`CEP ${cepLoading ? '(buscando...)' : ''}`} placeholder="00000-000" value={form.cep} onChangeText={handleCepChange} keyboardType="numeric" editable={!cepLoading} />
          <Input label="Endereço" placeholder="Rua, número, complemento" value={form.endereco} onChangeText={set('endereco')} editable={!cepLoading} />
          <Input label="Cidade" placeholder="Ex: São José dos Campos" value={form.cidade} onChangeText={set('cidade')} editable={!cepLoading} />
          <Input label="Estado" placeholder="Ex: SP" value={form.estado} onChangeText={set('estado')} maxLength={2} autoCapitalize="characters" editable={!cepLoading} />
        </View>

        <Button title="Salvar Aluno" onPress={handleSalvar} loading={loading} style={styles.btn} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" style={styles.btnCancel} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  section: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
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
