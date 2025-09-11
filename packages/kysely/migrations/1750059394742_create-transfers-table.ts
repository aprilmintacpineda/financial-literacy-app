import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'transfers')
    .addColumn('id', cuid, col => col.primaryKey().notNull())
    .addColumn('organizationId', cuid, col => col.notNull())
    .addColumn('fromWalletId', cuid, col => col.notNull())
    .addColumn('toWalletId', cuid, col => col.notNull())
    .addColumn('description', 'varchar(255)', col => col.notNull())
    .addColumn('originalAmount', 'bigint', col => col.notNull())
    .addColumn('transferedAmount', 'bigint', col => col.notNull())
    .addColumn('exchangeRate', 'bigint', col => col.notNull())
    .addColumn('transferDate', 'timestamp', col => col.notNull())
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

  await db.schema
    .createIndex('transferDate_idx')
    .on('transfers')
    .column('transferDate')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('transfers').execute();
}
