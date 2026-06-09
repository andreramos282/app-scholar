import { Router } from "express";
import DisciplinaController from "../controllers/Disciplina.controller";
import { disciplinaValidationMiddleware } from "../middleware/disciplinaValidation.middleware";

class DisciplinaRoutes {
    private controller = new DisciplinaController()
    private router: Router = Router()

    private url: string = "/"

    constructor() {
        this.router.post(
            this.url,
            disciplinaValidationMiddleware,
            this.controller.registerDisciplina.bind(this.controller)
        )

        this.router.get(
            this.url,
            this.controller.getDisciplina.bind(this.controller)
        )

        this.router.get(
            "/estatisticas",
            this.controller.getEstatisticas.bind(this.controller)
        )
    }

    public getRouter() {
        return this.router
    }
}

const disciplinaRouter = new DisciplinaRoutes().getRouter()
export default disciplinaRouter