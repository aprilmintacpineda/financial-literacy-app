import { signUpDto } from '@packages/data-transfer-objects/dtos';
import { database } from '@packages/kysely';
import {
  OrganizationsRepository,
  OrganizationUsersRepository,
  UsersRepository,
} from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { uniqueId } from '../../../packages/kysely/utils/generators';
import { sendWelcomeEmail } from '../services/email-notifications';
import { publicProcedure } from '../trpc';
import { generateRandomAlphaStr } from '../utils/generators';
import { allFulfilledOrThrow } from '../utils/promise';

const signUpMutation = publicProcedure
  .input(signUpDto)
  .mutation(async ({ input }) => {
    const user = await UsersRepository.getUserByEmail(input.email);
    if (user) throw new TRPCError({ code: 'CONFLICT' });

    const emailVerificationCode = generateRandomAlphaStr(9);

    await database.transaction().execute(async trx => {
      const userId = uniqueId();
      const organizationId = uniqueId();

      await allFulfilledOrThrow([
        UsersRepository.createUser(
          {
            ...input,
            id: userId,
            emailVerificationCode,
          },
          trx,
        ),
        // create default organization
        OrganizationsRepository.createOrganization(
          {
            name: 'Personal Finance',
            description: 'For my personal finance',
            id: organizationId,
          },
          trx,
        ),
        OrganizationUsersRepository.addUserToOrganization(
          {
            organizationId,
            userId,
          },
          trx,
        ),
      ] as Promise<unknown>[]);
    });

    // let hang intentionally to allow faster response
    sendWelcomeEmail({
      emailVerificationCode,
      to: input.email,
      name: input.name,
    });
  });

export default signUpMutation;
