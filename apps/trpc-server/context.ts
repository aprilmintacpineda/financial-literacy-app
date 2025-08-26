import { type UserModel } from '@packages/kysely/models';
import { UsersRepository } from '@packages/kysely/repositories';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { verifyJwt } from './utils/jwt';

export async function createTRPCContext ({
  req,
}: CreateFastifyContextOptions) {
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });

  let user: UserModel | null = null;

  try {
    const authorization = req.headers['authorization'];

    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      const id = await verifyJwt(token);
      user = await UsersRepository.getUserById(id);
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
