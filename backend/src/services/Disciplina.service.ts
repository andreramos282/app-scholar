import DisciplinaRepository from "../repositories/Disciplina.repository";
import DisciplinaType from "../types/Diciplina.type";

class DisciplinaService {
    private repository = new DisciplinaRepository()

    public async registerNewDisciplina(disciplina: DisciplinaType) {
        await this.repository.createDisciplina(disciplina)
    }

    public async getDisciplina(id: number) {
        const disciplina = await this.repository.getDisciplinaPerId(id)
        return disciplina
    }

    public async getTotalDisciplinas(): Promise<number> {
        return await this.repository.getTotalDisciplinas()
    }

    public async getDisciplinasPorCurso(): Promise<any[]> {
        return await this.repository.getDisciplinasPorCurso()
    }

    public async getDisciplinasPorSemestre(): Promise<any[]> {
        return await this.repository.getDisciplinasPorSemestre()
    }

    public async getDisciplinasPorCursoESemestre(): Promise<any[]> {
        return await this.repository.getDisciplinasPorCursoESemestre()
    }
}

export default DisciplinaService