import { addWalletDto } from '@packages/data-transfer-objects/dtos';
import { WalletsRepository } from '@packages/kysely/repositories';
import { floatToInt } from '../../../packages/kysely/utils/numbers';
import { verifiedUserProcedure } from '../trpc';

const addWalletMutation = verifiedUserProcedure
  .input(addWalletDto)
  .mutation(async ({ input: { amount, ...input } }) => {
    await WalletsRepository.createWallet({
      ...input,
      amount: floatToInt(amount),
    });
  });

export default addWalletMutation;
