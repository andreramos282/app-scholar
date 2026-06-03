import db from '../db';
import { Boletim } from '../types';

export interface BoletimDetalhado {
  id: number;
  aluno_matricula: string;
  disciplina_id: number;
  disciplina_nome: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: string;
}

export class BoletimRepository {
  async create(boletim: Boletim): Promise<Boletim> {
    const query = `
      INSERT INTO boletim (aluno_matricula, disciplina_id, nota1, nota2, situacao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      boletim.aluno_matricula,
      boletim.disciplina_id,
      boletim.nota1,
      boletim.nota2,
      boletim.situacao || 'Pendente',
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<Boletim | null> {
    const query = 'SELECT * FROM boletim WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByAluno(matricula: string): Promise<BoletimDetalhado[]> {
    const query = `
      SELECT 
        b.id,
        b.aluno_matricula,
        b.disciplina_id,
        d.nome as disciplina_nome,
        b.nota1,
        b.nota2,
        b.media,
        CASE 
          WHEN b.media >= 6 THEN 'Aprovado'
          ELSE 'Reprovado'
        END as situacao
      FROM boletim b
      JOIN disciplina d ON b.disciplina_id = d.id
      WHERE b.aluno_matricula = $1
      ORDER BY d.nome
    `;
    const result = await db.query(query, [matricula]);
    return result.rows;
  }

  async findAll(): Promise<BoletimDetalhado[]> {
    const query = `
      SELECT 
        b.id,
        b.aluno_matricula,
        b.disciplina_id,
        d.nome as disciplina_nome,
        b.nota1,
        b.nota2,
        b.media,
        CASE 
          WHEN b.media >= 6 THEN 'Aprovado'
          ELSE 'Reprovado'
        END as situacao
      FROM boletim b
      JOIN disciplina d ON b.disciplina_id = d.id
      ORDER BY b.aluno_matricula, d.nome
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async update(id: number, boletim: Partial<Boletim>): Promise<Boletim> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(boletim).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Boletim não encontrado');
      return existing;
    }

    values.push(id);
    const query = `
      UPDATE boletim
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM boletim WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  async deleteByAluno(matricula: string): Promise<boolean> {
    const query = 'DELETE FROM boletim WHERE aluno_matricula = $1';
    const result = await db.query(query, [matricula]);
    return result.rowCount > 0;
  }
}
