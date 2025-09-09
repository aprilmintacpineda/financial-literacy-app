import { TransactionsRepository } from '@packages/kysely/repositories';
import z from 'zod';
import { verifiedUserProcedure } from '../trpc';

const getTransactionsQuery = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const transactions =
      await TransactionsRepository.getAllTransactions(
        input.organizationId
      );

    return transactions.map(transaction => transaction.publicData);
  });

export default getTransactionsQuery;
