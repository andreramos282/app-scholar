import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { viaCepService } from '../services/viaCepService';
import { ibgeService } from '../services/ibgeService';
import { useAppTheme } from '../styles/theme';

interface AlunoForm {
  nome: string;
  matricula: string;
  curso: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
}

type Errors = Partial<Record<keyof AlunoForm, string>>;

const INITIAL_FORM: AlunoForm = {
  nome: '', matricula: '', curso: '', email: '',
  telefone: '', cep: '', endereco: '', cidade: '', estado: '',
};

export const CadastroAlunosScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState<AlunoForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState<any[]>([]);

  const { colors, spacing, radius, fontSize } = useAppTheme();

  const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xxl },
    section: {
      backgroundColor: colors.white, borderRadius: radius.lg,
      padding: spacing.lg, marginBottom: spacing.md,
      shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
    },
    sectionTitle: {
      fontSize: fontSize.md, fontWeight: '700',
      color: colors.primary, marginBottom: spacing.md,
    },
    btn: { marginTop: spacing.sm },
    btnCancel: { marginTop: spacing.sm },
  });

  const set = (field: keyof AlunoForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const newErrors: Errors = {};
    if (!form.nome.trim()) newErrors.nome = 'Campo obrigatório';
    if (!form.matricula.trim()) newErrors.matricula = 'Campo obrigatório';
    if (!form.curso.trim()) newErrors.curso = 'Campo obrigatório';
    if (!form.email.trim()) newErrors.email = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post(API_ROUTES.ALUNOS, form, token || undefined);
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!', [
        { text: 'OK', onPress: () => { setForm(INITIAL_FORM); navigation.goBack(); } },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Não foi possível cadastrar o aluno.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar lista de estados (IBGE) ao montar
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ufs = await ibgeService.buscarEstados();
        if (mounted) setEstados(ufs);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Buscar endereço pelo CEP quando o campo tiver 8 dígitos
  React.useEffect(() => {
    const cepLimpo = form.cep.replace(/\D/g, '');
    let mounted = true;
    if (cepLimpo.length === 8) {
      (async () => {
        try {
          const endereco = await viaCepService.buscarEndereco(cepLimpo);
          if (!mounted) return;
          setForm((prev) => ({
            ...prev,
            endereco: `${endereco.logradouro}${endereco.numero ? ', ' + endereco.numero : ''}`,
            cidade: endereco.localidade,
            estado: endereco.uf,
          }));
        } catch (err: any) {
          // não bloquear fluxo, apenas mostrar mensagem
          // Alert is imported above
        }
      })();
    }
    return () => { mounted = false; };
  }, [form.cep]);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title="Cadastro de Alunos" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <Input label="Nome *" placeholder="Nome completo" value={form.nome} onChangeText={set('nome')} error={errors.nome} />
          <Input label="Matrícula *" placeholder="Ex: 20240001" value={form.matricula} onChangeText={set('matricula')} error={errors.matricula} />
          <Input label="Curso *" placeholder="Ex: DSM" value={form.curso} onChangeText={set('curso')} error={errors.curso} />
          <Input label="E-mail *" placeholder="aluno@email.com" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
          <Input label="Telefone" placeholder="(12) 99999-0000" value={form.telefone} onChangeText={set('telefone')} keyboardType="phone-pad" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Input label="CEP" placeholder="00000-000" value={form.cep} onChangeText={set('cep')} keyboardType="numeric" />
          <Input label="Endereço" placeholder="Rua, número, complemento" value={form.endereco} onChangeText={set('endereco')} />
          <Input label="Cidade" placeholder="Ex: São José dos Campos" value={form.cidade} onChangeText={set('cidade')} />
          <Input label="Estado" placeholder="Ex: SP" value={form.estado} onChangeText={set('estado')} maxLength={2} autoCapitalize="characters" />
        </View>

        <Button title="Salvar Aluno" onPress={handleSalvar} loading={loading} style={styles.btn} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" style={styles.btnCancel} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
