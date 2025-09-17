import z from 'zod';

export const editCategoryDto = z.object({
  organizationId: z.string().nonempty(),
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter category name'),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .max(255)
    .optional()
    .nullable(),
  id: z.string().nonempty(),
});

export type EditCategoryDto = z.infer<typeof editCategoryDto>;
