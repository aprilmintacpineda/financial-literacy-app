import z from 'zod';

export const editWalletDto = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter category name'),
  id: z.string(),
});

export type EditWalletDto = z.infer<typeof editWalletDto>;
