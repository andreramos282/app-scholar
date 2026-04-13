
export const API_CONFIG = {
    BASE_URL: 'http://localhost:3000', // <- ALTERE AQUI
    TIMEOUT: 10000,
};

// Rotas da API
export const API_ROUTES = {
    ALUNOS: '/alunos',
    ALUNO_BY_ID: (id: number) => `/alunos/${id}`,

    PROFESSORES: '/professores',
    PROFESSOR_BY_ID: (id: number) => `/professores/${id}`,

    DISCIPLINAS: '/disciplinas',
    DISCIPLINA_BY_ID: (id: number) => `/disciplinas/${id}`,

    BOLETIM: '/boletim',
    BOLETIM_BY_ALUNO: (alunoId: number) => `/boletim/${alunoId}`,
};
