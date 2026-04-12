import db from "../db"

class BoletimRepository {
    public async createBoletim(boletim: BoletimRepository) {
        const query = "INSERT INTO boletim (aluno_matricula, disciplina_id, nota1, nota2, situacao) VALUES ($1, $2, $3, $4, $5);"
        await db.query(query, Object.values<any>(boletim))
    }

    public async getBoletimPerId(id: number) {
        const query = "SELECT * FROM boletim WHERE id = $1"
        const res = await db.query(query, [id])
        return res.rows
    }
}

export default BoletimRepository