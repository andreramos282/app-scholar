import db from '../db';
import { Aluno } from '../types';

export class AlunoRepository {
  async create(aluno: Aluno): Promise<Aluno> {
    const query = `
      INSERT INTO alunos (matricula, nome, curso, email, telefone, cep, endereco, cidade, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      aluno.matricula,
      aluno.nome,
      aluno.curso,
      aluno.email,
      aluno.telefone || null,
      aluno.cep || null,
      aluno.endereco || null,
      aluno.cidade || null,
      aluno.estado || null,
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findByMatricula(matricula: string): Promise<Aluno | null> {
    const query = 'SELECT * FROM alunos WHERE matricula = $1';
    const result = await db.query(query, [matricula]);
    return result.rows[0] || null;
  }

  async findByEmail(email: string): Promise<Aluno | null> {
    const query = 'SELECT * FROM alunos WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
  }

  async findAll(): Promise<Aluno[]> {
    const query = 'SELECT * FROM alunos ORDER BY nome';
    const result = await db.query(query);
    return result.rows;
  }

  async update(matricula: string, aluno: Partial<Aluno>): Promise<Aluno> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(aluno).forEach(([key, value]) => {
      if (key !== 'matricula' && value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      const existing = await this.findByMatricula(matricula);
      if (!existing) throw new Error('Aluno não encontrado');
      return existing;
    }

    values.push(matricula);
    const query = `
      UPDATE alunos
      SET ${updates.join(', ')}
      WHERE matricula = $${paramCount}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async delete(matricula: string): Promise<boolean> {
    const query = 'DELETE FROM alunos WHERE matricula = $1';
    const result = await db.query(query, [matricula]);
    return result.rowCount > 0;
  }
}
