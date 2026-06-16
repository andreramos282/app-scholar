import { z } from "zod";

export const professorSchema = z.object({
  nome: z.string().min(1),
  titulacao: z.string().min(1).default('Não informada'),
  area_atuacao: z.string().min(1).default('Não informada'),
  area: z.string().optional(),
  semestre: z.coerce.number().min(1).max(6).default(1),
  periodo: z.enum(["Matutino", "Vespertino", "Noturno", "Diurno"]).default("Noturno"),
  tempo_docencia: z.coerce.number().optional().default(0),
  email: z.string().email(),
  senha: z.string().optional().default('123456'),
}).transform((d) => ({ ...d, area_atuacao: d.area_atuacao || d.area || 'Não informada' }));

export type Professor = z.infer<typeof professorSchema>;
