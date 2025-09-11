import { editWalletDto } from '@packages/data-transfer-objects/dtos';
import { WalletsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { verifiedUserProcedure } from '../trpc';

const editWalletMutation = verifiedUserProcedure
  .input(editWalletDto)
  .mutation(async ({ input }) => {
    const wallet = await WalletsRepository.getWalletById(
      input.organizationId,
      input.id,
    );

    if (!wallet) throw new TRPCError({ code: 'NOT_FOUND' });

    await WalletsRepository.editWallet(wallet.organizationId, input);
  });

export default editWalletMutation;
