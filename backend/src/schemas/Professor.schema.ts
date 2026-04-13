import { z } from "zod";

export const professorSchema = z.object({
  nome: z.string(),
  titulacao: z.string(),
  area_atuacao: z.string(),
  tempo_docencia: z.number().optional(),
  email: z.string().email()
});

export type Professor = z.infer<typeof professorSchema>;