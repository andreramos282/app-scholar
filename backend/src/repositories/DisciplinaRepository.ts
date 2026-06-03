import db from '../db';
import { Disciplina } from '../types';

export class DisciplinaRepository {
  async create(disciplina: Disciplina): Promise<Disciplina> {
    const query = `
      INSERT INTO disciplina (nome, carga_horaria, professor_id, curso, semestre)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      disciplina.nome,
      disciplina.carga_horaria,
      disciplina.professor_id,
      disciplina.curso,
      disciplina.semestre,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<Disciplina | null> {
    const query = 'SELECT * FROM disciplina WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(): Promise<Disciplina[]> {
    const query = 'SELECT * FROM disciplina ORDER BY nome';
    const result = await db.query(query);
    return result.rows;
  }

  async findByCurso(curso: string): Promise<Disciplina[]> {
    const query = 'SELECT * FROM disciplina WHERE curso = $1 ORDER BY semestre, nome';
    const result = await db.query(query, [curso]);
    return result.rows;
  }

  async findBySemestre(semestre: number): Promise<Disciplina[]> {
    const query = 'SELECT * FROM disciplina WHERE semestre = $1 ORDER BY nome';
    const result = await db.query(query, [semestre]);
    return result.rows;
  }

  async update(id: number, disciplina: Partial<Disciplina>): Promise<Disciplina> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(disciplina).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Disciplina não encontrada');
      return existing;
    }

    values.push(id);
    const query = `
      UPDATE disciplina
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM disciplina WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
}
