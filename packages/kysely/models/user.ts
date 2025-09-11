import bcrypt from 'bcrypt';
import { type Organizations, type Users } from '../database-types';
import { omit } from '../utils/data-manipulation';
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
    const publicData = omit(this.data, [
      'password',
      'organizations',
      'emailVerifiedAt',
      'emailVerificationCode',
      'emailVerificationCodeExpiresAt',
      'emailVerificationCodeTries',
      'changePasswordVerificationCode',
      'changePasswordVerificationCodeExpiresAt',
      'changePasswordVerificationCodeTries',
      'updatedAt',
    ]);

    return {
      ...publicData,
      isEmailVerified: Boolean(this.emailVerifiedAt),
      organizations: this.organizations.map(
        organization => organization.publicData,
      ),
    };
  }

  get id () {
    return this.data.id;
  }

  get emailVerificationCodeCanSentAt () {
    return this.data.emailVerificationCodeCanSentAt;
  }

  get emailVerificationCode () {
    return this.data.emailVerificationCode;
  }

  get emailVerificationCodeExpiresAt () {
    return this.data.emailVerificationCodeExpiresAt;
  }

  get emailVerificationCodeTries () {
    return this.data.emailVerificationCodeTries;
  }

  get emailVerifiedAt () {
    return this.data.emailVerifiedAt;
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

  get changePasswordVerificationCodeCanSentAt () {
    return this.data.changePasswordVerificationCodeCanSentAt;
  }

  get changePasswordVerificationCode () {
    return this.data.changePasswordVerificationCode;
  }

  get changePasswordVerificationCodeExpiresAt () {
    return this.data.changePasswordVerificationCodeExpiresAt;
  }

  get changePasswordVerificationCodeTries () {
    return this.data.changePasswordVerificationCodeTries;
  }
}
