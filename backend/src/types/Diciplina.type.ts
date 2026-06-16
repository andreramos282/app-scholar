type DisciplinaType = {
    id: number;
    nome: string;
    carga_horaria: number;
    professor_id?: number;
    curso: string;
    semestre: number;
    periodo?: string;
};

export default DisciplinaType