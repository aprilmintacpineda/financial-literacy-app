import { signUpDto } from '@packages/data-transfer-objects/dtos';
import { UsersRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { sendWelcomeEmail } from '../services/email-notifications';
import { publicProcedure } from '../trpc';
import { generateRandomAlphaStr } from '../utils/generators';

const signUpMutation = publicProcedure
  .input(signUpDto)
  .mutation(async ({ input }) => {
    const user = await UsersRepository.getUserByEmail(input.email);
    if (user) throw new TRPCError({ code: 'CONFLICT' });

    const emailVerificationCode = generateRandomAlphaStr(9);

    await UsersRepository.createUser({
      ...input,
      emailVerificationCode,
    });

    // let hang intentionally to allow faster response
    sendWelcomeEmail({
      emailVerificationCode,
      to: input.email,
      name: input.name,
    });
  });

export default signUpMutation;
