import { type Transaction } from 'kysely';
import { database } from '../database';
import { type DB } from '../database-types';

export class TransactionTagsRepository {
  static async createTransactionTag (
    values: {
      transactionId: string;
      tagId: string;
    },
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;
    const now = new Date();

    await connection
      .insertInto('transaction_tags')
      .values({
        ...values,
        createdAt: now,
        updatedAt: now,
      })
      .execute();
  }

  static async deleteTransactionTag (
    transactionId: string,
    tagId: string,
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;

    await connection
      .deleteFrom('transaction_tags')
      .where(eb =>
        eb.and([
          eb('transactionId', '=', transactionId),
          eb('tagId', '=', tagId),
        ]),
      )
      .execute();
  }
}
