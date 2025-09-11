import { editTagDto } from '@packages/data-transfer-objects/dtos';
import { TagsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import { verifiedUserProcedure } from '../trpc';

const editTagMutation = verifiedUserProcedure
  .input(editTagDto)
  .mutation(async ({ input }) => {
    const tag = await TagsRepository.getTagById(
      input.organizationId,
      input.id,
    );

    if (!tag) throw new TRPCError({ code: 'NOT_FOUND' });

    await TagsRepository.editTag(tag.organizationId, input);
  });

export default editTagMutation;
