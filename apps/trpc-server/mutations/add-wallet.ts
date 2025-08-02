import { addWalletDto } from '@packages/data-transfer-objects/dtos';
import { WalletsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';

const addWallet = protectedProcedure
  .input(addWalletDto)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.user.isPartOfOrganization(input.organizationId))
      throw new TRPCError({ code: 'FORBIDDEN' });

    await WalletsRepository.createWallet(input);
  });

export default addWallet;
