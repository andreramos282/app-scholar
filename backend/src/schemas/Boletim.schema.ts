import { z } from "zod";

export const boletimSchema = z.object({
    aluno_matricula: z.string().min(1),
    disciplina_id: z.coerce.number().int().positive(),
    nota1: z.coerce.number().min(0).max(10),
    nota2: z.coerce.number().min(0).max(10),
    tipo_prova: z.enum(["A", "B", "C"]).default("A"),
    faltas: z.coerce.number().int().min(0).default(0),
    aulas_totais: z.coerce.number().int().min(0).default(0),
    frequencia: z.coerce.number().min(0).max(100).optional(),
    media: z.coerce.number().optional(),
    situacao: z.string().optional()
});

export type Boletim = z.infer<typeof boletimSchema>;
