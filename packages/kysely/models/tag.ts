import { type Tags } from '../database-types';

export class TagModel implements Omit<Tags, 'deletedAt'> {
  private data: Omit<Tags, 'deletedAt'>;

  constructor (tag: Omit<Tags, 'deletedAt'>) {
    this.data = {
      ...tag,
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
