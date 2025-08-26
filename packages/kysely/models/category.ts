import { type Categories } from '../database-types';

export class CategoryModel implements Omit<Categories, 'deletedAt'> {
  private data: Omit<Categories, 'deletedAt'>;

  constructor (category: Omit<Categories, 'deletedAt'>) {
    this.data = {
      ...category,
    };
  }

  get publicData () {
    return this.data;
  }

  get id () {
    return this.data.id;
  }

  get name () {
    return this.data.name;
  }

  get description () {
    return this.data.description;
  }

  get createdAt () {
    return this.data.createdAt;
  }

  get organizationId () {
    return this.data.organizationId;
  }

  get updatedAt () {
    return this.data.updatedAt;
  }
}
