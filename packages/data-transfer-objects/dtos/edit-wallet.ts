import z from 'zod';

export const editWalletDto = z.object({
  organizationId: z.string().nonempty(),
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter category name'),
  id: z.string().nonempty(),
});

export type EditWalletDto = z.infer<typeof editWalletDto>;
