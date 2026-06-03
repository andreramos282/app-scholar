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

export interface Professor {
  id?: number;
  nome: string;
  titulacao: string;
  area_atuacao: string;
  tempo_docencia: number;
  email: string;
}

export interface Disciplina {
  id?: number;
  nome: string;
  carga_horaria: number;
  professor_id: number;
  curso: string;
  semestre: number;
}

export interface Boletim {
  id?: number;
  aluno_matricula: string;
  disciplina_id: number;
  nota1: number;
  nota2: number;
  media?: number;
  situacao?: string;
}

export interface User {
  id?: number;
  email: string;
  perfil: 'admin' | 'aluno' | 'professor';
  nome: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  perfil: string;
  nome: string;
}
