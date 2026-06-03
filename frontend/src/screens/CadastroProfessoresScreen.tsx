import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
  Modal, TouchableOpacity, FlatList, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { viaCepService } from '../services/viaCepService';
import { ibgeService, UF, Municipio } from '../services/ibgeService';
import { useAppTheme } from '../styles/theme';

interface ProfessorForm {
  nome: string;
  titulacao: string;
  area: string;
  tempo_docencia: string;
  email: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
}

type Errors = Partial<Record<keyof ProfessorForm, string>>;

const INITIAL_FORM: ProfessorForm = {
  nome: '', titulacao: '', area: '', tempo_docencia: '', email: '',
  cep: '', endereco: '', cidade: '', estado: '',
};

export const CadastroProfessoresScreen = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [form, setForm] = useState<ProfessorForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState<UF[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showCidadeModal, setShowCidadeModal] = useState(false);
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingBottom: spacing.xxl },
    card: {
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
    selectField: { marginBottom: spacing.md },
    selectLabel: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
      fontWeight: '500',
    },
    selectValue: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      fontSize: fontSize.md,
      color: colors.textPrimary,
      backgroundColor: colors.white,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      padding: spacing.lg,
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      maxHeight: '80%',
      padding: spacing.md,
    },
    modalTitle: {
      fontSize: fontSize.lg,
      fontWeight: '700',
      marginBottom: spacing.md,
      color: colors.textPrimary,
    },
    itemButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemText: {
      color: colors.textPrimary,
      fontSize: fontSize.md,
    },
    closeText: {
      color: colors.primary,
      textAlign: 'right',
      marginTop: spacing.md,
      fontWeight: '700',
    },
  });

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
        { ...form, tempo_docencia: Number(form.tempo_docencia) },
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

  const handleSelectEstado = async (uf: UF) => {
    setForm((prev) => ({ ...prev, estado: uf.sigla, cidade: '' }));
    setShowEstadoModal(false);
    setMunicipios([]);
    setLoadingMunicipios(true);
    try {
      const cidades = await ibgeService.buscarMunicipios(uf.id);
      setMunicipios(cidades);
      setShowCidadeModal(true);
    } catch {
      setMunicipios([]);
    } finally {
      setLoadingMunicipios(false);
    }
  };

  // Buscar lista de estados (IBGE) ao montar
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ufs = await ibgeService.buscarEstados();
        if (mounted) setEstados(ufs);
      } catch {
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
        } catch {
          // não bloquear fluxo, apenas mostrar mensagem
        }
      })();
    }
    return () => { mounted = false; };
  }, [form.cep]);

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

          <Text style={styles.sectionTitle}>Endereço</Text>
          <Input label="CEP" placeholder="00000-000" value={form.cep} onChangeText={set('cep')} keyboardType="numeric" />
          <Input label="Endereço" placeholder="Rua, número, complemento" value={form.endereco} onChangeText={set('endereco')} />
          <View style={styles.selectField}>
            <Text style={styles.selectLabel}>Cidade</Text>
            <TouchableOpacity
              style={styles.selectValue}
              onPress={() => {
                if (!form.estado) {
                  Alert.alert('Atenção', 'Selecione um estado antes de escolher a cidade.');
                  return;
                }
                if (municipios.length === 0) {
                  Alert.alert('Aguarde', 'Buscando municípios para o estado selecionado.');
                  return;
                }
                setShowCidadeModal(true);
              }}
            >
              <Text style={styles.itemText}>{form.cidade || 'Selecione a cidade'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selectField}>
            <Text style={styles.selectLabel}>Estado</Text>
            <TouchableOpacity style={styles.selectValue} onPress={() => setShowEstadoModal(true)}>
              <Text style={styles.itemText}>{form.estado || 'Selecione o estado'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button title="Salvar Professor" onPress={handleSalvar} loading={loading} style={styles.btn} />
        <Button title="Cancelar" onPress={() => navigation.goBack()} variant="outline" style={styles.btnCancel} />

        <Modal visible={showEstadoModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione o Estado</Text>
              <FlatList
                data={estados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.itemButton} onPress={() => handleSelectEstado(item)}>
                    <Text style={styles.itemText}>{`${item.nome} (${item.sigla})`}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setShowEstadoModal(false)}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal visible={showCidadeModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione a Cidade</Text>
              {loadingMunicipios ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <FlatList
                  data={municipios}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.itemButton}
                      onPress={() => {
                        setForm((prev) => ({ ...prev, cidade: item.nome }));
                        setShowCidadeModal(false);
                      }}
                    >
                      <Text style={styles.itemText}>{item.nome}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <TouchableOpacity onPress={() => setShowCidadeModal(false)}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
