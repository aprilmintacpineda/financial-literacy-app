import { verifyEmailDto } from '@packages/data-transfer-objects/dtos';
import { UsersRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';

const verifyEmailMutation = protectedProcedure
  .input(verifyEmailDto)
  .mutation(async ({ input, ctx }) => {
    if (ctx.user.emailVerifiedAt)
      throw new TRPCError({ code: 'CONFLICT' });

    if (ctx.user.emailVerificationCodeExpiresAt <= new Date())
      throw new TRPCError({ code: 'UNPROCESSABLE_CONTENT' });

    if (ctx.user.emailVerificationCodeTries === 3)
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

    if (ctx.user.emailVerificationCode !== input.code) {
      await UsersRepository.updateUser({
        id: ctx.user.id,
        emailVerificationCodeTries:
          ctx.user.emailVerificationCodeTries + 1,
      });

      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    await UsersRepository.updateUser({
      id: ctx.user.id,
      emailVerifiedAt: new Date(),
    });
  });

export default verifyEmailMutation;
