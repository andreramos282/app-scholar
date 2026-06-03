import { Request, Response } from 'express';
import { ProfessorRepository } from '../repositories/ProfessorRepository';
import { Professor } from '../types';

const professorRepository = new ProfessorRepository();

export class ProfessorController {
  async create(req: Request, res: Response) {
    try {
      const { nome, titulacao, area_atuacao, tempo_docencia, email } = req.body;

      // Validações básicas
      if (!nome || !titulacao || !area_atuacao || tempo_docencia === undefined || !email) {
        return res.status(400).json({
          error: 'Nome, titulação, área, tempo de docência e email são obrigatórios',
        });
      }

      // Verificar se email já existe
      const existente = await professorRepository.findByEmail(email);
      if (existente) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      const professor: Professor = {
        nome,
        titulacao,
        area_atuacao,
        tempo_docencia,
        email,
      };

      const novoProfessor = await professorRepository.create(professor);
      res.status(201).json(novoProfessor);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao criar professor' });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const professores = await professorRepository.findAll();
      res.json(professores);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar professores' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const professor = await professorRepository.findById(parseInt(id));

      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      res.json(professor);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar professor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const professor = await professorRepository.findById(parseInt(id));
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      const professorAtualizado = await professorRepository.update(parseInt(id), updates);
      res.json(professorAtualizado);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao atualizar professor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const professor = await professorRepository.findById(parseInt(id));
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      const deletado = await professorRepository.delete(parseInt(id));
      if (deletado) {
        return res.json({ message: 'Professor deletado com sucesso' });
      }

      res.status(500).json({ error: 'Erro ao deletar professor' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao deletar professor' });
    }
  }
}
