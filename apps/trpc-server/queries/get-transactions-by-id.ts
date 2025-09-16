import { TransactionsRepository } from '@packages/kysely/repositories';
import z from 'zod';
import { verifiedUserProcedure } from '../trpc';

const getTransactionByIdQuery = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
      transactionId: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const transaction =
      await TransactionsRepository.getTransactionById(
        input.organizationId,
        input.transactionId,
      );

    return transaction?.publicData || null;
  });

export default getTransactionByIdQuery;
