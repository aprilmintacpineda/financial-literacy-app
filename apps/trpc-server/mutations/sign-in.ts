import { signInDto } from '@packages/data-transfer-objects';
import { database } from '@packages/kysely';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { publicProcedure } from '../trpc';
import { createJwt } from '../utils/jwt';

const signInMutation = publicProcedure
  .input(signInDto)
  .mutation(async ({ input: { email, password } }) => {
    const user = await database
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new TRPCError({ code: 'UNAUTHORIZED' });

    const token = await createJwt(user.id);
    return token;
  });

export default signInMutation;
