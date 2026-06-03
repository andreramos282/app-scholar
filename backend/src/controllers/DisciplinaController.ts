import { Request, Response } from 'express';
import { DisciplinaRepository } from '../repositories/DisciplinaRepository';

const disciplinaRepo = new DisciplinaRepository();

export class DisciplinaController {
  async create(req: Request, res: Response) {
    try {
      const disciplina = await disciplinaRepo.create(req.body);
      res.status(201).json(disciplina);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const disciplinas = await disciplinaRepo.findAll();
      res.json(disciplinas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const disciplina = await disciplinaRepo.findById(parseInt(req.params.id));
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }
      res.json(disciplina);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findByCurso(req: Request, res: Response) {
    try {
      const disciplinas = await disciplinaRepo.findByCurso(req.params.curso);
      res.json(disciplinas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const disciplina = await disciplinaRepo.update(parseInt(req.params.id), req.body);
      res.json(disciplina);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await disciplinaRepo.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }
      res.json({ message: 'Disciplina deletada com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
