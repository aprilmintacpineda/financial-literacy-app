import { database } from '@packages/kysely';
import { trpc } from '../trpc';

const listUsersQuery = trpc.procedure.query(async () => {
  const users = await database
    .selectFrom('users')
    .selectAll()
    .execute();

  return users;
});

export default listUsersQuery;
