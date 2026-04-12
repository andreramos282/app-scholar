import { Request, Response } from "express";
import AlunoType from "../types/Aluno.type";
import AlunoService from "../services/Aluno.service";

class AlunoController {
    private __service__ = new AlunoService()

    public async registerAluno(req: Request<{}, {}, AlunoType>, res: Response) {
        try {
            const aluno = req.body
            await this.__service__.registerNewAluno(aluno)
            res.status(200).json({ message: "Aluno criado!" })
        } catch (error: unknown) {
            res.sendStatus(500)
        }
    }

    public async getAluno(req: Request, res: Response) {
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

            const aluno = await this.__service__.getAluno(matricula)
            res.status(200).json({ message: "Sucesso ao pegar informações do aluno com a matricula: " + matricula, aluno: aluno })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default AlunoController