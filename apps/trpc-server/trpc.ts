import { initTRPC, TRPCError } from '@trpc/server';
import SuperJSON from 'superjson';
import { type tTRPCContext } from './context';

export const trpc = initTRPC.context<tTRPCContext>().create({
  transformer: SuperJSON,
});

export const publicProcedure = trpc.procedure;

export const protectedProcedure = trpc.procedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    return next({
      ctx: {
        user: ctx.user,
      },
    });
  },
);
