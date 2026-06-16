type ProfessorType = {
    id: number;
    nome: string;
    titulacao: string;
    area_atuacao: string;
    semestre: number;
    periodo?: string;
    tempo_docencia?: number;
    email: string;
    senha?: string;
};

export default ProfessorType
