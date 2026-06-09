import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius, fontSize } from '../styles/theme';

interface ProfessorForm {
  nome: string;
  titulacao: string;
  area: string;
  semestre: number;
  tempo_docencia: string;
  email: string;
}

type Errors = Partial<Record<keyof ProfessorForm, string>>;

const INITIAL_FORM: ProfessorForm = {
  nome: '', titulacao: '', area: '', semestre: 1, tempo_docencia: '', email: '',
};

export const CadastroProfessoresScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState<ProfessorForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const set = (field: keyof ProfessorForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.nome.trim()) newErrors.nome = 'Campo obrigatório';
    if (!form.titulacao.trim()) newErrors.titulacao = 'Campo obrigatório';
    if (!form.area.trim()) newErrors.area = 'Campo obrigatório';
    if (!form.email.trim()) newErrors.email = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post(
        API_ROUTES.PROFESSORES,
        { 
          ...form, 
          area_atuacao: form.area,
          tempo_docencia: Number(form.tempo_docencia) || undefined 
        },
        token || undefined
      );
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!', [
        { text: 'OK', onPress: () => { setForm(INITIAL_FORM); navigation.goBack(); } },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível cadastrar o professor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Cadastro de Professores" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Input label="Nome *" placeholder="Nome completo" value={form.nome} onChangeText={set('nome')} error={errors.nome} />
          <Input
            label="Titulação *"
            placeholder="Ex: Mestre, Doutor, Especialista"
            value={form.titulacao}
            onChangeText={set('titulacao')}
            error={errors.titulacao}
          />
          <Input
            label="Área de Atuação *"
            placeholder="Ex: Desenvolvimento Web"
            value={form.area}
            onChangeText={set('area')}
            error={errors.area}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Semestre *</Text>
            <Picker
              selectedValue={form.semestre}
              onValueChange={(value) => setForm((prev) => ({ ...prev, semestre: value }))}
              style={styles.picker}
            >
              {[1, 2, 3, 4, 5, 6].map((sem) => (
                <Picker.Item key={sem} label={`${sem}º Semestre`} value={sem} />
              ))}
            </Picker>
          </View>

          <Input
            label="Tempo de Docência (anos)"
            placeholder="Ex: 5"
            value={form.tempo_docencia}
            onChangeText={set('tempo_docencia')}
            keyboardType="numeric"
          />
          <Input
            label="E-mail *"
            placeholder="professor@fatec.sp.gov.br"
            value={form.email}
            onChangeText={set('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
        </View>

        <Button title="Salvar Professor" onPress={handleSalvar} loading={loading} style={styles.btn} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" style={styles.btnCancel} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  pickerContainer: {
    marginBottom: spacing.md,
  },
  pickerLabel: {
    fontSize: fontSize.sm, fontWeight: '600',
    color: colors.textPrimary, marginBottom: spacing.xs,
  },
  picker: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    height: 50,
  },
  btn: { marginTop: spacing.sm },
  btnCancel: { marginTop: spacing.sm },
});
