import db from "../db";
import AlunoType from "../types/Aluno.type";

class AlunoRepository {
    public async createAluno(aluno: AlunoType) {
        const query = "INSERT INTO alunos (matricula, nome, curso, email, senha, semestre, telefone, cep, endereco, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);"
        const values = [
            aluno.matricula,
            aluno.nome,
            aluno.curso,
            aluno.email,
            aluno.senha ?? '123456',
            aluno.semestre,
            aluno.telefone,
            aluno.cep,
            aluno.endereco,
            aluno.cidade,
            aluno.estado,
        ];
        await db.query(query, values)
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

    public async getAlunoPorEmail(email: string): Promise<AlunoType | undefined> {
        const query = "SELECT * FROM alunos WHERE email = $1"
        const res = await db.query<AlunoType>(query, [email])
        return res.rows[0]
    }

    public async updateSenhaPorMatricula(matricula: string, senha: string) {
        const query = "UPDATE alunos SET senha = $1 WHERE matricula = $2"
        await db.query(query, [senha, matricula])
    }

    public async getAlunosPorCurso(): Promise<any[]> {
        const query = "SELECT curso, COUNT(*) as total FROM alunos GROUP BY curso ORDER BY curso"
        const res = await db.query(query)
        return res.rows
    }

    public async getAlunosPorCursoESemestre(): Promise<any[]> {
        const query = "SELECT curso, semestre, COUNT(*) as total FROM alunos GROUP BY curso, semestre ORDER BY curso, semestre"
        const res = await db.query(query)
        return res.rows
    }

    public async getTotalAlunos(): Promise<number> {
        const query = "SELECT COUNT(*) as total FROM alunos"
        const res = await db.query(query)
        return parseInt(res.rows[0].total)
    }
}

export default AlunoRepository