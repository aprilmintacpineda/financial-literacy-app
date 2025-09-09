import {
  type AddTagDto,
  type EditTagDto,
} from '@packages/data-transfer-objects/dtos';
import { type Transaction } from 'kysely';
import { database } from '../database';
import { type DB, type Tags } from '../database-types';
import { TagModel } from '../models';
import { omit } from '../utils/data-manipulation';
import { uniqueId } from '../utils/generators';

function mapResultsToModel(result: Tags) {
  const tagData = omit(result, ['deletedAt']);
  return new TagModel(tagData);
}

export class TagsRepository {
  static async createTag(values: AddTagDto, trx?: Transaction<DB>) {
    const connect = trx ?? database;
    const now = new Date();
    const id = uniqueId();

    await connect
      .insertInto('tags')
      .values({
        ...values,
        id,
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    return id;
  }

  static async getAllTags(organizationId: string) {
    const result = await database
      .selectFrom('tags')
      .selectAll()
      .where(eb =>
        eb.and([
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
        ])
      )
      .execute();

    return result.map(mapResultsToModel);
  }

  static async getTagById(organizationId: string, id: string) {
    const tag = await database
      .selectFrom('tags')
      .selectAll()
      .where(eb =>
        eb.and([
          eb('id', '=', id),
          eb('deletedAt', 'is', null),
          eb('organizationId', '=', organizationId),
        ])
      )
      .executeTakeFirst();

    if (!tag) return null;

    return mapResultsToModel(tag);
  }

  static async editTag(
    organizationId: string,
    { id, ...values }: EditTagDto,
    trx?: Transaction<DB>
  ) {
    const connect = trx ?? database;

    await connect
      .updateTable('tags')
      .set({
        ...values,
        updatedAt: new Date(),
      })
      .where(eb =>
        eb.and([
          eb('id', '=', id),
          eb('deletedAt', 'is', null),
          eb('organizationId', '=', organizationId),
        ])
      )
      .execute();
  }
}
