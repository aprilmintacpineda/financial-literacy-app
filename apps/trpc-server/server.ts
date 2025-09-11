import 'dotenv/config';

import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { createTRPCContext } from './context';
import { appRouter } from './router';
import { type tAppRouter } from './types/trpc';

async function main () {
  const server = fastify();

  server.get('/', async function handler () {
    return { hello: 'world' };
  });

  server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: createTRPCContext,
      onError ({ path, error }) {
        // @todo report errors to sentry
        console.error(
          `Error in tRPC handler on path '${path}':`,
          error,
        );
      },
    } satisfies FastifyTRPCPluginOptions<tAppRouter>['trpcOptions'],
  });

  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
