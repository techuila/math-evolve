import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must be at most 100 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const tokenPayloadSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: z.enum(['teacher', 'admin']),
});

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;
