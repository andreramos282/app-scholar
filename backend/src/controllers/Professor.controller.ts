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
                const professores = await this.service.getProfessores()
                res.status(200).json({ response: professores })
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

    public async getBoletimPorProfessor(req: Request, res: Response) {
        try {
            const { professorId, curso, semestre, matricula } = req.query;

            if (!professorId || typeof professorId !== "string") {
                res.sendStatus(400)
                return
            }

            const sem = semestre ? Number(semestre) : undefined
            const boletim = await this.service.getBoletimPorProfessor(
                Number(professorId),
                typeof curso === "string" ? curso : undefined,
                sem,
                typeof matricula === "string" ? matricula : undefined
            )

            res.status(200).json(boletim)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getDisciplinasPorProfessor(req: Request, res: Response) {
        try {
            const { professorId } = req.query;
            if (!professorId || typeof professorId !== "string") {
                res.sendStatus(400)
                return
            }

            const disciplinas = await this.service.getDisciplinasPorProfessor(Number(professorId))
            res.status(200).json(disciplinas)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getEstatisticas(req: Request, res: Response) {
        try {
            const totalProfessores = await this.service.getTotalProfessores()
            const professoresPorSemestre = await this.service.getProfessoresPorSemestre()
            
            res.status(200).json({
                total: totalProfessores,
                porSemestre: professoresPorSemestre
            })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default ProfessorController