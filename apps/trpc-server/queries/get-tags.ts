import { TagsRepository } from '@packages/kysely/repositories';
import z from 'zod';
import { verifiedUserProcedure } from '../trpc';

const getTagsQuery = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const tags = await TagsRepository.getAllTags(
      input.organizationId,
    );

    return tags.map(tag => tag.publicData);
  });

export default getTagsQuery;
