import db from "../db";
import AlunoType from "../types/Aluno.type";

class AlunoRepository {
    public async createAluno(aluno: AlunoType) {
        const res = await db.query("SELECT * FROM alunos;")
        return res.rows
    }
}

export default AlunoRepository