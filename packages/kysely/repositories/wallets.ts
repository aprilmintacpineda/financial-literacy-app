import {
  type AddWalletDto,
  type EditWalletDto,
} from '@packages/data-transfer-objects/dtos';
import {
  type CurrencyCode,
  type SupportedWalletType,
} from '@packages/data-transfer-objects/enums';
import { createId } from '@paralleldrive/cuid2';
import { database } from '../database';
import { WalletModel } from '../models/wallet';

function mapResultToModel (result: {
  id: string;
  amount: number;
  name: string;
  organizationId: string;
  walletType: SupportedWalletType;
  currency: CurrencyCode;
  updatedAt: Date;
  createdAt: Date;
}) {
  return new WalletModel({
    id: result.id,
    amount: result.amount,
    name: result.name,
    organizationId: result.organizationId,
    walletType: result.walletType,
    currency: result.currency,
    updatedAt: result.updatedAt,
    createdAt: result.createdAt,
  });
}

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

  static async getAllWallets (organizationId: string) {
    const wallets = await database
      .selectFrom('wallets')
      .selectAll()
      .where(eb =>
        eb.and([
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
        ]),
      )
      .execute();

    return wallets.map(mapResultToModel);
  }

  static async getWalletById (id: string) {
    const wallet = await database
      .selectFrom('wallets')
      .selectAll()
      .where(eb =>
        eb.and([eb('id', '=', id), eb('deletedAt', 'is', null)]),
      )
      .executeTakeFirst();

    if (!wallet) return null;

    return mapResultToModel(wallet);
  }

  static async editWallet (
    organizationId: string,
    { id, name }: EditWalletDto,
  ) {
    await database
      .updateTable('wallets')
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eb =>
        eb.and([
          eb('id', '=', id),
          eb('organizationId', '=', organizationId),
        ]),
      )
      .execute();
  }
}
