import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface RegisterRequest {
  email: string;
  nome: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: {
    id: number;
    email: string;
    nome: string;
    perfil: 'admin' | 'aluno' | 'professor';
  };
}

export const authService = {
  // cached values for sync access in services
  _cachedToken: null as string | null,
  _cachedUsuario: null as any,

  setCached(token: string | null, usuario: any | null) {
    this._cachedToken = token;
    this._cachedUsuario = usuario;
  },

  async login(login: string, senha: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      login,
      senha,
    });
    
    if (response.token) {
      await AsyncStorage.setItem('@scholar:token', response.token);
      await AsyncStorage.setItem('@scholar:user', JSON.stringify(response.usuario));
      this.setCached(response.token, response.usuario);
    }
    
    return response;
  },

  async register(email: string, nome: string, senha: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/register', {
      email,
      nome,
      senha,
    });
    
    if (response.token) {
      await AsyncStorage.setItem('@scholar:token', response.token);
      await AsyncStorage.setItem('@scholar:user', JSON.stringify(response.usuario));
      this.setCached(response.token, response.usuario);
    }
    
    return response;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('@scholar:token');
    await AsyncStorage.removeItem('@scholar:user');
    this.setCached(null, null);
  },

  // synchronous getters for services that expect immediate token
  getToken(): string | null {
    return this._cachedToken;
  },

  getUsuario(): any | null {
    return this._cachedUsuario;
  },

  isLogado(): boolean {
    return !!this._cachedToken;
  },
};
