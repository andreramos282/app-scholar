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
      const matricula = String(req.params.matricula);
      const boletins = await boletimRepo.findByAluno(matricula);
      res.json(boletins);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const boletim = await boletimRepo.update(id, req.body);
      res.json(boletim);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await boletimRepo.delete(id);
      if (!deleted) return res.status(404).json({ error: 'Boletim não encontrado' });
      res.json({ message: 'Boletim deletado com sucesso' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
