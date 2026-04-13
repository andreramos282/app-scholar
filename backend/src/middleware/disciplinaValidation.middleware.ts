import { Request, Response, NextFunction } from "express";
import { disciplinaSchema } from "../schemas/Disciplina.schema";

export function disciplinaValidationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = disciplinaSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            erro: "Body inválido",
            detalhes: result.error.format(),
        });
        return
    }

    req.body = result.data;
    next();
}