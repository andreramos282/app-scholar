type DisciplinaType = {
    id: number;
    nome: string;
    carga_horaria: number;
    professor_id?: number;
    curso: string;
    semestre: number;
};

export default DisciplinaType