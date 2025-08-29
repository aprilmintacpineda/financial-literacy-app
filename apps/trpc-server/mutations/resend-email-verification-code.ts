import { UsersRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { resendEmailVerificationCode } from '../services/email-notifications';
import { protectedProcedure } from '../trpc';
import { generateRandomAlphaStr } from '../utils/generators';
import {
  getEmailVerificationCodeCanSentAt,
  getEmailVerificationCodeExpiresAt,
} from '../utils/time';

const resendEmailVerificationMutation = protectedProcedure.mutation(
  async ({ ctx }) => {
    if (ctx.user.emailVerificationCodeCanSentAt >= new Date())
      throw new TRPCError({ code: 'CONFLICT' });

    const emailVerificationCode = generateRandomAlphaStr(9);

    await UsersRepository.updateUser({
      id: ctx.user.id,
      emailVerificationCode,
      emailVerificationCodeTries: 0,
      emailVerificationCodeCanSentAt:
        getEmailVerificationCodeCanSentAt(),
      emailVerificationCodeExpiresAt:
        getEmailVerificationCodeExpiresAt(),
    });

    // let hang intentionally to allow faster response
    resendEmailVerificationCode({
      emailVerificationCode,
      to: ctx.user.email,
      name: ctx.user.name,
    });
  }
);

export default resendEmailVerificationMutation;
