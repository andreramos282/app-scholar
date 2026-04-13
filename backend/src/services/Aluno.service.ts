import AlunoRepository from "../repositories/Aluno.repository";
import BoletimRepository from "../repositories/Boletim.type";
import AlunoType from "../types/Aluno.type";
import BoletimType from "../types/Boletim.type";

class AlunoService {
    private alunoRepository = new AlunoRepository()
    private boletimRepository = new BoletimRepository()

    public async getAlunos(): Promise<AlunoType[]> {
        const alunos = await this.alunoRepository.getAlunos()
        return alunos
    }

    public async getAlunoPerMatricula(matricula: string): Promise<AlunoType | undefined> {
        const aluno = await this.alunoRepository.getAlunoPerMatricula(matricula)
        return aluno
    }

    public async alunoExists(matricula: string): Promise<boolean> {
        const aluno = await this.getAlunoPerMatricula(matricula)
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

    public async getBoletim(matricula: string) {
        const boletim = await this.boletimRepository.getBoletimPerAluno(matricula)
        return boletim
    }

    public async getBoletimPerDisciplina(matricula: string, disciplina_id: number) {
        const boletim = await this.boletimRepository.getBoletimPerAlunoAndDisciplina(matricula, disciplina_id)
        return boletim
    }

    public async registerBoletim(newBoletim: BoletimType) {
        const boletim = (await this.getBoletimPerDisciplina(newBoletim.aluno_matricula, newBoletim.disciplina_id))[0]
        if (boletim) {
            await this.boletimRepository.updateBoletim(boletim.id, newBoletim)
        } else {
            await this.boletimRepository.createBoletim(newBoletim)
        }
    }
}

export default AlunoService