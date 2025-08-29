import { WalletsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { verifiedUserProcedure } from '../trpc';

const getWalletsQuery = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ input: { organizationId }, ctx }) => {
    if (!ctx.user.isPartOfOrganization(organizationId))
      throw new TRPCError({ code: 'FORBIDDEN' });

    const wallets =
      await WalletsRepository.getAllWallets(organizationId);

    return wallets.map(wallet => wallet.publicData);
  });

export default getWalletsQuery;
