import db from "../db"
import BoletimType from "../types/Boletim.type"

class BoletimRepository {

    public async createBoletim(boletim: BoletimType) {
        const query = `
INSERT INTO boletim
(aluno_matricula, disciplina_id, nota1, nota2, media, situacao)
VALUES ($1, $2, $3, $4, $5, $6);
`;

        await db.query(query, [
            boletim.aluno_matricula,
            boletim.disciplina_id,
            boletim.nota1,
            boletim.nota2,
            boletim.media,
            boletim.situacao
        ]);
    }

    public async updateBoletim(id: number, boletim: BoletimType) {
        const query = `
UPDATE boletim
SET aluno_matricula = $1,
    disciplina_id = $2,
    nota1 = $3,
    nota2 = $4,
    media = $5,
    situacao = $6
WHERE id = $7
`;

        await db.query(query, [
            boletim.aluno_matricula,
            boletim.disciplina_id,
            boletim.nota1,
            boletim.nota2,
            boletim.media,
            boletim.situacao,
            id
        ]);
    }

    public async getBoletimPerId(id: number) {
        const query = "SELECT * FROM boletim WHERE id = $1"
        const res = await db.query(query, [id])
        return res.rows
    }

    public async getBoletimPerAluno(matricula: string): Promise<BoletimType[]> {
        const query = `
SELECT
  b.id,
  b.aluno_matricula,
  b.disciplina_id,
  b.nota1,
  b.nota2,
  b.media,
  b.situacao,
  d.nome AS disciplina_nome,
  d.curso AS disciplina_curso,
  d.semestre AS disciplina_semestre,
  p.id AS professor_id,
  p.nome AS professor_nome,
  p.email AS professor_email
FROM boletim b
JOIN disciplina d ON d.id = b.disciplina_id
LEFT JOIN professores p ON p.id = d.professor_id
WHERE b.aluno_matricula = $1
ORDER BY d.curso, d.semestre, d.nome`;
        const res = await db.query<any>(query, [matricula])
        return res.rows
    }

    public async getBoletimPerAlunoAndDisciplina(
        matricula: string,
        disciplina_id: number
    ): Promise<BoletimType[]> {
        const query = "SELECT * FROM boletim WHERE aluno_matricula = $1 AND disciplina_id = $2"
        const res = await db.query<BoletimType>(query, [matricula, disciplina_id])
        return res.rows
    }

    public async getBoletimPorProfessor(professorId: number, curso?: string, semestre?: number, matricula?: string): Promise<any[]> {
        const conditions = ["p.id = $1"]
        const params: any[] = [professorId]

        if (matricula) {
            params.push(matricula)
            conditions.push(`a.matricula = $${params.length}`)
        }

        const query = `
SELECT
  COALESCE(b.id, 0) AS id,
  a.matricula AS aluno_matricula,
  a.nome AS aluno_nome,
  a.curso AS aluno_curso,
  a.semestre AS aluno_semestre,
  d.id AS disciplina_id,
  d.nome AS disciplina_nome,
  d.curso AS disciplina_curso,
  d.semestre AS disciplina_semestre,
  p.id AS professor_id,
  p.nome AS professor_nome,
  b.nota1,
  b.nota2,
  b.media,
  b.situacao
FROM alunos a
JOIN disciplina d ON d.curso = a.curso AND d.semestre = a.semestre
JOIN professores p ON p.id = d.professor_id
LEFT JOIN boletim b ON b.aluno_matricula = a.matricula AND b.disciplina_id = d.id
WHERE ${conditions.join(' AND ')}
ORDER BY d.curso, d.semestre, a.nome`;
        const res = await db.query<any>(query, params)
        return res.rows
    }
}

export default BoletimRepository