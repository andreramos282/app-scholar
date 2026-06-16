import CursoRepository from '../repositories/Curso.repository';
import CursoType from '../types/Curso.type';

class CursoService {
  private repository = new CursoRepository();

  public async createCurso(curso: CursoType) {
    return this.repository.createCurso(curso);
  }

  public async getCursos() {
    return this.repository.getCursos();
  }

  public async updateCurso(id: number, curso: CursoType) {
    const existing = await this.repository.getCursoById(id);
    if (!existing) throw new Error('Curso não encontrado');
    return this.repository.updateCurso(id, curso);
  }

  public async deleteCurso(id: number) {
    const existing = await this.repository.getCursoById(id);
    if (!existing) throw new Error('Curso não encontrado');
    return this.repository.deleteCurso(id);
  }
}

export default CursoService;
