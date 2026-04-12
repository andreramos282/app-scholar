type BoletimType = {
    id: number;
    aluno_matricula: string;
    disciplina_id: number;
    nota1: number;
    nota2: number;
    media?: number;
    situacao?: string;
};

export default BoletimType