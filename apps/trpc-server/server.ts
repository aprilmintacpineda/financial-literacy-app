import 'dotenv/config';

import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { type tAppRouter } from './app-router';
import { createTRPCContext } from './context';
import { appRouter } from './router';

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
    await server.listen({ port: 3000 });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

main();
