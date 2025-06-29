import { type Kysely } from 'kysely';

export function createBaseTable (db: Kysely<any>, name: string) {
  return db.schema
    .createTable(name)
    .addColumn('createdAt', 'timestamp')
    .addColumn('updatedAt', 'timestamp')
    .addColumn('deletedAt', 'timestamp');
}
