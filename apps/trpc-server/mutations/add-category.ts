import { addCategoryDto } from '@packages/data-transfer-objects/dtos';
import { CategoriesRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';

const addCategoryMutation = protectedProcedure
  .input(addCategoryDto)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.user.isPartOfOrganization(input.organizationId))
      throw new TRPCError({ code: 'FORBIDDEN' });

    await CategoriesRepository.createCategory(input);
  });

export default addCategoryMutation;
