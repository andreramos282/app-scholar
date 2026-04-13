import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius } from '../styles/theme';

interface DisciplinaForm {
  nome: string;
  carga_horaria: string;
  professor_responsavel: string;
  curso: string;
  semestre: string;
}

type Errors = Partial<Record<keyof DisciplinaForm, string>>;

const INITIAL_FORM: DisciplinaForm = {
  nome: '', carga_horaria: '', professor_responsavel: '', curso: '', semestre: '',
};

export const CadastroDisciplinasScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState<DisciplinaForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof DisciplinaForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.nome.trim()) newErrors.nome = 'Campo obrigatório';
    if (!form.carga_horaria.trim()) newErrors.carga_horaria = 'Campo obrigatório';
    if (!form.professor_responsavel.trim()) newErrors.professor_responsavel = 'Campo obrigatório';
    if (!form.curso.trim()) newErrors.curso = 'Campo obrigatório';
    if (!form.semestre.trim()) newErrors.semestre = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post(
        API_ROUTES.DISCIPLINAS,
        { ...form, carga_horaria: Number(form.carga_horaria) },
        token || undefined
      );
      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!', [
        { text: 'OK', onPress: () => { setForm(INITIAL_FORM); navigation.goBack(); } },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível cadastrar a disciplina.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Cadastro de Disciplinas" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Input label="Nome da Disciplina *" placeholder="Ex: Programação Mobile I" value={form.nome} onChangeText={set('nome')} error={errors.nome} />
          <Input label="Carga Horária (h) *" placeholder="Ex: 80" value={form.carga_horaria} onChangeText={set('carga_horaria')} keyboardType="numeric" error={errors.carga_horaria} />
          <Input label="Professor Responsável *" placeholder="Nome do professor" value={form.professor_responsavel} onChangeText={set('professor_responsavel')} error={errors.professor_responsavel} />
          <Input label="Curso *" placeholder="Ex: DSM" value={form.curso} onChangeText={set('curso')} error={errors.curso} />
          <Input label="Semestre *" placeholder="Ex: 3º" value={form.semestre} onChangeText={set('semestre')} error={errors.semestre} />
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
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  btn: { marginTop: spacing.sm },
  btnCancel: { marginTop: spacing.sm },
});
