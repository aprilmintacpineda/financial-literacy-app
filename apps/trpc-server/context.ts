import { database } from '@packages/kysely';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { type Users } from '../../packages/kysely/models';
import { verifyJwt } from './utils/jwt';

export async function createTRPCContext ({
  req,
}: CreateFastifyContextOptions) {
  let user: Users | null = null;

  try {
    const authorization = req.headers['authorization'];

    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      const id = await verifyJwt(token);

      user = await database
        .selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow();
    }
  } catch (_error) {
    console.log(_error);
    // @todo maybe log to sentry?
  }

  return {
    user,
  };
}

export type tTRPCContext = Awaited<
  ReturnType<typeof createTRPCContext>
>;
