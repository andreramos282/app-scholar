import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { authService } from '../services/authService';

interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (login: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@scholar:token');
      const storedUser = await AsyncStorage.getItem('@scholar:user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // sync cache for services
        authService.setCached(storedToken, JSON.parse(storedUser));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginValue: string, senha: string) => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { login: loginValue, senha });
      const { token: respToken, usuario } = response as any;
      if (!respToken) throw new Error('Resposta de autenticação inválida');
      setToken(respToken);
      setUser(usuario);
      await AsyncStorage.setItem('@scholar:token', respToken);
      await AsyncStorage.setItem('@scholar:user', JSON.stringify(usuario));
      // sync cache for services
      authService.setCached(respToken, usuario);
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@scholar:token');
    await AsyncStorage.removeItem('@scholar:user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
