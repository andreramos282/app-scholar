import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';

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
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginValue: string, senha: string) => {
    if (loginValue === 'admin' && senha === '123456') {
      const mockUser = { id: 1, nome: 'Admin', email: 'admin@fatec.sp.gov.br', perfil: 'admin' };
      const mockToken = 'mock-token-123';
      setUser(mockUser);
      setToken(mockToken);
      await AsyncStorage.setItem('@scholar:token', mockToken);
      await AsyncStorage.setItem('@scholar:user', JSON.stringify(mockUser));
      return;
    }
    throw new Error('Usuário ou senha inválidos');
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
