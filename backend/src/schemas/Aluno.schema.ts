import { z } from "zod";

export const alunoSchema = z.object({
    matricula: z.string().min(1),
    nome: z.string().min(1),
    curso: z.string().min(1),
    curso_id: z.coerce.number().int().positive().optional().nullable(),
    email: z.string().email(),
    senha: z.string().optional().default('123456'),
    semestre: z.coerce.number().min(1).max(6).default(1),
    periodo: z.enum(["Matutino", "Vespertino", "Noturno", "Diurno"]).default("Noturno"),
    telefone: z.string().optional().default(''),
    cep: z.string().optional().default(''),
    endereco: z.string().optional().default(''),
    cidade: z.string().optional().default(''),
    estado: z.string().optional().default('')
});

export type Aluno = z.infer<typeof alunoSchema>;
