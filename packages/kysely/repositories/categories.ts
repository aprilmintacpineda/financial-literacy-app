import { type AddCategoryDto } from '@packages/data-transfer-objects/dtos';
import { createId } from '@paralleldrive/cuid2';
import { database } from '../database';
import { CategoryModel } from '../models/category';

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
    return new CategoryModel({
      id: result.id,
      description: result.description,
      name: result.name,
      organizationId: result.organizationId,
      updatedAt: result.updatedAt,
      createdAt: result.createdAt,
    });
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

    return mapResultsToModel(result);
  }
}
