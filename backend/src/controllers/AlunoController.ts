import { Request, Response } from 'express';
import { AlunoRepository } from '../repositories/AlunoRepository';
import { Aluno } from '../types';

const alunoRepository = new AlunoRepository();

export class AlunoController {
  async create(req: Request, res: Response) {
    try {
      const { nome, matricula, curso, email, telefone, cep, endereco, cidade, estado } = req.body;

      // Validações básicas
      if (!nome || !matricula || !curso || !email) {
        return res.status(400).json({
          error: 'Nome, matrícula, curso e email são obrigatórios',
        });
      }

      // Verificar se aluno já existe
      const existente = await alunoRepository.findByMatricula(matricula);
      if (existente) {
        return res.status(409).json({ error: 'Matrícula já cadastrada' });
      }

      const emailExistente = await alunoRepository.findByEmail(email);
      if (emailExistente) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      const aluno: Aluno = {
        matricula,
        nome,
        curso,
        email,
        telefone,
        cep,
        endereco,
        cidade,
        estado,
      };

      const novoAluno = await alunoRepository.create(aluno);
      res.status(201).json(novoAluno);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao criar aluno' });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const alunos = await alunoRepository.findAll();
      res.json(alunos);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar alunos' });
    }
  }

  async findByMatricula(req: Request, res: Response) {
    try {
      const { matricula } = req.params;
      const aluno = await alunoRepository.findByMatricula(matricula);

      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      res.json(aluno);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao buscar aluno' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { matricula } = req.params;
      const updates = req.body;

      const aluno = await alunoRepository.findByMatricula(matricula);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const alunoAtualizado = await alunoRepository.update(matricula, updates);
      res.json(alunoAtualizado);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao atualizar aluno' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { matricula } = req.params;

      const aluno = await alunoRepository.findByMatricula(matricula);
      if (!aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const deletado = await alunoRepository.delete(matricula);
      if (deletado) {
        return res.json({ message: 'Aluno deletado com sucesso' });
      }

      res.status(500).json({ error: 'Erro ao deletar aluno' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Erro ao deletar aluno' });
    }
  }
}
