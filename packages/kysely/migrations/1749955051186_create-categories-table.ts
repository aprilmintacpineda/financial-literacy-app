import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid, names } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'categories')
    .addColumn('id', cuid, col => col.primaryKey())
    .addColumn('organizationId', cuid)
    .addColumn('name', names)
    .addColumn('description', 'varchar(255)')
    .execute();

  await db.schema
    .createIndex('organizationId_idx')
    .on('categories')
    .column('organizationId')
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('categories').execute();
}
