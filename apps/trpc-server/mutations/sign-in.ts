import { signInDto } from '@packages/data-transfer-objects';
import { UsersRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../trpc';
import { createJwt } from '../utils/jwt';

const signInMutation = publicProcedure
  .input(signInDto)
  .mutation(async ({ input: { email, password } }) => {
    const user = await UsersRepository.getUserByEmail(email);

    if (!user || !(await user.isPasswordCorrect(password)))
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    const token = await createJwt(user.id);
    return token;
  });

export default signInMutation;
