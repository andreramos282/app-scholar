import { Request, Response } from "express";
import DisciplinaService from "../services/Disciplina.service";
import DisciplinaType from "../types/Diciplina.type";

class DisciplinaController {
    private service = new DisciplinaService()

    public async registerDisciplina(req: Request<{}, {}, DisciplinaType>, res: Response) {
        try {
            const disciplina = req.body
            await this.service.registerNewDisciplina(disciplina)
            res.status(200).json({ message: "Disciplina criada!" })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getDisciplina(req: Request, res: Response) {
        try {
            const { id } = req.query
            if (!id) {
                const disciplinas = await this.service.getDisciplinas()
                res.status(200).json({ response: disciplinas })
                return
            }
            if (typeof id != "string") {
                res.sendStatus(400)
                return
            }
            const idNumber = Number(id)
            if (isNaN(idNumber)) {
                res.sendStatus(400)
                return
            }

            const disciplina = await this.service.getDisciplina(idNumber)
            res.status(200).json({ response: disciplina })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }

    public async getEstatisticas(req: Request, res: Response) {
        try {
            const totalDisciplinas = await this.service.getTotalDisciplinas()
            const disciplinasPorCurso = await this.service.getDisciplinasPorCurso()
            const disciplinasPorSemestre = await this.service.getDisciplinasPorSemestre()
            const disciplinasPorCursoESemestre = await this.service.getDisciplinasPorCursoESemestre()
            
            res.status(200).json({
                total: totalDisciplinas,
                porCurso: disciplinasPorCurso,
                porSemestre: disciplinasPorSemestre,
                porCursoESemestre: disciplinasPorCursoESemestre
            })
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default DisciplinaController