import { Router } from "express";
import ProfessorController from "../controllers/Professor.controller";
import professorValidationMiddleware from "../middleware/professorValidation.middleware";

class ProfessorRoutes {
    private controller = new ProfessorController
    private router: Router = Router()

    private url: string = "/"

    constructor() {
        this.router.post(
            this.url,
            professorValidationMiddleware,
            this.controller.registerProfessor.bind(this.controller)
        )

        this.router.get(
            this.url,
            this.controller.getProfessor.bind(this.controller)
        )
    }

    public getRouter() {
        return this.router
    }
}

const professorRoutes = new ProfessorRoutes().getRouter()
export default professorRoutes