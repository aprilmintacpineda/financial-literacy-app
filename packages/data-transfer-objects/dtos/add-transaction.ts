import z from 'zod';
import {
  supportedCurrenciesCodes,
  supportedTransactionTypes,
} from '../enums';

export const addTransactionDto = z.object({
  organizationId: z.string().nonempty(),
  walletId: z
    .string({
      invalid_type_error: 'Please select wallet from the list',
    })
    .nonempty('Please select wallet from the list'),
  categoryId: z
    .string({
      invalid_type_error: 'Please select category from the list',
    })
    .nonempty('Please select category from the list'),
  description: z.string({
    invalid_type_error: 'Description must be a string',
  }),
  amount: z
    .number({
      invalid_type_error: 'Initial amount must be a number',
    })
    .gt(0, 'Amount must be greater than 0'),
  transactionDate: z.date({
    invalid_type_error: 'Transaction date must be a date',
  }),
  transactionType: z.enum(supportedTransactionTypes, {
    invalid_type_error: 'Please select a transaction type',
    required_error: 'Please select a transaction type',
  }),
  currency: z.enum(supportedCurrenciesCodes, {
    invalid_type_error: 'Please select currency from the options',
    required_error: 'Please select a currency',
  }),
  tagIds: z.array(z.string().nonempty()),
});

export type AddTransactionDto = z.infer<typeof addTransactionDto>;
