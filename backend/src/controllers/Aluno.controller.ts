import { Request, response, Response } from "express";
import AlunoType from "../types/Aluno.type";
import AlunoService from "../services/Aluno.service";
import BoletimType from "../types/Boletim.type";

class AlunoController {
    private service = new AlunoService()

    public async registerAluno(req: Request<{}, {}, AlunoType>, res: Response) {
        try {
            const aluno = req.body
            await this.service.registerNewAluno(aluno)
            res.status(200).json({ message: "Aluno criado!" })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getAluno(req: Request, res: Response) {
        try {
            const { matricula } = req.query
            if (!matricula) {
                const alunos = await this.service.getAlunos()
                res.status(200).json({ response: alunos })
                return
            }
            if (typeof matricula != "string") {
                res.sendStatus(400)
                return
            }

            const aluno = await this.service.getAlunoPerMatricula(matricula)
            res.status(200).json({ response: aluno })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async registerBoletim(req: Request<{}, {}, BoletimType>, res: Response) {
        try {
            const boletim = req.body
            await this.service.registerBoletim(boletim)
            res.status(200).json({ message: "Boletim atualizado!" })
        } catch (error: any) {
            console.error("Error:", error)
            res.status(400).json({ message: error?.message || "Erro ao salvar boletim" })
        }
    }

    public async getAllBoletim(req: Request, res: Response) {
        try {
            const { matricula } = req.query
            if (!matricula) {
                const boletins = await this.service.getBoletimGeral()
                res.status(200).json(boletins)
                return
            }
            if (typeof matricula != "string") {
                res.sendStatus(400)
                return
            }

            const boletins = await this.service.getBoletim(matricula)
            res.status(200).json(boletins)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getDisciplinasPorAluno(req: Request, res: Response) {
        try {
            const { matricula } = req.query
            if (!matricula || typeof matricula !== "string") {
                res.sendStatus(400)
                return
            }

            const disciplinas = await this.service.getDisciplinasPorAluno(matricula)
            res.status(200).json(disciplinas)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getEstatisticas(req: Request, res: Response) {
        try {
            const totalAlunos = await this.service.getTotalAlunos()
            const alunosPorCurso = await this.service.getAlunosPorCurso()
            const alunosPorCursoESemestre = await this.service.getAlunosPorCursoESemestre()
            
            res.status(200).json({
                total: totalAlunos,
                porCurso: alunosPorCurso,
                porCursoESemestre: alunosPorCursoESemestre
            })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default AlunoController