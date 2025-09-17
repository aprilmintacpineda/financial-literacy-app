import type { Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid, names, shortDescription } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up (db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'organizations')
    .addColumn('id', cuid, col => col.primaryKey().notNull())
    .addColumn('name', names, col => col.notNull())
    .addColumn('description', shortDescription)
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down (db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('organizations').execute();
}
