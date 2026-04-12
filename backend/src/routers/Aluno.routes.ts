import { Router } from "express";
import AlunoController from "../controllers/Aluno.controller";
import alunoValidationMiddleware from "../middleware/alunoValidation.middleware";

class AlunoRoutes {
    private __controller__ = new AlunoController()
    private router: Router = Router()

    private url: string = "/"

    constructor() {
        this.router.post(
            this.url,
            alunoValidationMiddleware,
            this.__controller__.registerAluno.bind(this.__controller__)
        )

        this.router.get(
            this.url,
            this.__controller__.getAluno.bind(this.__controller__)
        )
    }
    
    public getRouter() {
        return this.router
    }
}

const alunoRoutes = new AlunoRoutes().getRouter()
export default alunoRoutes