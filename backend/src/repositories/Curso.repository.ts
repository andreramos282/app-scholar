import db from '../db';
import CursoType from '../types/Curso.type';

class CursoRepository {
  public async createCurso(curso: CursoType) {
    const query = `
      INSERT INTO cursos (nome, area, duracao, coordenador, periodo, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const values = [curso.nome, curso.area, curso.duracao, curso.coordenador, curso.periodo ?? 'Noturno'];
    const res = await db.query<CursoType>(query, values);
    return res.rows[0];
  }

  public async getCursos(): Promise<CursoType[]> {
    const query = 'SELECT * FROM cursos ORDER BY nome ASC';
    const res = await db.query<CursoType>(query);
    return res.rows;
  }

  public async getCursoById(id: number): Promise<CursoType | undefined> {
    const query = 'SELECT * FROM cursos WHERE id = $1';
    const res = await db.query<CursoType>(query, [id]);
    return res.rows[0];
  }

  public async updateCurso(id: number, curso: CursoType) {
    const query = `
      UPDATE cursos
      SET nome = $1, area = $2, duracao = $3, coordenador = $4, periodo = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;
    const values = [curso.nome, curso.area, curso.duracao, curso.coordenador, curso.periodo ?? 'Noturno', id];
    const res = await db.query<CursoType>(query, values);
    return res.rows[0];
  }

  public async deleteCurso(id: number) {
    await db.query('DELETE FROM cursos WHERE id = $1', [id]);
  }
}

export default CursoRepository;
