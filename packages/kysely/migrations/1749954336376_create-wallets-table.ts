import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid, names } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'wallets')
    .addColumn('id', cuid, col => col.primaryKey().notNull())
    .addColumn('organizationId', cuid, col => col.notNull())
    .addColumn('name', names, col => col.notNull())
    .addColumn('amount', 'bigint', col => col.notNull())
    .addColumn('walletType', 'varchar(6)', col => col.notNull())
    .addColumn('currency', 'varchar(3)', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('organizationId_idx')
    .on('wallets')
    .column('organizationId')
    .execute();

  await db.schema
    .createIndex('walletType_idx')
    .on('wallets')
    .column('walletType')
    .execute();

  await db.schema
    .createIndex('currency_idx')
    .on('wallets')
    .column('currency')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('wallets').execute();
}
