import {
  type AddWalletDto,
  type EditWalletDto,
} from '@packages/data-transfer-objects/dtos';
import { type Transaction } from 'kysely';
import { database } from '../database';
import { type DB, type Wallets } from '../database-types';
import { WalletModel } from '../models';
import { omit } from '../utils/data-manipulation';
import { uniqueId } from '../utils/generators';

function mapResultToModel(result: Wallets) {
  const walletData = omit(result, ['deletedAt']);
  return new WalletModel(walletData);
}

export class WalletsRepository {
  static async createWallet(
    values: AddWalletDto,
    trx?: Transaction<DB>
  ) {
    const connection = trx ?? database;
    const now = new Date();
    const id = uniqueId();

    await connection
      .insertInto('wallets')
      .values({
        ...values,
        id,
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    return id;
  }

  static async getAllWallets(organizationId: string) {
    const wallets = await database
      .selectFrom('wallets')
      .selectAll()
      .where(eb =>
        eb.and([
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
        ])
      )
      .execute();

    return wallets.map(mapResultToModel);
  }

  static async getWalletById(organizationId: string, id: string) {
    const wallet = await database
      .selectFrom('wallets')
      .selectAll()
      .where(eb =>
        eb.and([
          eb('id', '=', id),
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
        ])
      )
      .executeTakeFirst();

    if (!wallet) return null;

    return mapResultToModel(wallet);
  }

  static async editWallet(
    organizationId: string,
    { id, ...values }: EditWalletDto,
    trx?: Transaction<DB>
  ) {
    const connection = trx ?? database;

    await connection
      .updateTable('wallets')
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eb =>
        eb.and([
          eb('id', '=', id),
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
        ])
      )
      .execute();
  }

  static async updateAmount(
    organizationId: string,
    id: string,
    amount: number,
    trx?: Transaction<DB>
  ) {
    const connection = trx ?? database;

    await connection
      .updateTable('wallets')
      .set({
        amount,
        updatedAt: new Date(),
      })
      .where(eb =>
        eb.and([
          eb('organizationId', '=', organizationId),
          eb('id', '=', id),
          eb('deletedAt', 'is', null),
        ])
      )
      .execute();
  }
}
