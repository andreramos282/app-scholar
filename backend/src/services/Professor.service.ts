import ProfessorRepository from "../repositories/Professor.repository"
import ProfessorType from "../types/Professor.type"
import BoletimRepository from "../repositories/Boletim.type"
import DisciplinaRepository from "../repositories/Disciplina.repository"

class ProfessorService {
    private repository = new ProfessorRepository()
    private boletimRepository = new BoletimRepository()
    private disciplinaRepository = new DisciplinaRepository()

    public async registerNewProfessor(professor: ProfessorType) {
        await this.repository.createProfessor(professor)
    }

    public async getProfessor(id: number) {
        const professor = await this.repository.getProfessorPerId(id)
        return professor
    }

    public async getDisciplinasPorProfessor(professorId: number) {
        return await this.disciplinaRepository.getDisciplinasPorProfessor(professorId)
    }

    public async getBoletimPorProfessor(professorId: number, curso?: string, semestre?: number, matricula?: string) {
        return await this.boletimRepository.getBoletimPorProfessor(professorId, curso, semestre, matricula)
    }

    public async getTotalProfessores(): Promise<number> {
        return await this.repository.getTotalProfessores()
    }

    public async getProfessoresPorSemestre(): Promise<any[]> {
        return await this.repository.getProfessoresPorSemestre()
    }
}

export default ProfessorService