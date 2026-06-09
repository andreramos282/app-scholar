import { Router } from "express";
import AlunoController from "../controllers/Aluno.controller";
import alunoValidationMiddleware from "../middleware/alunoValidation.middleware";
import { boletimValidationMiddleware } from "../middleware/boletimValidation.middleware";

class AlunoRoutes {
    private controller = new AlunoController()
    private router: Router = Router()

    private url: string = "/"
    private url_boletim: string = "/boletim"

    constructor() {
        this.router.post(
            this.url,
            alunoValidationMiddleware,
            this.controller.registerAluno.bind(this.controller)
        )

        this.router.get(
            this.url,
            this.controller.getAluno.bind(this.controller)
        )

        this.router.get(
            "/disciplinas",
            this.controller.getDisciplinasPorAluno.bind(this.controller)
        )

        this.router.post(
            this.url_boletim,
            boletimValidationMiddleware,
            this.controller.registerBoletim.bind(this.controller)
        )

        this.router.get(
            this.url_boletim,
            this.controller.getAllBoletim.bind(this.controller)
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

const alunoRoutes = new AlunoRoutes().getRouter()
export default alunoRoutes