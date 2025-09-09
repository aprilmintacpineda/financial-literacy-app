import { addTagDto } from '@packages/data-transfer-objects/dtos';
import { TagsRepository } from '@packages/kysely/repositories';
import { verifiedUserProcedure } from '../trpc';

const addTagMutation = verifiedUserProcedure
  .input(addTagDto)
  .mutation(async ({ input }) => {
    await TagsRepository.createTag(input);
  });

export default addTagMutation;
