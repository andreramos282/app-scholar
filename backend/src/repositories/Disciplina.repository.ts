import db from "../db";
import DisciplinaType from "../types/Diciplina.type";

class DisciplinaRepository {
    public async createDisciplina(disciplina: DisciplinaType) {
        const query = "INSERT INTO disciplina (nome, carga_horaria, professor_id, curso, semestre) VALUES ($1, $2, $3, $4, $5);"
        await db.query(query, Object.values<any>(disciplina))
    }

    public async getDisciplinaPerId(id: number) {
        const query = "SELECT * FROM disciplina WHERE id = $1"
        const res = await db.query(query, [id])
        return res.rows
    }

    public async getDisciplinas(): Promise<DisciplinaType[]> {
        const query = "SELECT * FROM disciplina ORDER BY semestre, curso"
        const res = await db.query<DisciplinaType>(query)
        return res.rows
    }

    public async getDisciplinasPorProfessor(professorId: number): Promise<DisciplinaType[]> {
        const query = "SELECT * FROM disciplina WHERE professor_id = $1 ORDER BY semestre, curso"
        const res = await db.query<DisciplinaType>(query, [professorId])
        return res.rows
    }

    public async getDisciplinasPorCursoESemestreDoProfessor(professorId: number, curso?: string, semestre?: number): Promise<DisciplinaType[]> {
        const query = `SELECT * FROM disciplina WHERE professor_id = $1
            ${curso ? 'AND curso = $2' : ''}
            ${semestre ? (curso ? 'AND semestre = $3' : 'AND semestre = $2') : ''}
            ORDER BY semestre, curso`;
        const params: any[] = [professorId];
        if (curso) params.push(curso);
        if (semestre) params.push(semestre);
        const res = await db.query<DisciplinaType>(query, params)
        return res.rows
    }

    public async getDisciplinasPorCursoESemestrePorCursoSemestre(curso: string, semestre: number): Promise<DisciplinaType[]> {
        const query = "SELECT * FROM disciplina WHERE curso = $1 AND semestre = $2 ORDER BY semestre, curso"
        const res = await db.query<DisciplinaType>(query, [curso, semestre])
        return res.rows
    }

    public async getTotalDisciplinas(): Promise<number> {
        const query = "SELECT COUNT(*) as total FROM disciplina"
        const res = await db.query(query)
        return parseInt(res.rows[0].total)
    }

    public async getDisciplinasPorCurso(): Promise<any[]> {
        const query = "SELECT curso, COUNT(*) as total FROM disciplina GROUP BY curso ORDER BY curso"
        const res = await db.query(query)
        return res.rows
    }

    public async getDisciplinasPorSemestre(): Promise<any[]> {
        const query = "SELECT semestre, COUNT(*) as total FROM disciplina GROUP BY semestre ORDER BY semestre"
        const res = await db.query(query)
        return res.rows
    }

    public async getDisciplinasPorCursoESemestre(): Promise<any[]> {
        const query = "SELECT curso, semestre, COUNT(*) as total FROM disciplina GROUP BY curso, semestre ORDER BY curso, semestre"
        const res = await db.query(query)
        return res.rows
    }
}

export default DisciplinaRepository