import { Request, Response } from 'express';
import { BoletimRepository } from '../repositories/BoletimRepository';
import { AlunoRepository } from '../repositories/AlunoRepository';
import { DisciplinaRepository } from '../repositories/DisciplinaRepository';
import { Boletim } from '../types';

const boletimRepository = new BoletimRepository();
const alunoRepository = new AlunoRepository();
const disciplinaRepository = new DisciplinaRepository();

export class BoletimController {
  async create(req: Request, res: Response) {
    try {
      const { aluno_matricula, disciplina_id, nota1, nota2, situacao } = req.body;

      // Validações básicas
      if (!aluno_matricula || !disciplina_id || nota1 === undefined || nota2 === undefined) {
        return res.status(400).json({
          error: 'Matrícula do aluno, ID da disciplina, nota1 e nota2 são obrigatórios',
        });
      }

      // Validar notas
      if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
        return res.status(400).json({
          error: 'Notas devem estar entre 0 e 10',
        });
      }

      // Verificar se aluno existe
      const aluno = await alunoRepository.findByMatricula(aluno_matricula);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      // Verificar se disciplina existe
      const disciplina = await disciplinaRepository.findById(disciplina_id);
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada' });
      }

      const boletim: Boletim = {
        aluno_matricula,
        disciplina_id,
        nota1,
        nota2,
        situacao,
      };

      const novoBoletim = await boletimRepository.create(boletim);
      res.status(201).json(novoBoletim);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao criar boletim' });
    }
  }

  async findByAluno(req: Request, res: Response) {
    try {
      const { matricula } = req.params;

      // Verificar se aluno existe
      const aluno = await alunoRepository.findByMatricula(matricula);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const boletim = await boletimRepository.findByAluno(matricula);

      res.json({
        aluno: aluno.nome,
        matricula: aluno.matricula,
        disciplinas: boletim,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar boletim' });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const boletim = await boletimRepository.findAll();
      res.json(boletim);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar boletins' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const boletim = await boletimRepository.findById(parseInt(id));
      if (!boletim) {
        return res.status(404).json({ error: 'Boletim não encontrado' });
      }

      // Validar notas se forem atualizadas
      if (updates.nota1 !== undefined && (updates.nota1 < 0 || updates.nota1 > 10)) {
        return res.status(400).json({ error: 'Nota1 deve estar entre 0 e 10' });
      }
      if (updates.nota2 !== undefined && (updates.nota2 < 0 || updates.nota2 > 10)) {
        return res.status(400).json({ error: 'Nota2 deve estar entre 0 e 10' });
      }

      const boletimAtualizado = await boletimRepository.update(parseInt(id), updates);
      res.json(boletimAtualizado);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao atualizar boletim' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const boletim = await boletimRepository.findById(parseInt(id));
      if (!boletim) {
        return res.status(404).json({ error: 'Boletim não encontrado' });
      }

      const deletado = await boletimRepository.delete(parseInt(id));
      if (deletado) {
        return res.json({ message: 'Boletim deletado com sucesso' });
      }

      res.status(500).json({ error: 'Erro ao deletar boletim' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao deletar boletim' });
    }
  }
}
