import {
  type AddCategoryDto,
  type EditCategoryDto,
} from '@packages/data-transfer-objects/dtos';
import { type Transaction } from 'kysely';
import { database } from '../database';
import { type Categories, type DB } from '../database-types';
import { CategoryModel } from '../models';
import { omit } from '../utils/data-manipulation';
import { uniqueId } from '../utils/generators';

function mapResultsToModel (result: Categories) {
  return new CategoryModel(omit(result, ['deletedAt']));
}

export class CategoriesRepository {
  static async createCategory (
    values: AddCategoryDto,
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;
    const now = new Date();
    const id = uniqueId();

    await connection
      .insertInto('categories')
      .values({
        ...values,
        id,
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    return id;
  }

  static async editCategory (
    organizationId: string,
    { id, ...values }: EditCategoryDto,
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;

    await connection
      .updateTable('categories')
      .set({
        ...values,
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

  static async getAllCategories (organizationId: string) {
    const result = await database
      .selectFrom('categories')
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

  static async getCategoryById (organizationId: string, id: string) {
    const category = await database
      .selectFrom('categories')
      .selectAll()
      .where(eb =>
        eb.and([
          eb('id', '=', id),
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
        ]),
      )
      .executeTakeFirst();

    if (!category) return null;

    return mapResultsToModel(category);
  }
}
