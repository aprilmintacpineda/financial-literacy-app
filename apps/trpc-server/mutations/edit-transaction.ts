import { editTransactionDto } from '@packages/data-transfer-objects/dtos';
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

const editTransactionMutation = verifiedUserProcedure
  .input(editTransactionDto)
  .mutation(async ({ input: { tagIds, ...input } }) => {
    const [inputWallet, category, ...tags] = await Promise.all([
      WalletsRepository.getWalletById(
        input.organizationId,
        input.walletId
      ),
      CategoriesRepository.getCategoryById(
        input.organizationId,
        input.categoryId
      ),
      ...tagIds.map(tagId =>
        TagsRepository.getTagById(input.organizationId, tagId)
      ),
    ]);

    if (!inputWallet || !category || tags.length !== tagIds.length)
      throw new TRPCError({ code: 'BAD_REQUEST' });

    const originalTransaction =
      await TransactionsRepository.getTransactionById(
        input.organizationId,
        input.id
      );

    await database.transaction().execute(async trx => {
      // doing this for performance's sake
      const promises: Promise<unknown>[] = [];

      if (input.walletId !== originalTransaction.walletId) {
        // we need to revert the amount of the original wallet
        const originalWallet =
          (await WalletsRepository.getWalletById(
            input.organizationId,
            originalTransaction.walletId
          ))!;

        const originalWalletRevertedAmount =
          originalTransaction.transactionType === 'Expense'
            ? originalWallet.amount + originalTransaction.amount
            : originalWallet.amount - originalTransaction.amount;

        promises.push(
          WalletsRepository.updateAmount(
            input.organizationId,
            originalWallet.id,
            originalWalletRevertedAmount,
            trx
          )
        );

        // then recalculate what the amount would be for the new wallet
        const newAmount =
          input.transactionType === 'Expense'
            ? inputWallet.amount - input.amount
            : inputWallet.amount + input.amount;

        promises.push(
          WalletsRepository.updateAmount(
            input.organizationId,
            inputWallet.id,
            newAmount,
            trx
          )
        );
      } else {
        // we need to first revert the wallet amount to prior this transaction
        const revertedAmount =
          originalTransaction.transactionType === 'Expense'
            ? inputWallet.amount + originalTransaction.amount
            : inputWallet.amount - originalTransaction.amount;

        const newAmount =
          input.transactionType === 'Expense'
            ? revertedAmount - input.amount
            : revertedAmount + input.amount;

        promises.push(
          WalletsRepository.updateAmount(
            input.organizationId,
            inputWallet.id,
            newAmount,
            trx
          )
        );
      }

      // handle removal of tags
      originalTransaction.tags.forEach(originalTag => {
        if (!tagIds.includes(originalTag.id)) {
          promises.push(
            TransactionTagsRepository.deleteTransactionTag(
              originalTransaction.id,
              originalTag.id,
              trx
            )
          );
        }
      });

      // handle addition of tags
      tagIds.forEach(tagId => {
        if (
          !originalTransaction.tags.find(
            originalTag => originalTag.id === tagId
          )
        ) {
          promises.push(
            TransactionTagsRepository.createTransactionTag(
              {
                tagId,
                transactionId: originalTransaction.id,
              },
              trx
            )
          );
        }
      });

      promises.push(
        TransactionsRepository.editTransaction(
          input.organizationId,
          input,
          trx
        )
      );

      await allFulfilledOrThrow(promises);
    });
  });

export default editTransactionMutation;
