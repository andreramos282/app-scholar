import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAppTheme } from '../styles/theme';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [loginValue, setLoginValue] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ login?: string; senha?: string }>({});
  const [loading, setLoading] = useState(false);
  const { colors, spacing, radius, fontSize } = useAppTheme();

  const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.primary },
    container: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
    hero: { alignItems: 'center', marginBottom: spacing.xl },
    logoBox: {
      width: 80, height: 80, borderRadius: radius.full,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center', alignItems: 'center',
      marginBottom: spacing.md,
    },
    logoIcon: { fontSize: 40 },
    appName: { color: colors.white, fontSize: fontSize.xxl, fontWeight: '800' },
    appSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: fontSize.sm, marginTop: 4 },
    card: {
      backgroundColor: colors.white,
      borderRadius: radius.lg,
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 4,
    },
    cardTitle: {
      fontSize: fontSize.xl, fontWeight: '700',
      color: colors.textPrimary, marginBottom: spacing.lg,
    },
    loginBtn: { marginTop: spacing.sm },
    footer: {
      textAlign: 'center', color: 'rgba(255,255,255,0.5)',
      fontSize: fontSize.xs, marginTop: spacing.xl,
    },
  });

  const validate = () => {
    const newErrors: { login?: string; senha?: string } = {};
    if (!loginValue.trim()) newErrors.login = 'Campo obrigatório';
    if (!senha.trim()) newErrors.senha = 'Campo obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(loginValue.trim(), senha);
    } catch (err: any) {
      Alert.alert('Erro ao entrar', err.message || 'Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Header decorativo */}
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.appName}>App Scholar</Text>
          <Text style={styles.appSubtitle}>Sistema Acadêmico</Text>
        </View>

        {/* Card do formulário */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrar</Text>

          <Input
            label="Login ou E-mail"
            placeholder="seu.email@fatec.sp.gov.br"
            value={loginValue}
            onChangeText={setLoginValue}
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.login}
          />

          <Input
            label="Senha"
            placeholder="••••••••"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            error={errors.senha}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />
        </View>

        <Text style={styles.footer}>Fatec Jacareí — DSM</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
