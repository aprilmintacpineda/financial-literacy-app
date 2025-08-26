import { editCategoryDto } from '@packages/data-transfer-objects/dtos';
import { CategoriesRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';

const editCategoryMutation = protectedProcedure
  .input(editCategoryDto)
  .mutation(async ({ ctx, input }) => {
    const category = await CategoriesRepository.getCategoryById(
      input.id,
    );

    if (
      !category ||
      !ctx.user.isPartOfOrganization(category.organizationId)
    )
      throw new TRPCError({ code: 'NOT_FOUND' });

    await CategoriesRepository.editCategory(
      category.organizationId,
      input,
    );
  });

export default editCategoryMutation;
