import { editCategoryDto } from '@packages/data-transfer-objects/dtos';
import { TagsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';

const editTagMutation = protectedProcedure
  .input(editCategoryDto)
  .mutation(async ({ ctx, input }) => {
    const tag = await TagsRepository.getTagById(input.id);

    if (!tag || !ctx.user.isPartOfOrganization(tag.organizationId))
      throw new TRPCError({ code: 'NOT_FOUND' });

    await TagsRepository.editTag(tag.organizationId, input);
  });

export default editTagMutation;
