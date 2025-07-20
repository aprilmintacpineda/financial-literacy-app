import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { type DB } from './database-types';
import env from './env';

export const database = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool({
      uri: env.DATABASE_URL,
      connectionLimit: 10,
    }),
  }),
  log:
    env.NODE_ENV !== 'production' ? ['query', 'error'] : undefined,
});
