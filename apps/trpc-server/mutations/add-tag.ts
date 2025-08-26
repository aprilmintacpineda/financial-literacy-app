import { addTagDto } from '@packages/data-transfer-objects/dtos';
import { TagsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { protectedProcedure } from '../trpc';

const addTagMutation = protectedProcedure
  .input(addTagDto)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.user.isPartOfOrganization(input.organizationId))
      throw new TRPCError({ code: 'FORBIDDEN' });

    await TagsRepository.createTag(input);
  });

export default addTagMutation;
