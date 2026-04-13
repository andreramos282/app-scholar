import { Request, Response } from "express";
import ProfessorService from "../services/Professor.service";
import ProfessorType from "../types/Professor.type";

class ProfessorController {
    private service = new ProfessorService()

    public async registerProfessor(req: Request<{}, {}, ProfessorType>, res: Response) {
        try {
            const professor = req.body
            await this.service.registerNewProfessor(professor)
            res.status(200).json({ message: "Professor criado!" })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getProfessor(req: Request, res: Response) {
        try {
            const { id } = req.query
            if (!id) {
                res.sendStatus(400)
                return
            }
            if (typeof id != "string") {
                res.sendStatus(400)
                console.log(id)
                return
            }
            const idNumber = Number(id)
            if (isNaN(idNumber)) {
                res.sendStatus(400)
                return
            }

            const professor = await this.service.getProfessor(idNumber)
            res.status(200).json({ response: professor })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default ProfessorController