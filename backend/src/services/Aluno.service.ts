import AlunoRepository from "../repositories/Aluno.repository";
import AlunoType from "../types/Aluno.type";

class AlunoService {
    private alunoRepository = new AlunoRepository()

    public async getAluno(matricula: string): Promise<AlunoType | undefined> {
        const aluno = await this.alunoRepository.getAlunoPerMatricula(matricula)
        return aluno
    }

    public async alunoExists(matricula: string): Promise<boolean> {
        const aluno = await this.getAluno(matricula)
        if (aluno)
            return true
        else
            return false
    }

    public async registerNewAluno(aluno: AlunoType) {
        await this.alunoRepository.createAluno(aluno)
        const created = await this.alunoExists(aluno.matricula)
        if (!created)
            throw new Error("Erro ao criar aluno")
    }
}

export default AlunoService