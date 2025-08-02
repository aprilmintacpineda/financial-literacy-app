import { type AddWalletDto } from '@packages/data-transfer-objects/dtos';
import { createId } from '@paralleldrive/cuid2';
import { database } from '../database';

export class WalletsRepository {
  static async createWallet ({
    initialAmount,
    name,
    organizationId,
    walletType,
    currency,
  }: AddWalletDto) {
    const now = new Date();

    await database
      .insertInto('wallets')
      .values({
        id: createId(),
        name,
        amount: initialAmount,
        organizationId,
        walletType,
        currency,
        createdAt: now,
        updatedAt: now,
      })
      .execute();
  }
}
