import { addTransactionDto } from '@packages/data-transfer-objects/dtos';
import { database } from '@packages/kysely';
import {
  CategoriesRepository,
  TagsRepository,
  TransactionsRepository,
  TransactionTagsRepository,
  WalletsRepository,
} from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { verifiedUserProcedure } from '../trpc';
import { allFulfilledOrThrow } from '../utils/promise';

const addTransactionMutation = verifiedUserProcedure
  .input(addTransactionDto)
  .mutation(async ({ input: { tagIds, ...input } }) => {
    // validate that wallet, category, tags exists and are not deleted
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
      await WalletsRepository.updateAmount(
        input.organizationId,
        wallet.id,
        newAmount,
        trx,
      );

      const transactionId =
        await TransactionsRepository.createTransaction(input, trx);

      await allFulfilledOrThrow(
        tagIds.map(tagId =>
          TransactionTagsRepository.createTransactionTag({
            transactionId,
            tagId,
          }),
        ),
      );
    });
  });

export default addTransactionMutation;
