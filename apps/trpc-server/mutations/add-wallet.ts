import { addWalletDto } from '@packages/data-transfer-objects/dtos';
import { WalletsRepository } from '@packages/kysely/repositories';
import { verifiedUserProcedure } from '../trpc';

const addWalletMutation = verifiedUserProcedure
  .input(addWalletDto)
  .mutation(async ({ input }) => {
    await WalletsRepository.createWallet(input);
  });

export default addWalletMutation;
