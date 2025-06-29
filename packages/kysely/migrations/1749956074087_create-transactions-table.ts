import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'transactions')
    .addColumn('id', cuid, col => col.primaryKey())
    .addColumn('organizationId', cuid)
    .addColumn('categoryId', cuid)
    .addColumn('description', 'varchar(255)')
    .addColumn('amount', 'bigint')
    .addColumn('transactionDate', 'datetime')
    .addColumn('transactionType', 'varchar(7)')
    .addColumn('currency', 'varchar(3)')
    .execute();

  await db.schema
    .createIndex('organizationId_idx')
    .on('transactions')
    .column('organizationId')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('transactions').execute();
}
