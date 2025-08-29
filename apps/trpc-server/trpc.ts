import { initTRPC, TRPCError } from '@trpc/server';
import SuperJSON from 'superjson';
import z from 'zod';
import { type tTRPCContext } from './context';

export const trpc = initTRPC.context<tTRPCContext>().create({
  transformer: SuperJSON,
});

export const publicProcedure = trpc.procedure;

export const protectedProcedure = trpc.procedure
  .input(
    z
      .object({
        organizationId: z.string().optional(),
      })
      .optional()
  )
  .use(async ({ ctx, input, next }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

    if (
      input?.organizationId &&
      !ctx.user.isPartOfOrganization(input.organizationId)
    )
      throw new TRPCError({ code: 'FORBIDDEN' });

    return next({
      ctx: {
        user: ctx.user,
      },
    });
  });

export const verifiedUserProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user.emailVerifiedAt)
      throw new TRPCError({ code: 'FORBIDDEN' });

    return next({
      ctx: {
        user: ctx.user,
      },
    });
  }
);
