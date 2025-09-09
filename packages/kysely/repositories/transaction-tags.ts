import { type Transaction } from 'kysely';
import { database } from '../database';
import { type DB } from '../database-types';

export class TransactionTagsRepository {
  static async createTransactionTag(
    values: {
      transactionId: string;
      tagId: string;
    },
    trx?: Transaction<DB>
  ) {
    const connect = trx ?? database;
    const now = new Date();

    await connect
      .insertInto('transaction_tags')
      .values({
        ...values,
        createdAt: now,
        updatedAt: now,
      })
      .execute();
  }
}
