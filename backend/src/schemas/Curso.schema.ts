import { z } from 'zod';

export const cursoSchema = z.object({
  nome: z.string().min(2, 'Nome do curso é obrigatório'),
  area: z.string().min(2, 'Área é obrigatória'),
  duracao: z.union([z.coerce.number().int().min(1), z.string().min(1)]).transform((value) => String(value)),
  coordenador: z.string().min(2, 'Coordenador é obrigatório'),
  periodo: z.enum(['Diurno', 'Noturno', 'Matutino', 'Vespertino']).optional(),
});
