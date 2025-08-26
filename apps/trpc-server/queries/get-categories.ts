import { CategoriesRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { protectedProcedure } from '../trpc';

const getCategoriesQuery = protectedProcedure
  .input(
    z.object({
      organizationId: z.string(),
    }),
  )
  .query(async ({ input: { organizationId }, ctx }) => {
    if (!ctx.user.isPartOfOrganization(organizationId))
      throw new TRPCError({ code: 'FORBIDDEN' });

    const categories =
      await CategoriesRepository.getAllCategories(organizationId);

    return categories.map(category => category.publicData);
  });

export default getCategoriesQuery;
