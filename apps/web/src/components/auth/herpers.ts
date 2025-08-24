import z from 'zod';

const PASS_MIN_LENGTH = 8;

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(
      PASS_MIN_LENGTH,
      `Password must be at least ${PASS_MIN_LENGTH} characters`
    ),
});

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(
      PASS_MIN_LENGTH,
      `Password must be at least ${PASS_MIN_LENGTH} characters`
    ),
});
