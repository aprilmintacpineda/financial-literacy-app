import bcrypt from 'bcrypt';
import { type Organizations, type Users } from '../database-types';
import { OrganizationModel } from './organization';

export class UserModel implements Omit<Users, 'deletedAt'> {
  private data: Omit<Users, 'deletedAt'> & {
    organizations: OrganizationModel[];
  };

  constructor (
    user: Omit<Users, 'deletedAt'>,
    organizations: Omit<Organizations, 'deletedAt'>[],
  ) {
    this.data = {
      ...user,
      organizations: organizations.map(
        organization => new OrganizationModel(organization),
      ),
    };
  }

  isPasswordCorrect (password: string) {
    return bcrypt.compare(password, this.data.password);
  }

  isPartOfOrganization (organizationId: string) {
    return this.data.organizations.some(
      organization => organization.id === organizationId,
    );
  }

  get publicData () {
    const {
      // extract out password
      password, // eslint-disable-line
      organizations,
      ...publicData
    } = this.data;

    return {
      ...publicData,
      organizations: organizations.map(
        organization => organization.publicData,
      ),
    };
  }

  get id () {
    return this.data.id;
  }

  get email () {
    return this.data.email;
  }

  get name () {
    return this.data.name;
  }

  get password () {
    return this.data.password;
  }

  get createdAt () {
    return this.data.createdAt;
  }

  get updatedAt () {
    return this.data.updatedAt;
  }

  get organizations () {
    return this.data.organizations;
  }
}
