import db from "../db";
import ProfessorType from "../types/Professor.type";

class ProfessorRepository {
    public async createProfessor(professor: ProfessorType) {
        const query = "INSERT INTO professores (nome, titulacao, area_atuacao, semestre, tempo_docencia, email, senha) VALUES ($1, $2, $3, $4, $5, $6, $7);"
        const values = [
            professor.nome,
            professor.titulacao,
            professor.area_atuacao,
            professor.semestre,
            professor.tempo_docencia,
            professor.email,
            professor.senha ?? '123456',
        ]
        await db.query(query, values)
    }

    public async getProfessorPerId(id: number): Promise<ProfessorType | undefined> {
        const query = "SELECT * FROM professores WHERE id = $1"
        const res = await db.query<ProfessorType>(query, [id])
        return res.rows[0]
    }

    public async getProfessorPorEmail(email: string): Promise<ProfessorType | undefined> {
        const query = "SELECT * FROM professores WHERE email = $1"
        const res = await db.query<ProfessorType>(query, [email])
        return res.rows[0]
    }

    public async updateSenha(id: number, senha: string) {
        const query = "UPDATE professores SET senha = $1 WHERE id = $2"
        await db.query(query, [senha, id])
    }

    public async getProfessores(): Promise<ProfessorType[]> {
        const query = "SELECT * FROM professores"
        const res = await db.query<ProfessorType>(query)
        return res.rows
    }

    public async getTotalProfessores(): Promise<number> {
        const query = "SELECT COUNT(*) as total FROM professores"
        const res = await db.query(query)
        return parseInt(res.rows[0].total)
    }

    public async getProfessoresPorSemestre(): Promise<any[]> {
        const query = "SELECT semestre, COUNT(*) as total FROM professores GROUP BY semestre ORDER BY semestre"
        const res = await db.query(query)
        return res.rows
    }
}

export default ProfessorRepository