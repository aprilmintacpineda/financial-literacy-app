import z from 'zod';
import { supportedTransactionTypes } from '../enums';

const editTransactionBaseSchema = z.object({
  id: z.string().nonempty(),
  organizationId: z.string().nonempty(),
  walletId: z
    .string({
      invalid_type_error: 'Please select wallet from the list',
    })
    .nonempty('Please select wallet from the list'),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .max(255)
    .optional()
    .nullable(),
  amount: z
    .number({
      invalid_type_error: 'Amount must be a number',
    })
    .gt(0, 'Amount must be greater than 0'),
  exchangeRate: z
    .number({
      invalid_type_error: 'Amount must be a number',
    })
    .gt(0, 'Amount must be greater than 0')
    .optional()
    .nullable(),
  transactionDate: z.date({
    invalid_type_error: 'Transaction date must be a date',
  }),
  transactionType: z.enum(supportedTransactionTypes, {
    invalid_type_error: 'Please select a transaction type',
    required_error: 'Please select a transaction type',
  }),
  tagIds: z.array(z.string().nonempty()),
});

const repaymentOrTransferSchema = editTransactionBaseSchema.extend({
  transactionType: z.enum(['Repayment', 'Transfer']),
  fromWalletId: z
    .string({
      invalid_type_error: 'Please select wallet from the list',
    })
    .nonempty('Please select wallet from the list'),
});

const expenseOrIncomeSchema = editTransactionBaseSchema.extend({
  transactionType: z.enum(['Expense', 'Income']),
  categoryId: z
    .string({
      invalid_type_error: 'Please select category from the list',
    })
    .nonempty('Please select category from the list'),
});

export const editTransactionDto = z.discriminatedUnion(
  'transactionType',
  [repaymentOrTransferSchema, expenseOrIncomeSchema],
);

export type EditTransactionDto = z.infer<typeof editTransactionDto>;

export type EditTransferOrRepaymentTransactionDto = Extract<
  EditTransactionDto,
  { transactionType: 'Transfer' | 'Repayment' }
>;

export type EditExpenseOrIncomeTransactionDto = Extract<
  EditTransactionDto,
  { transactionType: 'Expense' | 'Income' }
>;
