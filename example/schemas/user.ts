import { z } from 'zod';

/** Schéma démo — 8 champs pour critère de succès &lt;2s. */
export const userSchema = z.object({
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  email: z.string().email('E-mail invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
  age: z.coerce.number().int().min(18, 'Âge minimum 18 ans'),
  acceptTerms: z.boolean().refine((v) => v === true, 'Vous devez accepter les conditions'),
  country: z.enum(['BJ', 'FR', 'SN', 'CI'], {
    errorMap: () => ({ message: 'Pays invalide' }),
  }),
  bio: z.string().max(280).optional(),
});

export type User = z.infer<typeof userSchema>;
