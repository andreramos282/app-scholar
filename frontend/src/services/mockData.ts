export const mockBoletim = [
    { id: 1, disciplina: 'Programação Mobile I', nota1: 8.5, nota2: 9.0, media: 8.75, situacao: 'Aprovado' },
    { id: 2, disciplina: 'Banco de Dados', nota1: 7.0, nota2: 6.5, media: 6.75, situacao: 'Aprovado' },
    { id: 3, disciplina: 'Engenharia de Software', nota1: 5.0, nota2: 4.5, media: 4.75, situacao: 'Reprovado' },
    { id: 4, disciplina: 'Redes de Computadores', nota1: 9.5, nota2: 8.0, media: 8.75, situacao: 'Aprovado' },
    { id: 5, disciplina: 'Matemática Discreta', nota1: 6.0, nota2: 7.0, media: 6.5, situacao: 'Aprovado' },
];

export const mockProfessores = [
    { id: 1, nome: 'André Olímpio', titulacao: 'Mestre', area: 'Desenvolvimento Mobile', tempo_docencia: 8, email: 'andre@fatec.sp.gov.br' },
];

export const mockAlunos = [
    { id: 1, nome: 'João Silva', matricula: '20240001', curso: 'DSM', email: 'joao@aluno.fatec.sp.gov.br', telefone: '(12) 99999-0001', cep: '12200-000', endereco: 'Rua das Flores, 100', cidade: 'São José dos Campos', estado: 'SP' },
];

export const mockDisciplinas = [
    { id: 1, nome: 'Programação Mobile I', carga_horaria: 80, professor_responsavel: 'André Olímpio', curso: 'DSM', semestre: '3º' },
];
