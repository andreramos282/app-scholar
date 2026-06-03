import db from '../db';
import { Professor } from '../types';

export class ProfessorRepository {
  async create(professor: Professor): Promise<Professor> {
    const query = `
      INSERT INTO professores (nome, titulacao, area_atuacao, tempo_docencia, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      professor.nome,
      professor.titulacao,
      professor.area_atuacao,
      professor.tempo_docencia,
      professor.email,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<Professor | null> {
    const query = 'SELECT * FROM professores WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Professor | null> {
    const query = 'SELECT * FROM professores WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  async findAll(): Promise<Professor[]> {
    const query = 'SELECT * FROM professores ORDER BY nome';
    const result = await db.query(query);
    return result.rows;
  }

  async update(id: number, professor: Partial<Professor>): Promise<Professor> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(professor).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Professor não encontrado');
      return existing;
    }

    values.push(id);
    const query = `
      UPDATE professores
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM professores WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }
}
