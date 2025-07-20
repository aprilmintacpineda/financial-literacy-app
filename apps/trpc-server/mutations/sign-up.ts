import { signUpDto } from '@packages/data-transfer-objects';
import { UsersRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../trpc';

const signUpMutation = publicProcedure
  .input(signUpDto)
  .mutation(async ({ input }) => {
    const user = await UsersRepository.getUserByEmail(input.email);
    if (user) throw new TRPCError({ code: 'CONFLICT' });
    await UsersRepository.createUser(input);
  });

export default signUpMutation;
