import { Request, Response, NextFunction } from "express";
import { boletimSchema } from "../schemas/Boletim.schema";

export function boletimValidationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = boletimSchema.safeParse(req.body);

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