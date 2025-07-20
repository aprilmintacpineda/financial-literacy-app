import { signUpDto } from '@packages/data-transfer-objects';
import { database } from '@packages/kysely';
import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { publicProcedure } from '../trpc';

const signUpMutation = publicProcedure
  .input(signUpDto)
  .mutation(async ({ input: { email, password, name } }) => {
    const user = await database
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();

    if (user) throw new TRPCError({ code: 'CONFLICT' });

    await database.transaction().execute(async trx => {
      const hashedPassword = await bcrypt.hash(password, 12);
      const now = new Date();
      const userId = createId();
      const organizationId = createId();

      await trx
        .insertInto('users')
        .values({
          id: userId,
          email,
          password: hashedPassword,
          name,
          updatedAt: now,
          createdAt: now,
        })
        .execute();

      await trx
        .insertInto('organizations')
        .values({
          id: organizationId,
          name: 'Personal Finance',
          createdAt: now,
          updatedAt: now,
        })
        .execute();

      await trx
        .insertInto('organization_users')
        .values({
          userId,
          organizationId,
          createdAt: now,
          updatedAt: now,
        })
        .execute();
    });
  });

export default signUpMutation;
