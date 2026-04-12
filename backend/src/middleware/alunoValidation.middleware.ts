import { Request, Response, NextFunction } from "express";
import { alunoSchema } from "../schemas/Aluno.schema";

function alunoValidationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = alunoSchema.safeParse(req.body);

    console.log("a")

    if (!result.success) {
        res.status(400).json({
            erro: "Body inválido",
            detalhes: result.error.format(),
        });
        return
    }

    console.log("b")

    req.body = result.data;
    next();
}

export default alunoValidationMiddleware;