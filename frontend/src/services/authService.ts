import { api } from './api';

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
  async login(login: string, senha: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/login', {
      login,
      senha,
    });
    
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
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
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
    }
    
    return response;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isLogado(): boolean {
    return !!this.getToken();
  },
};
