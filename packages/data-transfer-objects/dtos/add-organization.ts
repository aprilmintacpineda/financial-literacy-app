import z from 'zod';

export const addOrganizationDto = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter name'),
  description: z.string().max(255).optional().nullable(),
});

export type AddOrganizationDto = z.infer<typeof addOrganizationDto>;
