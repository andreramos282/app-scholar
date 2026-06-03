import { Request, Response } from 'express';
import { BoletimRepository } from '../repositories/BoletimRepository';

const boletimRepo = new BoletimRepository();

export class BoletimController {
  async create(req: Request, res: Response) {
    try {
      const boletim = await boletimRepo.create(req.body);
      res.status(201).json(boletim);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const boletins = await boletimRepo.findAll();
      res.json(boletins);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findByAluno(req: Request, res: Response) {
    try {
      const boletins = await boletimRepo.findByAluno(req.params.matricula);
      if (boletins.length === 0) {
        return res.status(404).json({ error: 'Nenhum boletim encontrado para este aluno' });
      }
      res.json(boletins);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const boletim = await boletimRepo.update(parseInt(req.params.id), req.body);
      res.json(boletim);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const deleted = await boletimRepo.delete(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: 'Boletim não encontrado' });
      }
      res.json({ message: 'Boletim deletado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
