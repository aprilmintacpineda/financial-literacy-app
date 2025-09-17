import { database } from '@packages/kysely';
import {
  TransactionsRepository,
  WalletsRepository,
} from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { verifiedUserProcedure } from '../trpc';
import { allFulfilledOrThrow } from '../utils/promise';

const deleteTransactionMutation = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string().nonempty(),
      transactionId: z.string().nonempty(),
    }),
  )
  .mutation(async ({ input: { organizationId, transactionId } }) => {
    const transaction =
      await TransactionsRepository.getTransactionById(
        organizationId,
        transactionId,
      );

    if (!transaction) throw new TRPCError({ code: 'NOT_FOUND' });

    await database.transaction().execute(async trx => {
      const [wallet, fromWallet] = await Promise.all([
        WalletsRepository.getWalletById(
          organizationId,
          transaction.walletId,
        ),
        transaction.fromWalletId
          ? WalletsRepository.getWalletById(
              organizationId,
              transaction.fromWalletId,
            )
          : null,
      ]);

      await allFulfilledOrThrow([
        WalletsRepository.updateAmount(
          organizationId,
          wallet!.id,
          transaction.transactionType === 'Expense'
            ? wallet!.amount + transaction.amount
            : wallet!.amount - transaction.amount,
        ),
        fromWallet
          ? WalletsRepository.updateAmount(
              organizationId,
              fromWallet.id,
              fromWallet.amount + transaction.amount,
            )
          : Promise.resolve(),
        TransactionsRepository.deleteTransaction(
          organizationId,
          transaction.id,
          trx,
        ),
      ] as Promise<unknown>[]);
    });
  });

export default deleteTransactionMutation;
