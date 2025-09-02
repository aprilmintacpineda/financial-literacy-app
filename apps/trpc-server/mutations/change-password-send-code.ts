import { UsersRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { sendChangePasswordVerificationEmail } from '../services/email-notifications';
import { protectedProcedure } from '../trpc';
import { generateRandomAlphaStr } from '../utils/generators';
import {
  getChangePasswordVerificationCodeCanSentAt,
  getChangePasswordVerificationCodeExpiresAt,
} from '../utils/time';

const changePasswordSendVerificationCodeMutation =
  protectedProcedure.mutation(async ({ ctx }) => {
    if (
      ctx.user.changePasswordVerificationCodeCanSentAt &&
      ctx.user.changePasswordVerificationCodeCanSentAt >= new Date()
    )
      throw new TRPCError({ code: 'CONFLICT' });

    const changePasswordVerificationCode = generateRandomAlphaStr(9);

    await UsersRepository.updateUser({
      id: ctx.user.id,
      changePasswordVerificationCode,
      changePasswordVerificationCodeTries: 0,
      changePasswordVerificationCodeCanSentAt:
        getChangePasswordVerificationCodeCanSentAt(),
      changePasswordVerificationCodeExpiresAt:
        getChangePasswordVerificationCodeExpiresAt(),
    });

    // let hang intentionally to allow faster response
    sendChangePasswordVerificationEmail({
      to: ctx.user.email,
      name: ctx.user.name,
      changePasswordVerificationCode,
    });
  });

export default changePasswordSendVerificationCodeMutation;
