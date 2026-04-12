import { Request, Response } from "express";
import ProfessorService from "../services/Professor.service";
import ProfessorType from "../types/Professor.type";

class ProfessorController {
    private __service__ = new ProfessorService()

    public async registerProfessor(req: Request<{}, {}, ProfessorType>, res: Response) {
        try {
            const professor = req.body
            await this.__service__.registerNewProfessor(professor)
            res.status(200).json({ message: "Professor criado!" })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getProfessor(req: Request, res: Response) {
        try {
            const { id } = req.params

            if (typeof id != "string") {
                res.sendStatus(400)
                return
            }

            const idNumber = Number(id)

            if (isNaN(idNumber)) {
                res.sendStatus(400)
                return
            }

            const professor = await this.__service__.getProfessor(idNumber)
            res.status(200).json({ message: "Sucesso ao pegar informações do professor com o ID: " + idNumber, professor: professor })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default ProfessorController