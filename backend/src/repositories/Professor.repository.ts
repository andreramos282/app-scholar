import db from "../db";
import ProfessorType from "../types/Professor.type";

class ProfessorRepository {
    public async createProfessor(professor: ProfessorType) {
        const query = "INSERT INTO professores (nome, titulacao, area_atuacao, tempo_docencia, email) VALUES ($1, $2, $3, $4, $5);"
        await db.query(query, Object.values<any>(professor))
    }

    public async getProfessorPerId(id: number): Promise<ProfessorType | undefined> {
        const query = "SELECT * FROM professores WHERE id = $1"
        const res = await db.query<ProfessorType>(query, [id])
        return res.rows[0]
    }
}

export default ProfessorRepository