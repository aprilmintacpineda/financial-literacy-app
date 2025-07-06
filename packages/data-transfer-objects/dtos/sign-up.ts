import z from 'zod';

export const signUpDto = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});
