import { CategoriesRepository } from '@packages/kysely/repositories';
import z from 'zod';
import { verifiedUserProcedure } from '../trpc';

const getCategoriesQuery = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ input }) => {
    const categories = await CategoriesRepository.getAllCategories(
      input.organizationId
    );

    return categories.map(category => category.publicData);
  });

export default getCategoriesQuery;
