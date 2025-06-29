import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'transfers')
    .addColumn('id', cuid, col => col.primaryKey())
    .addColumn('organizationId', cuid)
    .addColumn('fromWalletId', cuid)
    .addColumn('toWalletId', cuid)
    .addColumn('description', 'varchar(255)')
    .addColumn('originalAmount', 'bigint')
    .addColumn('transferedAmount', 'bigint')
    .addColumn('exchangeRate', 'bigint')
    .addColumn('transferDate', 'datetime')
    .execute();

  await db.schema
    .createIndex('organizationId_idx')
    .on('transfers')
    .column('organizationId')
    .execute();

  await db.schema
    .createIndex('fromWalletId_idx')
    .on('transfers')
    .column('fromWalletId')
    .execute();

  await db.schema
    .createIndex('toWalletId_idx')
    .on('transfers')
    .column('toWalletId')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('transfers').execute();
}
