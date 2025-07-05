import 'dotenv/config';

import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { createTRPCContext } from './context';
import { appRouter, type tAppRouter } from './router';

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
      // @todo report errors to sentry
      // onError({ path, error }) {
      //   console.error(`Error in tRPC handler on path '${path}':`, error);
      // },
    } satisfies FastifyTRPCPluginOptions<tAppRouter>['trpcOptions'],
  });

  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
