import { Router } from "express";
import ProfessorController from "../controllers/Professor.controller";
import professorValidationMiddleware from "../middleware/professorValidation.middleware";

class ProfessorRoutes {
    private __controller__ = new ProfessorController
    private router: Router = Router()

    private url: string = "/"

    constructor() {
        this.router.post(
            this.url,
            professorValidationMiddleware,
            this.__controller__.registerProfessor.bind(this.__controller__)
        )

        this.router.get(
            this.url,
            this.__controller__.getProfessor.bind(this.__controller__)
        )
    }

    public getRouter() {
        return this.router
    }
}

const professorRoutes = new ProfessorRoutes().getRouter()
export default professorRoutes