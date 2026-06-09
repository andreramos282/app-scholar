import { z } from "zod";

export const professorSchema = z.object({
  nome: z.string(),
  titulacao: z.string(),
  area_atuacao: z.string(),
  semestre: z.number().min(1).max(6),
  tempo_docencia: z.number().optional(),
  email: z.string().email()
});

export type Professor = z.infer<typeof professorSchema>;