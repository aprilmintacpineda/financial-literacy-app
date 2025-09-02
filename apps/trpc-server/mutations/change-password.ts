import { changePasswordDto } from '@packages/data-transfer-objects/dtos';
import { UsersRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { changedPasswordEmail } from '../services/email-notifications';
import { protectedProcedure } from '../trpc';

const changePasswordMutation = protectedProcedure
  .input(changePasswordDto)
  .mutation(async ({ input, ctx }) => {
    if (
      !ctx.user.changePasswordVerificationCode ||
      !ctx.user.changePasswordVerificationCodeCanSentAt ||
      !ctx.user.changePasswordVerificationCodeExpiresAt ||
      ctx.user.changePasswordVerificationCodeExpiresAt <= new Date()
    )
      throw new TRPCError({ code: 'UNPROCESSABLE_CONTENT' });

    if (ctx.user.changePasswordVerificationCodeTries === 3)
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });

    if (ctx.user.changePasswordVerificationCode !== input.code) {
      await UsersRepository.updateUser({
        id: ctx.user.id,
        changePasswordVerificationCodeTries:
          ctx.user.changePasswordVerificationCodeTries + 1,
      });

      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    await UsersRepository.changePassword(
      ctx.user.id,
      input.newPassword
    );

    // let hang intentionally to allow faster response
    changedPasswordEmail({
      to: ctx.user.email,
      name: ctx.user.name,
    });
  });

export default changePasswordMutation;
