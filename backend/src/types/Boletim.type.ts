type TipoProva = 'A' | 'B' | 'C';

type BoletimType = {
    id?: number;
    aluno_matricula: string;
    disciplina_id: number;
    nota1: number;
    nota2: number;
    tipo_prova?: TipoProva;
    faltas?: number;
    aulas_totais?: number;
    frequencia?: number;
    media?: number;
    situacao?: string;
};

export default BoletimType
