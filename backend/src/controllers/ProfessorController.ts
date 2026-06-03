import { Request, Response } from 'express';
import db from '../db';

export interface Professor {
  id?: number;
  nome: string;
  email: string;
  especialidade: string;
  telefone?: string;
}

class ProfessorRepository {
  async create(professor: Professor): Promise<Professor> {
    const query = `
      INSERT INTO professores (nome, email, especialidade, telefone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [professor.nome, professor.email, professor.especialidade, professor.telefone || null];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async findById(id: number): Promise<Professor | null> {
    const query = 'SELECT * FROM professores WHERE id = $1';
    const result = await db.query(query, [id]);
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

const professorRepo = new ProfessorRepository();

export class ProfessorController {
  async create(req: Request, res: Response) {
    try {
      const professor = await professorRepo.create(req.body);
      res.status(201).json(professor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const professores = await professorRepo.findAll();
      res.json(professores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const professor = await professorRepo.findById(parseInt(req.params.id));
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      res.json(professor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const professor = await professorRepo.update(parseInt(req.params.id), req.body);
      res.json(professor);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await professorRepo.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }
      res.json({ message: 'Professor deletado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
