import { Request, Response, NextFunction } from 'express';
import { cursoSchema } from '../schemas/Curso.schema';

export default function cursoValidationMiddleware(req: Request, res: Response, next: NextFunction) {
  const result = cursoSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: 'Dados inválidos', errors: result.error.flatten().fieldErrors });
  }
  req.body = result.data;
  return next();
}
