import z from 'zod';

export const signInDto = z.object({
  email: z
    .string({ invalid_type_error: 'Email must be a string' })
    .nonempty('Please enter your email')
    .email('Please enter a valid email address'),
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .nonempty('Please enter your password'),
});

export type SignInDto = z.infer<typeof signInDto>;
