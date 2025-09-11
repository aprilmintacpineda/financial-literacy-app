import z from 'zod';

export const editTagDto = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter category name'),
  description: z.string().max(255),
  id: z.string().nonempty(),
  organizationId: z.string().nonempty(),
});

export type EditTagDto = z.infer<typeof editTagDto>;
