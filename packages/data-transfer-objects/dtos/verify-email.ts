import z from 'zod';

export const verifyEmailDto = z.object({
  code: z
    .string({ invalid_type_error: 'Code must be a string' })
    .nonempty('Please enter your code'),
});

export type VerifyEmailDto = z.infer<typeof verifyEmailDto>;
