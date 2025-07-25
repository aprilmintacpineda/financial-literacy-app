import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'transactions')
    .addColumn('id', cuid, col => col.primaryKey().notNull())
    .addColumn('organizationId', cuid, col => col.notNull())
    .addColumn('walletId', cuid, col => col.notNull())
    .addColumn('categoryId', cuid, col => col.notNull())
    .addColumn('description', 'varchar(255)')
    .addColumn('amount', 'bigint', col => col.notNull())
    .addColumn('transactionDate', 'date', col => col.notNull())
    .addColumn('transactionType', 'varchar(7)', col => col.notNull())
    .addColumn('currency', 'varchar(3)', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('organizationId_idx')
    .on('transactions')
    .column('organizationId')
    .execute();

  await db.schema
    .createIndex('walletId_idx')
    .on('transactions')
    .column('walletId')
    .execute();

  await db.schema
    .createIndex('categoryId_idx')
    .on('transactions')
    .column('categoryId')
    .execute();

  await db.schema
    .createIndex('transactionDate_idx')
    .on('transactions')
    .column('transactionDate')
    .execute();

  await db.schema
    .createIndex('transactionType_idx')
    .on('transactions')
    .column('transactionType')
    .execute();

  await db.schema
    .createIndex('currency_idx')
    .on('transactions')
    .column('currency')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('transactions').execute();
}
