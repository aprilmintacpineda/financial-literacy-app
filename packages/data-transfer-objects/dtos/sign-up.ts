import z from 'zod';

export const signUpDto = z.object({
  email: z
    .string({ invalid_type_error: 'Email must be a string' })
    .nonempty('Please enter your email')
    .email('Please enter your email'),
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .nonempty('Please enter your desired password'),
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter your name'),
});

export type SignUpDto = z.infer<typeof signUpDto>;
