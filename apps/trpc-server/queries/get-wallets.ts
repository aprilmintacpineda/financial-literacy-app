import { WalletsRepository } from '@packages/kysely/repositories';
import z from 'zod';
import { verifiedUserProcedure } from '../trpc';

const getWalletsQuery = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const wallets = await WalletsRepository.getAllWallets(
      input.organizationId
    );

    return wallets.map(wallet => wallet.publicData);
  });

export default getWalletsQuery;
