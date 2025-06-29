import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid, names } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'wallets')
    .addColumn('id', cuid, col => col.primaryKey())
    .addColumn('organizationId', cuid)
    .addColumn('name', names)
    .addColumn('amount', 'bigint')
    .addColumn('accountType', 'varchar(6)')
    .addColumn('currency', 'varchar(3)')
    .execute();

  await db.schema
    .createIndex('organizationId_idx')
    .on('wallets')
    .column('organizationId')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('wallets').execute();
}
