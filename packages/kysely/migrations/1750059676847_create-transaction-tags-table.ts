import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'transaction_tags')
    .addColumn('tagId', cuid, col => col.notNull())
    .addColumn('transactionId', cuid, col => col.notNull())
    .addPrimaryKeyConstraint('transactionTags', [
      'tagId',
      'transactionId',
    ])
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('transaction_tags').execute();
}
