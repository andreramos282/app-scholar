import ProfessorRepository from "../repositories/Professor.repository"
import ProfessorType from "../types/Professor.type"

class ProfessorService {
    private professorRepository = new ProfessorRepository()

    public async registerNewProfessor(professor: ProfessorType) {
        await this.professorRepository.createProfessor(professor)
    }

    public async getProfessor(id: number) {
        const professor = await this.professorRepository.getProfessorPerId(id)
        return professor
    }
}

export default ProfessorService