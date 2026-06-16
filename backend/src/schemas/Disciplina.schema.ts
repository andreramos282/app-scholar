import { z } from "zod";

export const disciplinaSchema = z.object({
    nome: z.string().min(1),
    carga_horaria: z.coerce.number().min(1),
    professor_id: z.coerce.number().int().positive().optional().nullable(),
    curso: z.string().min(1),
    semestre: z.coerce.number().min(1).max(6).default(1),
    periodo: z.enum(["Matutino", "Vespertino", "Noturno", "Diurno"]).default("Noturno")
});

export type Disciplina = z.infer<typeof disciplinaSchema>;
