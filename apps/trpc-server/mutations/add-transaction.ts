import {
  type AddExpenseOrIncomeTransactionDto,
  addTransactionDto,
  type AddTransferOrRepaymentTransactionDto,
} from '@packages/data-transfer-objects/dtos';
import { database } from '@packages/kysely';
import {
  CategoriesRepository,
  TagsRepository,
  TransactionsRepository,
  TransactionTagsRepository,
  WalletsRepository,
} from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { uniqueId } from '../../../packages/kysely/utils/generators';
import { verifiedUserProcedure } from '../trpc';
import { allFulfilledOrThrow } from '../utils/promise';

async function addExpenseOrIncomeTransaction ({
  tagIds,
  ...input
}: AddExpenseOrIncomeTransactionDto) {
  const [wallet, category, ...tags] = await Promise.all([
    WalletsRepository.getWalletById(
      input.organizationId,
      input.walletId,
    ),
    CategoriesRepository.getCategoryById(
      input.organizationId,
      input.categoryId,
    ),
    ...tagIds.map(tagId =>
      TagsRepository.getTagById(input.organizationId, tagId),
    ),
  ]);

  if (!wallet || !category || tags.length !== tagIds.length)
    throw new TRPCError({ code: 'BAD_REQUEST' });

  const currentAmount = wallet.amount;
  const newAmount =
    input.transactionType === 'Expense'
      ? currentAmount - input.amount
      : currentAmount + input.amount;

  await database.transaction().execute(async trx => {
    const transactionId = uniqueId();

    const promises: Promise<unknown>[] = [
      TransactionsRepository.createTransaction(
        {
          ...input,
          id: transactionId,
          currency: wallet.currency,
        },
        trx,
      ),
      WalletsRepository.updateAmount(
        input.organizationId,
        wallet.id,
        newAmount,
        trx,
      ),
    ];

    await allFulfilledOrThrow(
      promises.concat(
        tagIds.map(tagId =>
          TransactionTagsRepository.createTransactionTag({
            transactionId,
            tagId,
          }),
        ),
      ),
    );
  });
}

async function addRepaymentOrTransferTransaction ({
  tagIds,
  ...input
}: AddTransferOrRepaymentTransactionDto) {
  const [wallet, fromWallet, ...tags] = await Promise.all([
    WalletsRepository.getWalletById(
      input.organizationId,
      input.walletId,
    ),
    WalletsRepository.getWalletById(
      input.organizationId,
      input.fromWalletId,
    ),
    ...tagIds.map(tagId =>
      TagsRepository.getTagById(input.organizationId, tagId),
    ),
  ]);

  if (!wallet || !fromWallet || tags.length !== tagIds.length)
    throw new TRPCError({ code: 'BAD_REQUEST' });

  await database.transaction().execute(async trx => {
    const transactionId = uniqueId();

    const promises: Promise<unknown>[] = [
      TransactionsRepository.createTransaction(
        {
          ...input,
          id: transactionId,
          currency: wallet.currency,
        },
        trx,
      ),
      WalletsRepository.updateAmount(
        input.organizationId,
        fromWallet.id,
        fromWallet.amount - input.amount,
        trx,
      ),
      WalletsRepository.updateAmount(
        input.organizationId,
        wallet.id,
        wallet.amount + input.amount,
        trx,
      ),
    ];

    await allFulfilledOrThrow(
      promises.concat(
        tagIds.map(tagId =>
          TransactionTagsRepository.createTransactionTag({
            transactionId,
            tagId,
          }),
        ),
      ),
    );
  });
}

const addTransactionMutation = verifiedUserProcedure
  .input(addTransactionDto)
  .mutation(({ input }) => {
    switch (input.transactionType) {
      case 'Expense':
      case 'Income':
        return addExpenseOrIncomeTransaction(input);
      case 'Repayment':
      case 'Transfer':
        return addRepaymentOrTransferTransaction(input);
      default:
        throw new TRPCError({ code: 'BAD_REQUEST' });
    }
  });

export default addTransactionMutation;
