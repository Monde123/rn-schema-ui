import { z } from 'zod';

/** Demo schema — 8 fields for the <2s generate success criterion. */
export const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password: at least 8 characters'),
  age: z.coerce.number().int().min(18, 'Minimum age is 18'),
  acceptTerms: z.boolean().refine((v) => v === true, 'You must accept the terms'),
  country: z.enum(['BJ', 'FR', 'SN', 'CI'], {
    errorMap: () => ({ message: 'Invalid country' }),
  }),
  bio: z.string().max(280).optional(),
});

export type User = z.infer<typeof userSchema>;
