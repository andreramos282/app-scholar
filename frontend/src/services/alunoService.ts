import { api } from './api';
import { authService } from './authService';

export interface Aluno {
  matricula: string;
  nome: string;
  curso: string;
  email: string;
  telefone?: string;
  cep?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
}

export const alunoService = {
  async criar(aluno: Aluno): Promise<Aluno> {
    const token = authService.getToken();
    return api.post<Aluno>('/api/aluno', aluno, token || undefined);
  },

  async listarTodos(): Promise<Aluno[]> {
    const token = authService.getToken();
    return api.get<Aluno[]>('/api/aluno', token || undefined);
  },

  async buscarPorMatricula(matricula: string): Promise<Aluno> {
    const token = authService.getToken();
    return api.get<Aluno>(`/api/aluno/${matricula}`, token || undefined);
  },

  async atualizar(matricula: string, aluno: Partial<Aluno>): Promise<Aluno> {
    const token = authService.getToken();
    return api.put<Aluno>(`/api/aluno/${matricula}`, aluno, token || undefined);
  },

  async deletar(matricula: string): Promise<void> {
    const token = authService.getToken();
    await api.delete(`/api/aluno/${matricula}`, token || undefined);
  },
};
