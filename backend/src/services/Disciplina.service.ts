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
}

export default DisciplinaService