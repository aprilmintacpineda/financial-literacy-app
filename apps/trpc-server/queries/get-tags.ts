import { TagsRepository } from '@packages/kysely/repositories';
import { TRPCError } from '@trpc/server';
import z from 'zod';
import { verifiedUserProcedure } from '../trpc';

const getTagsQuery = verifiedUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ input: { organizationId }, ctx }) => {
    if (!ctx.user.isPartOfOrganization(organizationId))
      throw new TRPCError({ code: 'FORBIDDEN' });

    const tags = await TagsRepository.getAllTags(organizationId);

    return tags.map(tag => tag.publicData);
  });

export default getTagsQuery;
