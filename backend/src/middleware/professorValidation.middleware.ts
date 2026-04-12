import { Request, Response, NextFunction } from "express";
import { professorSchema } from "../schemas/Professor.schema";

function professorValidationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = professorSchema.safeParse(req.body);

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

export default professorValidationMiddleware;