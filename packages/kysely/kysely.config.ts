import 'dotenv/config';

import { defineConfig } from 'kysely-ctl';
import { createPool } from 'mysql2';

export default defineConfig({
  dialect: 'mysql2',
  dialectConfig: {
    pool: createPool({
      uri: process.env.DATABASE_URL,
    }),
  },
  migrations: {
    migrationFolder: 'migrations',
  },
  seeds: {
    seedFolder: 'seeds',
  },
});
