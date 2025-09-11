import { editCategoryDto } from '@packages/data-transfer-objects/dtos';
import { CategoriesRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { verifiedUserProcedure } from '../trpc';

const editCategoryMutation = verifiedUserProcedure
  .input(editCategoryDto)
  .mutation(async ({ input }) => {
    const category = await CategoriesRepository.getCategoryById(
      input.organizationId,
      input.id,
    );

    if (!category) throw new TRPCError({ code: 'NOT_FOUND' });

    await CategoriesRepository.editCategory(
      category.organizationId,
      input,
    );
  });

export default editCategoryMutation;
