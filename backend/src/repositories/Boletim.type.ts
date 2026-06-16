import db from "../db"
import BoletimType from "../types/Boletim.type"

class BoletimRepository {
    private situacaoSQL = `
      COALESCE(
        b.situacao,
        CASE
          WHEN b.media IS NULL THEN 'Sem nota'
          WHEN COALESCE(b.frequencia, 100) < 75 THEN 'Reprovado por falta'
          WHEN b.media >= 6 THEN 'Aprovado'
          ELSE 'Reprovado por nota'
        END
      )`

    public async createBoletim(boletim: BoletimType) {
        const query = `
INSERT INTO boletim
(aluno_matricula, disciplina_id, nota1, nota2, tipo_prova, faltas, aulas_totais, frequencia, situacao)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (aluno_matricula, disciplina_id)
DO UPDATE SET
    nota1 = EXCLUDED.nota1,
    nota2 = EXCLUDED.nota2,
    tipo_prova = EXCLUDED.tipo_prova,
    faltas = EXCLUDED.faltas,
    aulas_totais = EXCLUDED.aulas_totais,
    frequencia = EXCLUDED.frequencia,
    situacao = EXCLUDED.situacao
RETURNING *;
`;
        const res = await db.query(query, [
            boletim.aluno_matricula,
            boletim.disciplina_id,
            boletim.nota1,
            boletim.nota2,
            boletim.tipo_prova ?? 'A',
            boletim.faltas ?? 0,
            boletim.aulas_totais ?? 0,
            boletim.frequencia ?? 100,
            boletim.situacao
        ]);
        return res.rows[0]
    }

    public async updateBoletim(id: number, boletim: BoletimType) {
        const query = `
UPDATE boletim
SET aluno_matricula = $1,
    disciplina_id = $2,
    nota1 = $3,
    nota2 = $4,
    tipo_prova = $5,
    faltas = $6,
    aulas_totais = $7,
    frequencia = $8,
    situacao = $9
WHERE id = $10
RETURNING *
`;
        const res = await db.query(query, [
            boletim.aluno_matricula,
            boletim.disciplina_id,
            boletim.nota1,
            boletim.nota2,
            boletim.tipo_prova ?? 'A',
            boletim.faltas ?? 0,
            boletim.aulas_totais ?? 0,
            boletim.frequencia ?? 100,
            boletim.situacao,
            id
        ]);
        return res.rows[0]
    }

    public async getBoletimPerId(id: number) {
        const res = await db.query("SELECT * FROM boletim WHERE id = $1", [id])
        return res.rows
    }

    public async getBoletimPerAluno(matricula: string): Promise<any[]> {
        const query = `
SELECT
  COALESCE(b.id, 0) AS id,
  a.matricula AS aluno_matricula,
  a.nome AS aluno_nome,
  a.curso AS aluno_curso,
  a.semestre AS aluno_semestre,
  a.periodo AS aluno_periodo,
  d.id AS disciplina_id,
  d.nome AS disciplina_nome,
  d.curso AS disciplina_curso,
  d.semestre AS disciplina_semestre,
  d.periodo AS periodo,
  p.id AS professor_id,
  p.nome AS professor_nome,
  b.nota1,
  b.nota2,
  COALESCE(b.tipo_prova, 'A') AS tipo_prova,
  COALESCE(b.faltas, 0) AS faltas,
  COALESCE(b.aulas_totais, 0) AS aulas_totais,
  COALESCE(b.frequencia, 100) AS frequencia,
  b.media,
  ${this.situacaoSQL} AS situacao
FROM alunos a
JOIN disciplina d ON d.curso = a.curso AND d.semestre = a.semestre
  AND COALESCE(d.periodo, a.periodo, 'Noturno') = COALESCE(a.periodo, d.periodo, 'Noturno')
LEFT JOIN professores p ON p.id = d.professor_id
LEFT JOIN boletim b ON b.aluno_matricula = a.matricula AND b.disciplina_id = d.id
WHERE a.matricula = $1
ORDER BY d.curso, d.semestre, d.periodo, d.nome`;
        const res = await db.query<any>(query, [matricula])
        return res.rows
    }

