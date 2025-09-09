import { Kysely, MysqlDialect } from 'kysely';
import { createPool } from 'mysql2';
import { type DB } from './database-types';
import env from './env';
import { RequireWhereOnDeletePlugin } from './plugins/require-where-on-delete';
import { RequireWhereOnUpdatePlugin } from './plugins/require-where-on-update';

export const database = new Kysely<DB>({
  dialect: new MysqlDialect({
    pool: createPool({
      uri: env.DATABASE_URL,
      connectionLimit: 10,
      timezone: 'Z',
    }),
  }),
  log:
    env.NODE_ENV !== 'production' ? ['query', 'error'] : undefined,
})
  .withPlugin(new RequireWhereOnUpdatePlugin())
  .withPlugin(new RequireWhereOnDeletePlugin());
