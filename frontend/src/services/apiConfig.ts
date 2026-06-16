import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'web') return 'http://localhost:3000';
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 10000,
};

export const API_ROUTES = {
    authLogin: '/api/auth/login',
    authChangePassword: '/api/auth/change-password',

    alunos: '/api/aluno',
    ALUNOS: '/api/aluno',
    ALUNO_BY_ID: (matricula: string) => `/api/aluno?matricula=${matricula}`,

    professores: '/api/professor',
    PROFESSORES: '/api/professor',
    PROFESSOR_BY_ID: (id: number) => `/api/professor?id=${id}`,

    CURSOS: '/api/curso',
    cursos: '/api/curso',
    CURSO_BY_ID: (id: number) => `/api/curso/${id}`,

    disciplinas: '/api/disciplina',
    DISCIPLINAS: '/api/disciplina',
    DISCIPLINA_BY_ID: (id: number) => `/api/disciplina?id=${id}`,

    BOLETIM: '/api/aluno/boletim',
    BOLETIM_BY_ALUNO: (matricula: string) => `/api/aluno/boletim?matricula=${matricula}`,
    ALUNO_DISCIPLINAS: (matricula: string) => `/api/aluno/disciplinas?matricula=${matricula}`,
    PROFESSOR_DISCIPLINAS: (professorId: number) => `/api/professor/disciplinas?professorId=${professorId}`,
    PROFESSOR_BOLETIM: (professorId: number, matricula?: string, curso?: string, semestre?: number) => {
        const params: string[] = [`professorId=${professorId}`];
        if (matricula) params.push(`matricula=${matricula}`);
        if (curso) params.push(`curso=${encodeURIComponent(curso)}`);
        if (semestre !== undefined) params.push(`semestre=${semestre}`);
        return `/api/professor/boletim?${params.join('&')}`;
    },
};
