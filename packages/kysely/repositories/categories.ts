import {
  type AddCategoryDto,
  type EditCategoryDto,
} from '@packages/data-transfer-objects/dtos';
import { createId } from '@paralleldrive/cuid2';
import { database } from '../database';
import { type Categories } from '../database-types';
import { CategoryModel } from '../models';

function mapResultsToModel (result: Omit<Categories, 'deletedAt'>) {
  return new CategoryModel({
    id: result.id,
    description: result.description,
    name: result.name,
    organizationId: result.organizationId,
    updatedAt: result.updatedAt,
    createdAt: result.createdAt,
  });
}

export class CategoriesRepository {
  static async createCategory ({
    name,
    description,
    organizationId,
  }: AddCategoryDto) {
    const now = new Date();

    await database
      .insertInto('categories')
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

  static async editCategory (
    organizationId: string,
    { id, name, description }: EditCategoryDto,
  ) {
    await database
      .updateTable('categories')
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

  static async getCategoryById (id: string) {
    const category = await database
      .selectFrom('categories')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!category) return null;

    return mapResultsToModel(category);
  }
}
