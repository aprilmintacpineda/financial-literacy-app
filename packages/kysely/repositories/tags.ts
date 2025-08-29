import {
  type AddTagDto,
  type EditTagDto,
} from '@packages/data-transfer-objects/dtos';
import { createId } from '@paralleldrive/cuid2';
import { database } from '../database';
import { type Tags } from '../database-types';
import { TagModel } from '../models';

function mapResultsToModel (result: Omit<Tags, 'deletedAt'>) {
  return new TagModel({
    id: result.id,
    description: result.description,
    name: result.name,
    organizationId: result.organizationId,
    updatedAt: result.updatedAt,
    createdAt: result.createdAt,
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

    return result.map(mapResultsToModel);
  }

  static async getTagById (id: string) {
    const tag = await database
      .selectFrom('tags')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!tag) return null;

    return mapResultsToModel(tag);
  }

  static async editTag (
    organizationId: string,
    { id, name, description }: EditTagDto,
  ) {
    await database
      .updateTable('tags')
      .set({
        name,
        description,
        updatedAt: new Date(),
      })
      .where(eb =>
        eb.and([
          eb('id', '=', id),
          eb('deletedAt', 'is', null),
          eb('organizationId', '=', organizationId),
        ]),
      )
      .execute();
  }
}
