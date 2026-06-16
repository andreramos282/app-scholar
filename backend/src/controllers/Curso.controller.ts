import { Request, Response } from 'express';
import CursoService from '../services/Curso.service';
import CursoType from '../types/Curso.type';

class CursoController {
  private service = new CursoService();

  public async create(req: Request<{}, {}, CursoType>, res: Response) {
    try {
      const curso = await this.service.createCurso(req.body);
      return res.status(201).json({ message: 'Curso cadastrado com sucesso!', response: curso });
    } catch (error) {
      console.error('Erro ao cadastrar curso:', error);
      return res.status(500).json({ message: 'Erro ao cadastrar curso' });
    }
  }

  public async list(_: Request, res: Response) {
    try {
      const cursos = await this.service.getCursos();
      return res.status(200).json({ response: cursos });
    } catch (error) {
      console.error('Erro ao listar cursos:', error);
      return res.status(500).json({ message: 'Erro ao listar cursos' });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: 'ID inválido' });
      const curso = await this.service.updateCurso(id, req.body);
      return res.status(200).json({ message: 'Curso atualizado com sucesso!', response: curso });
    } catch (error: any) {
      console.error('Erro ao atualizar curso:', error);
      return res.status(error.message === 'Curso não encontrado' ? 404 : 500).json({ message: error.message || 'Erro ao atualizar curso' });
    }
  }

  public async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id) return res.status(400).json({ message: 'ID inválido' });
      await this.service.deleteCurso(id);
      return res.status(200).json({ message: 'Curso removido com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao remover curso:', error);
      return res.status(error.message === 'Curso não encontrado' ? 404 : 500).json({ message: error.message || 'Erro ao remover curso' });
    }
  }
}

export default CursoController;
