import { addCategoryDto } from '@packages/data-transfer-objects/dtos';
import { CategoriesRepository } from '@packages/kysely/repositories';
import { verifiedUserProcedure } from '../trpc';

const addCategoryMutation = verifiedUserProcedure
  .input(addCategoryDto)
  .mutation(async ({ input }) => {
    await CategoriesRepository.createCategory(input);
  });

export default addCategoryMutation;
