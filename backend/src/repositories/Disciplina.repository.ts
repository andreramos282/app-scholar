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
}

export default DisciplinaRepository