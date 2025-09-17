import z from 'zod';

export const addTagDto = z.object({
  organizationId: z.string().nonempty(),
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter tag name'),
  description: z.string().max(255).optional().nullable(),
});

export type AddTagDto = z.infer<typeof addTagDto>;
