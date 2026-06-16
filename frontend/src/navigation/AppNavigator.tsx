import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { CadastroAlunosScreen } from '../screens/CadastroAlunosScreen';
import { CadastroProfessoresScreen } from '../screens/CadastroProfessoresScreen';
import { CadastroDisciplinasScreen } from '../screens/CadastroDisciplinasScreen';
import { CadastroCursosScreen } from '../screens/CadastroCursosScreen';
import { BoletimScreen } from '../screens/BoletimScreen';
import { EstatisticasScreen } from '../screens/EstatisticasScreen';
import { Loading } from '../components/Loading';

export type AppStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  CadastroAlunos: undefined;
  CadastroProfessores: undefined;
  CadastroDisciplinas: undefined;
  CadastroCursos: undefined;
  Boletim: undefined;
  Estatisticas: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loading />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="CadastroAlunos" component={CadastroAlunosScreen} />
            <Stack.Screen name="CadastroProfessores" component={CadastroProfessoresScreen} />
            <Stack.Screen name="CadastroDisciplinas" component={CadastroDisciplinasScreen} />
            <Stack.Screen name="CadastroCursos" component={CadastroCursosScreen} />
            <Stack.Screen name="Boletim" component={BoletimScreen} />
            <Stack.Screen name="Estatisticas" component={EstatisticasScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
