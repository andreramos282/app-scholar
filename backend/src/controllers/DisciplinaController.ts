import { Request, Response } from 'express';
import { DisciplinaRepository } from '../repositories/DisciplinaRepository';
import { ProfessorRepository } from '../repositories/ProfessorRepository';
import { Disciplina } from '../types';

const disciplinaRepository = new DisciplinaRepository();
const professorRepository = new ProfessorRepository();

export class DisciplinaController {
  async create(req: Request, res: Response) {
    try {
      const { nome, carga_horaria, professor_id, curso, semestre } = req.body;

      // Validações básicas
      if (!nome || !carga_horaria || !professor_id || !curso || !semestre) {
        return res.status(400).json({
          error: 'Nome, carga horária, professor, curso e semestre são obrigatórios',
        });
      }

      // Verificar se professor existe
      const professor = await professorRepository.findById(professor_id);
      if (!professor) {
        return res.status(404).json({ error: 'Professor não encontrado' });
      }

      const disciplina: Disciplina = {
        nome,
        carga_horaria,
        professor_id,
        curso,
        semestre,
      };

      const novaDisciplina = await disciplinaRepository.create(disciplina);
      res.status(201).json(novaDisciplina);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao criar disciplina' });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const disciplinas = await disciplinaRepository.findAll();
      res.json(disciplinas);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar disciplinas' });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const disciplina = await disciplinaRepository.findById(parseInt(id));

      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }

      res.json(disciplina);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar disciplina' });
    }
  }

  async findByCurso(req: Request, res: Response) {
    try {
      const { curso } = req.params;
      const disciplinas = await disciplinaRepository.findByCurso(curso);
      res.json(disciplinas);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar disciplinas' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const disciplina = await disciplinaRepository.findById(parseInt(id));
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }

      const disciplinaAtualizada = await disciplinaRepository.update(parseInt(id), updates);
      res.json(disciplinaAtualizada);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao atualizar disciplina' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const disciplina = await disciplinaRepository.findById(parseInt(id));
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }

      const deletado = await disciplinaRepository.delete(parseInt(id));
      if (deletado) {
        return res.json({ message: 'Disciplina deletada com sucesso' });
      }

      res.status(500).json({ error: 'Erro ao deletar disciplina' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao deletar disciplina' });
    }
  }
}
