import db from '../db';
import { Boletim } from '../types';

export class BoletimRepository {
  private calcular(boletim: any) {
    const nota1 = Number(boletim.nota1 ?? 0);
    const nota2 = Number(boletim.nota2 ?? 0);
    const faltas = Number(boletim.faltas ?? 0);
    const aulasTotais = Number(boletim.aulas_totais ?? 0);
    const frequencia = boletim.frequencia !== undefined && boletim.frequencia !== null
      ? Number(boletim.frequencia)
      : aulasTotais > 0 ? Math.max(0, Math.min(100, ((aulasTotais - faltas) / aulasTotais) * 100)) : 100;
    const media = (nota1 + nota2) / 2;
    const situacao = frequencia < 75 ? 'Reprovado por falta' : media >= 6 ? 'Aprovado' : 'Reprovado por nota';
    return { ...boletim, nota1, nota2, faltas, aulas_totais: aulasTotais, frequencia, media, situacao, tipo_prova: boletim.tipo_prova || 'A' };
  }

  async create(boletim: any): Promise<any> {
    const b = this.calcular(boletim);
    const query = `
      INSERT INTO boletim (aluno_matricula, disciplina_id, nota1, nota2, tipo_prova, faltas, aulas_totais, frequencia, situacao)
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
      RETURNING *
    `;
    const values = [b.aluno_matricula, b.disciplina_id, b.nota1, b.nota2, b.tipo_prova, b.faltas, b.aulas_totais, b.frequencia, b.situacao];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<any | null> {
    const result = await db.query('SELECT * FROM boletim WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async findByAluno(matricula: string): Promise<any[]> {
    const query = `
      SELECT b.*, d.nome as disciplina_nome, d.curso as disciplina_curso, d.semestre as disciplina_semestre, d.periodo
      FROM boletim b
      JOIN disciplina d ON b.disciplina_id = d.id
      WHERE b.aluno_matricula = $1
      ORDER BY d.nome
    `;
    const result = await db.query(query, [matricula]);
    return result.rows;
  }

  async findAll(): Promise<any[]> {
    const query = `
      SELECT b.*, a.nome as aluno_nome, d.nome as disciplina_nome, d.curso as disciplina_curso, d.semestre as disciplina_semestre, d.periodo
      FROM boletim b
      JOIN alunos a ON a.matricula = b.aluno_matricula
      JOIN disciplina d ON b.disciplina_id = d.id
      ORDER BY a.nome, d.nome
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async update(id: number, boletim: Partial<Boletim> | any): Promise<any> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Boletim não encontrado');
    const b = this.calcular({ ...existing, ...boletim });
    const query = `
      UPDATE boletim
      SET aluno_matricula=$1, disciplina_id=$2, nota1=$3, nota2=$4, tipo_prova=$5, faltas=$6, aulas_totais=$7, frequencia=$8, situacao=$9
      WHERE id=$10
      RETURNING *
    `;
    const values = [b.aluno_matricula, b.disciplina_id, b.nota1, b.nota2, b.tipo_prova, b.faltas, b.aulas_totais, b.frequencia, b.situacao, id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await db.query('DELETE FROM boletim WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  }
}
