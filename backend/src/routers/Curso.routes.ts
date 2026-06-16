import { Router } from 'express';
import CursoController from '../controllers/Curso.controller';
import cursoValidationMiddleware from '../middleware/cursoValidation.middleware';

class CursoRoutes {
  private controller = new CursoController();
  private router: Router = Router();

  constructor() {
    this.router.get('/', this.controller.list.bind(this.controller));
    this.router.post('/', cursoValidationMiddleware, this.controller.create.bind(this.controller));
    this.router.put('/:id', cursoValidationMiddleware, this.controller.update.bind(this.controller));
    this.router.delete('/:id', this.controller.remove.bind(this.controller));
  }

  public getRouter() {
    return this.router;
  }
}

export default new CursoRoutes().getRouter();
