import db from "../db"
import BoletimType from "../types/Boletim.type"

class BoletimRepository {
    public async createBoletim(boletim: BoletimType) {
        const query = "INSERT INTO boletim (aluno_matricula, disciplina_id, nota1, nota2, situacao) VALUES ($1, $2, $3, $4, $5);"
        await db.query(query, Object.values<any>(boletim))
    }

    public async updateBoletim(id: number, boletim: BoletimType) {
        const query = "UPDATE boletim SET aluno_matricula = $1, disciplina_id = $2, nota1 = $3, nota2 = $4, situacao = $5 WHERE id = $6";
        await db.query(query, [boletim.aluno_matricula, boletim.disciplina_id, boletim.nota1, boletim.nota2, boletim.situacao, id]);
    }

    public async getBoletimPerId(id: number) {
        const query = "SELECT * FROM boletim WHERE id = $1"
        const res = await db.query(query, [id])
        return res.rows
    }

    public async getBoletimPerAluno(matricula: string): Promise<BoletimType[]> {
        const query = "SELECT * FROM boletim WHERE aluno_matricula = $1"
        const res = await db.query<BoletimType>(query, [matricula])
        return res.rows
    }

    public async getBoletimPerAlunoAndDisciplina(matricula: string, disciplina_id: number): Promise<BoletimType[]> {
        const query = "SELECT * FROM boletim WHERE aluno_matricula = $1 AND disciplina_id = $2"
        const res = await db.query<BoletimType>(query, [matricula, disciplina_id])
        return res.rows
    }
}

export default BoletimRepository