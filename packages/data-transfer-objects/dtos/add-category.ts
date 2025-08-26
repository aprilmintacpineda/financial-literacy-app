import z from 'zod';

export const addCategoryDto = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter category name'),
  description: z.string().max(255).optional(),
  organizationId: z.string(),
});

export type AddCategoryDto = z.infer<typeof addCategoryDto>;
