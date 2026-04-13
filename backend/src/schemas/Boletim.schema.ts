import { z } from "zod";

export const boletimSchema = z.object({
    aluno_matricula: z.string(),
    disciplina_id: z.number(),
    nota1: z.number(),
    nota2: z.number(),
    media: z.number().optional(),
    situacao: z.string().optional()
});

export type Boletim = z.infer<typeof boletimSchema>;