import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import env from './env';
import { type DB } from './models';

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