    public async getBoletimPerAlunoAndDisciplina(matricula: string, disciplina_id: number): Promise<BoletimType[]> {
        const res = await db.query<BoletimType>("SELECT * FROM boletim WHERE aluno_matricula = $1 AND disciplina_id = $2", [matricula, disciplina_id])
        return res.rows
    }

    public async getBoletimGeral(): Promise<any[]> {
        const query = `
SELECT
  COALESCE(b.id, 0) AS id,
  a.matricula AS aluno_matricula,
  a.nome AS aluno_nome,
  a.curso AS aluno_curso,
  a.semestre AS aluno_semestre,
  a.periodo AS aluno_periodo,
  d.id AS disciplina_id,
  d.nome AS disciplina_nome,
  d.curso AS disciplina_curso,
  d.semestre AS disciplina_semestre,
  d.periodo AS periodo,
  p.id AS professor_id,
  p.nome AS professor_nome,
  b.nota1,
  b.nota2,
  COALESCE(b.tipo_prova, 'A') AS tipo_prova,
  COALESCE(b.faltas, 0) AS faltas,
  COALESCE(b.aulas_totais, 0) AS aulas_totais,
  COALESCE(b.frequencia, 100) AS frequencia,
  b.media,
  ${this.situacaoSQL} AS situacao
FROM alunos a
JOIN disciplina d ON d.curso = a.curso AND d.semestre = a.semestre
  AND COALESCE(d.periodo, a.periodo, 'Noturno') = COALESCE(a.periodo, d.periodo, 'Noturno')
LEFT JOIN professores p ON p.id = d.professor_id
LEFT JOIN boletim b ON b.aluno_matricula = a.matricula AND b.disciplina_id = d.id
ORDER BY a.nome, d.nome`;
        const res = await db.query<any>(query)
        return res.rows
    }

    public async getBoletimPorProfessor(professorId: number, curso?: string, semestre?: number, matricula?: string): Promise<any[]> {
        const conditions = ["p.id = $1"]
        const params: any[] = [professorId]
        if (matricula) { params.push(matricula); conditions.push(`a.matricula = $${params.length}`) }
        if (curso) { params.push(curso); conditions.push(`a.curso = $${params.length}`) }
        if (semestre) { params.push(semestre); conditions.push(`a.semestre = $${params.length}`) }

        const query = `
SELECT
  COALESCE(b.id, 0) AS id,
  a.matricula AS aluno_matricula,
  a.nome AS aluno_nome,
  a.curso AS aluno_curso,
  a.semestre AS aluno_semestre,
  a.periodo AS aluno_periodo,
  d.id AS disciplina_id,
  d.nome AS disciplina_nome,
  d.curso AS disciplina_curso,
  d.semestre AS disciplina_semestre,
  d.periodo AS periodo,
  p.id AS professor_id,
  p.nome AS professor_nome,
  b.nota1,
  b.nota2,
  COALESCE(b.tipo_prova, 'A') AS tipo_prova,
  COALESCE(b.faltas, 0) AS faltas,
  COALESCE(b.aulas_totais, 0) AS aulas_totais,
  COALESCE(b.frequencia, 100) AS frequencia,
  b.media,
  ${this.situacaoSQL} AS situacao
FROM alunos a
JOIN disciplina d ON d.curso = a.curso AND d.semestre = a.semestre
  AND COALESCE(d.periodo, a.periodo, 'Noturno') = COALESCE(a.periodo, d.periodo, 'Noturno')
JOIN professores p ON p.id = d.professor_id
LEFT JOIN boletim b ON b.aluno_matricula = a.matricula AND b.disciplina_id = d.id
WHERE ${conditions.join(' AND ')}
ORDER BY d.curso, d.semestre, d.periodo, a.nome, d.nome`;
        const res = await db.query<any>(query, params)
        return res.rows
    }
}

export default BoletimRepository
