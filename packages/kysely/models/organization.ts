import { type Organizations } from '../database-types';

export class OrganizationModel {
  private data: Omit<Organizations, 'deletedAt'>;

  constructor (organization: Omit<Organizations, 'deletedAt'>) {
    this.data = organization;
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

  get createdAt () {
    return this.data.createdAt;
  }

  get updatedAt () {
    return this.data.updatedAt;
  }
}
