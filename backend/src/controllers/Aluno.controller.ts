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
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getAllBoletim(req: Request, res: Response) {
        try {
            const { matricula } = req.query
            if (!matricula) {
                res.sendStatus(400)
                console.log("sem matricula")
                return
            }
            if (typeof matricula != "string") {
                res.sendStatus(400)
                return
            }

            const boletins = await this.service.getBoletim(matricula)
            res.status(200).json({ response: boletins })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default AlunoController