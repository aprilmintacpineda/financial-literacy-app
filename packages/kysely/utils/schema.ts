import { type Kysely } from 'kysely';

export function createBaseTable(db: Kysely<any>, name: string) {
  return db.schema
    .createTable(name)
    .addColumn('createdAt', 'timestamp', col => col.notNull())
    .addColumn('updatedAt', 'timestamp', col => col.notNull())
    .addColumn('deletedAt', 'timestamp');
}
