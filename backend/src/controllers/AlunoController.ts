import { Request, Response } from 'express';
import { AlunoRepository } from '../repositories/AlunoRepository';

const alunoRepo = new AlunoRepository();

export class AlunoController {
  async create(req: Request, res: Response) {
    try {
      const aluno = await alunoRepo.create(req.body);
      res.status(201).json(aluno);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const alunos = await alunoRepo.findAll();
      res.json(alunos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findByMatricula(req: Request, res: Response) {
    try {
      const aluno = await alunoRepo.findByMatricula(req.params.matricula);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      res.json(aluno);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const aluno = await alunoRepo.update(req.params.matricula, req.body);
      res.json(aluno);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await alunoRepo.delete(req.params.matricula);
      if (!deleted) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }
      res.json({ message: 'Aluno deletado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
