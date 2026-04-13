import db from "../db";
import AlunoType from "../types/Aluno.type";

class AlunoRepository {
    public async createAluno(aluno: AlunoType) {
        const query = "INSERT INTO alunos (matricula, nome, curso, email, telefone, cep, endereco, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);"
        await db.query(query, Object.values<any>(aluno))
    }

    public async getAlunos(): Promise<AlunoType[]> {
        const query = "SELECT * FROM alunos"
        const res = await db.query<AlunoType>(query)
        return res.rows
    }

    public async getAlunoPerMatricula(matricula: string): Promise<AlunoType | undefined> {
        const query = "SELECT * FROM alunos WHERE matricula = $1"
        const res = await db.query<AlunoType>(query, [matricula])
        return res.rows[0]
    }
}

export default AlunoRepository