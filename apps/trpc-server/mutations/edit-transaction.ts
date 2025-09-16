import {
  type EditExpenseOrIncomeTransactionDto,
  editTransactionDto,
  type EditTransferOrRepaymentTransactionDto,
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
import { verifiedUserProcedure } from '../trpc';
import { allFulfilledOrThrow } from '../utils/promise';

async function editIncomeOrExpenseTransaction ({
  tagIds,
  ...input
}: EditExpenseOrIncomeTransactionDto) {
  const [inputWallet, category, ...tags] = await Promise.all([
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

  if (!inputWallet || !category || tags.length !== tagIds.length)
    throw new TRPCError({ code: 'BAD_REQUEST' });

  const originalTransaction =
    await TransactionsRepository.getTransactionById(
      input.organizationId,
      input.id,
    );

  if (originalTransaction.transactionType !== input.transactionType)
    throw new TRPCError({ code: 'BAD_REQUEST' });

  await database.transaction().execute(async trx => {
    // doing this for performance's sake
    const promises: Promise<unknown>[] = [];

    if (input.walletId !== originalTransaction.walletId) {
      // we need to revert the amount of the original wallet
      const originalWallet = (await WalletsRepository.getWalletById(
        input.organizationId,
        originalTransaction.walletId,
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
          trx,
        ),
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
          trx,
        ),
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
          trx,
        ),
      );
    }

    // handle removal of tags
    originalTransaction.tags.forEach(originalTag => {
      if (!tagIds.includes(originalTag.id)) {
        promises.push(
          TransactionTagsRepository.deleteTransactionTag(
            originalTransaction.id,
            originalTag.id,
            trx,
          ),
        );
      }
    });

    // handle addition of tags
    tagIds.forEach(tagId => {
      if (
        !originalTransaction.tags.find(
          originalTag => originalTag.id === tagId,
        )
      ) {
        promises.push(
          TransactionTagsRepository.createTransactionTag(
            {
              tagId,
              transactionId: originalTransaction.id,
            },
            trx,
          ),
        );
      }
    });

    promises.push(
      TransactionsRepository.editTransaction(
        input.organizationId,
        input,
        trx,
      ),
    );

    await allFulfilledOrThrow(promises);
  });
}

async function editTransferOrRepaymentTransaction ({
  tagIds,
  ...input
}: EditTransferOrRepaymentTransactionDto) {
  const [inputWallet, fromWallet, ...tags] = await Promise.all([
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

  if (!inputWallet || !fromWallet || tags.length !== tagIds.length)
    throw new TRPCError({ code: 'BAD_REQUEST' });

  const originalTransaction =
    await TransactionsRepository.getTransactionById(
      input.organizationId,
      input.id,
    );

  if (originalTransaction.transactionType !== input.transactionType)
    throw new TRPCError({ code: 'BAD_REQUEST' });

  await database.transaction().execute(async trx => {
    // doing this for performance's sake
    const promises: Promise<unknown>[] = [];

    // if fromWallet changed
    if (originalTransaction.fromWalletId !== input.fromWalletId) {
      const originalFromWallet =
        (await WalletsRepository.getWalletById(
          input.organizationId,
          originalTransaction.fromWalletId!,
        ))!;

      // we need to revert the previous fromWallet
      promises.push(
        WalletsRepository.updateAmount(
          input.organizationId,
          originalFromWallet.id,
          originalFromWallet.amount + originalTransaction.amount,
          trx,
        ),
      );

      // calculate new amount for the new fromWallet
      promises.push(
        WalletsRepository.updateAmount(
          input.organizationId,
          fromWallet.id,
          fromWallet.amount - input.amount,
          trx,
        ),
      );
    } else {
      // we need to revert the fromWallet amount to prior this transaction
      const revertedFromWalletAmount =
        fromWallet.amount + originalTransaction.amount;

      // then recalculate the new amount
      const newFromWalletAmount =
        revertedFromWalletAmount - input.amount;

      promises.push(
        WalletsRepository.updateAmount(
          input.organizationId,
          fromWallet.id,
          newFromWalletAmount,
          trx,
        ),
      );
    }

    // if inputWallet changed
    if (originalTransaction.walletId !== input.walletId) {
      const originalWallet = (await WalletsRepository.getWalletById(
        input.organizationId,
        originalTransaction.walletId,
      ))!;

      // we need to revert the previous wallet
      promises.push(
        WalletsRepository.updateAmount(
          input.organizationId,
          originalWallet.id,
          originalWallet.amount - originalTransaction.amount,
          trx,
        ),
      );

      // calculate new amount for the new toWallet
      promises.push(
        WalletsRepository.updateAmount(
          input.organizationId,
          inputWallet.id,
          inputWallet.amount + input.amount,
          trx,
        ),
      );
    } else {
      // we need to revert the wallet amount to prior this transaction
      const revertedWalletAmount =
        inputWallet.amount - originalTransaction.amount;

      // then recalculate the new amount
      const newWalletAmount = revertedWalletAmount + input.amount;

      promises.push(
        WalletsRepository.updateAmount(
          input.organizationId,
          inputWallet.id,
          newWalletAmount,
          trx,
        ),
      );
    }

    // handle addition of tags
    tagIds.forEach(tagId => {
      if (
        !originalTransaction.tags.find(
          originalTag => originalTag.id === tagId,
        )
      ) {
        promises.push(
          TransactionTagsRepository.createTransactionTag(
            {
              tagId,
              transactionId: originalTransaction.id,
            },
            trx,
          ),
        );
      }
    });

    promises.push(
      TransactionsRepository.editTransaction(
        input.organizationId,
        input,
        trx,
      ),
    );

    await allFulfilledOrThrow(promises);
  });
}

const editTransactionMutation = verifiedUserProcedure
  .input(editTransactionDto)
  .mutation(({ input }) => {
    switch (input.transactionType) {
      case 'Expense':
      case 'Income':
        return editIncomeOrExpenseTransaction(input);
      case 'Transfer':
      case 'Repayment':
        return editTransferOrRepaymentTransaction(input);
      default:
        throw new TRPCError({ code: 'BAD_REQUEST' });
    }
  });

export default editTransactionMutation;
