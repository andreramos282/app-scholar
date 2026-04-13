import { z } from "zod";

export const disciplinaSchema = z.object({
    nome: z.string(),
    carga_horaria: z.number(),
    professor_id: z.number().optional(),
    curso: z.string(),
    semestre: z.number()
});

export type Disciplina = z.infer<typeof disciplinaSchema>;