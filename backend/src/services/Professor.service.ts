import ProfessorRepository from "../repositories/Professor.repository"
import ProfessorType from "../types/Professor.type"

class ProfessorService {
    private repository = new ProfessorRepository()

    public async registerNewProfessor(professor: ProfessorType) {
        await this.repository.createProfessor(professor)
    }

    public async getProfessor(id: number) {
        const professor = await this.repository.getProfessorPerId(id)
        return professor
    }
}

export default ProfessorService