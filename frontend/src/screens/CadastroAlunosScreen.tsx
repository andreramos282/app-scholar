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
import { buscarCepIBGE } from '../services/cepService';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius, fontSize } from '../styles/theme';

interface AlunoForm {
  nome: string;
  matricula: string;
  curso: string;
  email: string;
  semestre: number;
  telefone: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
}

type Errors = Partial<Record<keyof AlunoForm, string>>;

const INITIAL_FORM: AlunoForm = {
  nome: '', matricula: '', curso: '', email: '', semestre: 1,
  telefone: '', cep: '', endereco: '', cidade: '', estado: '',
};

export const CadastroAlunosScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState<AlunoForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const set = (field: keyof AlunoForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Buscar dados do CEP via IBGE
  const buscarCep = async (cep: string) => {
    if (cep.length < 8) return;
    
    setCepLoading(true);
    try {
      const resultado = await buscarCepIBGE(cep);
      
      if (!resultado) {
        Alert.alert('CEP', 'CEP não encontrado');
        setCepLoading(false);
        return;
      }

      setForm((prev) => ({
        ...prev,
        endereco: resultado.endereco,
        cidade: resultado.cidade,
        estado: resultado.estado,
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert('Erro', 'Não foi possível buscar o CEP');
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, '');
    set('cep')(cep);
    
    // Buscar quando tiver 8 dígitos
    if (cepLimpo.length === 8) {
      buscarCep(cepLimpo);
    }
  };

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
    await api.post(
      API_ROUTES.ALUNOS,
      form,
      token || undefined
    );

    Alert.alert(
      'Sucesso',
      'Aluno cadastrado com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => {
            setForm(INITIAL_FORM);
            navigation.goBack();
          },
        },
      ]
    );
  } catch (err: any) {
    console.log('ERRO COMPLETO:', err);

    Alert.alert(
      'Erro',
      JSON.stringify(err, null, 2)
    );
  } finally {
    setLoading(false);
  }
};

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
          
          <Input label="Telefone" placeholder="(12) 99999-0000" value={form.telefone} onChangeText={set('telefone')} keyboardType="phone-pad" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Input 
            label={`CEP ${cepLoading ? '(buscando...)' : ''}`}
            placeholder="00000-000" 
            value={form.cep} 
            onChangeText={handleCepChange} 
            keyboardType="numeric"
            editable={!cepLoading}
          />
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
  section: {
    backgroundColor: colors.white, borderRadius: radius.lg,
    padding: spacing.lg, marginBottom: spacing.md,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1,
  },
  sectionTitle: {
    fontSize: fontSize.md, fontWeight: '700',
    color: colors.primary, marginBottom: spacing.md,
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
