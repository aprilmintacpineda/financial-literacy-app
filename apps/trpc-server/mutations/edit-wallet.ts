import { editWalletDto } from '@packages/data-transfer-objects/dtos';
import { WalletsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { verifiedUserProcedure } from '../trpc';

const editWalletMutation = verifiedUserProcedure
  .input(editWalletDto)
  .mutation(async ({ ctx, input }) => {
    const wallet = await WalletsRepository.getWalletById(input.id);

    if (
      !wallet ||
      !ctx.user.isPartOfOrganization(wallet.organizationId)
    )
      throw new TRPCError({ code: 'NOT_FOUND' });

    await WalletsRepository.editWallet(wallet.organizationId, input);
  });

export default editWalletMutation;
