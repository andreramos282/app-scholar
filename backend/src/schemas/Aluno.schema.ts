import { z } from "zod";

export const alunoSchema = z.object({
    matricula: z.string(),
    nome: z.string(),
    curso: z.string(),
    email: z.string().email(),
    telefone: z.string().optional(),
    cep: z.string().optional(),
    endereco: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().length(2).optional()
});

export type Aluno = z.infer<typeof alunoSchema>;