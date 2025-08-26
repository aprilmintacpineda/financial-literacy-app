import { type AddTagDto } from '@packages/data-transfer-objects/dtos';
import { createId } from '@paralleldrive/cuid2';
import { database } from '../database';
import { TagModel } from '../models/tag';

function mapResultsToModel (
  results: {
    createdAt: Date;
    description: string | null;
    id: string;
    name: string;
    organizationId: string;
    updatedAt: Date;
  }[],
) {
  return results.map(result => {
    return new TagModel({
      id: result.id,
      description: result.description,
      name: result.name,
      organizationId: result.organizationId,
      updatedAt: result.updatedAt,
      createdAt: result.createdAt,
    });
  });
}

export class TagsRepository {
  static async createTag ({
    name,
    description,
    organizationId,
  }: AddTagDto) {
    const now = new Date();

    await database
      .insertInto('tags')
      .values({
        id: createId(),
        name,
        description,
        organizationId,
        createdAt: now,
        updatedAt: now,
      })
      .execute();
  }

  static async getAllTags (organizationId: string) {
    const result = await database
      .selectFrom('tags')
      .selectAll()
      .where(eb =>
        eb.and([
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
        ]),
      )
      .execute();

    return mapResultsToModel(result);
  }
}
