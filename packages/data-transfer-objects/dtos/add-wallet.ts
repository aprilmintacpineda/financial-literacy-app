import z from 'zod';
import {
  supportedCurrenciesCodes,
  supportedWalletTypes,
} from '../enums';

export const addWalletDto = z.object({
  name: z
    .string({ invalid_type_error: 'Name must be a string' })
    .nonempty('Please enter wallet name'),
  initialAmount: z.number({
    invalid_type_error: 'Initial amount must be a number',
  }),
  organizationId: z.string(),
  walletType: z.enum(supportedWalletTypes, {
    invalid_type_error: 'Please select wallet type from the options',
    required_error: 'Please select a wallet type',
  }),
  currency: z.enum(supportedCurrenciesCodes, {
    invalid_type_error: 'Please select currency from the options',
    required_error: 'Please select a currency',
  }),
});

export type AddWalletDto = z.infer<typeof addWalletDto>;
