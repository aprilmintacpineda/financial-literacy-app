import { type SignUpDto } from '@packages/data-transfer-objects/dtos';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcrypt';
import { database } from '../database';
import {
  type Organizations,
  type OrganizationUsers,
  type Users,
} from '../database-types';
import { UserModel } from '../models';
import {
  getEmailVerificationCodeCanSentAt,
  getEmailVerificationCodeExpiresAt,
} from '../utils/time';

function mapSingleUserToModel(
  results: {
    userId: Users['id'];
    userEmail: Users['email'];
    userName: Users['name'];
    userPassword: Users['password'];
    userCreatedAt: Users['createdAt'];
    userUpdatedAt: Users['updatedAt'];
    userEmailVerificationCode: Users['emailVerificationCode'];
    userEmailVerificationCodeExpiresAt: Users['emailVerificationCodeExpiresAt'];
    userEmailVerificationCodeTries: Users['emailVerificationCodeTries'];
    userEmailVerifiedAt: Users['emailVerifiedAt'];
    userEmailVerificationCodeCanSentAt: Users['emailVerificationCodeCanSentAt'];
    userChangePasswordVerificationCode: Users['changePasswordVerificationCode'];
    userChangePasswordVerificationCodeExpiresAt: Users['changePasswordVerificationCodeExpiresAt'];
    userChangePasswordVerificationCodeTries: Users['changePasswordVerificationCodeTries'];
    userChangePasswordVerificationCodeCanSentAt: Users['changePasswordVerificationCodeCanSentAt'];
    organizationId: OrganizationUsers['organizationId'];
    organizationName: Organizations['name'];
    organizationCreatedAt: Organizations['createdAt'];
    organizationUpdatedAt: Organizations['updatedAt'];
  }[]
) {
  if (!results.length) return null;

  return new UserModel(
    {
      id: results[0].userId,
      name: results[0].userName,
      email: results[0].userEmail,
      password: results[0].userPassword,
      createdAt: results[0].userCreatedAt,
      updatedAt: results[0].userUpdatedAt,
      emailVerificationCode: results[0].userEmailVerificationCode,
      emailVerificationCodeExpiresAt:
        results[0].userEmailVerificationCodeExpiresAt,
      emailVerificationCodeTries:
        results[0].userEmailVerificationCodeTries,
      emailVerifiedAt: results[0].userEmailVerifiedAt,
      emailVerificationCodeCanSentAt:
        results[0].userEmailVerificationCodeCanSentAt,
      changePasswordVerificationCode:
        results[0].userChangePasswordVerificationCode,
      changePasswordVerificationCodeExpiresAt:
        results[0].userChangePasswordVerificationCodeExpiresAt,
      changePasswordVerificationCodeTries:
        results[0].userChangePasswordVerificationCodeTries,
      changePasswordVerificationCodeCanSentAt:
        results[0].userChangePasswordVerificationCodeCanSentAt,
    },
    results.map(result => {
      return {
        id: result.organizationId,
        name: result.organizationName,
        createdAt: result.organizationCreatedAt,
        updatedAt: result.organizationUpdatedAt,
      };
    })
  );
}

export class UsersRepository {
  static async getUserByEmail(email: string) {
    const result = await database
      .selectFrom('users')
      .innerJoin(
        'organization_users',
        'users.id',
        'organization_users.userId'
      )
      .innerJoin('organizations', join =>
        join
          .onRef(
            'organizations.id',
            '=',
            'organization_users.organizationId'
          )
          .on('organizations.deletedAt', 'is', null)
      )
      .select([
        'users.id as userId',
        'users.email as userEmail',
        'users.name as userName',
        'users.password as userPassword',
        'users.createdAt as userCreatedAt',
        'users.updatedAt as userUpdatedAt',
        'users.emailVerificationCode as userEmailVerificationCode',
        'users.emailVerificationCodeExpiresAt as userEmailVerificationCodeExpiresAt',
        'users.emailVerificationCodeTries as userEmailVerificationCodeTries',
        'users.emailVerifiedAt as userEmailVerifiedAt',
        'users.emailVerificationCodeCanSentAt as userEmailVerificationCodeCanSentAt',
        'users.changePasswordVerificationCode as userChangePasswordVerificationCode',
        'users.changePasswordVerificationCodeExpiresAt as userChangePasswordVerificationCodeExpiresAt',
        'users.changePasswordVerificationCodeTries as userChangePasswordVerificationCodeTries',
        'users.changePasswordVerificationCodeCanSentAt as userChangePasswordVerificationCodeCanSentAt',
        'organizations.id as organizationId',
        'organizations.name as organizationName',
        'organizations.createdAt as organizationCreatedAt',
        'organizations.updatedAt as organizationUpdatedAt',
      ])
      .where(eb =>
        eb.and([
          eb('users.email', '=', email),
          eb('users.deletedAt', 'is', null),
        ])
      )
      .execute();

    return mapSingleUserToModel(result);
  }

  static async getUserById(userId: string) {
    const results = await database
      .selectFrom('users')
      .innerJoin(
        'organization_users',
        'users.id',
        'organization_users.userId'
      )
      .innerJoin('organizations', join =>
        join
          .onRef(
            'organizations.id',
            '=',
            'organization_users.organizationId'
          )
          .on('organizations.deletedAt', 'is', null)
      )
      .select([
        'users.id as userId',
        'users.email as userEmail',
        'users.name as userName',
        'users.password as userPassword',
        'users.createdAt as userCreatedAt',
        'users.updatedAt as userUpdatedAt',
        'users.emailVerificationCode as userEmailVerificationCode',
        'users.emailVerificationCodeExpiresAt as userEmailVerificationCodeExpiresAt',
        'users.emailVerificationCodeTries as userEmailVerificationCodeTries',
        'users.emailVerifiedAt as userEmailVerifiedAt',
        'users.emailVerificationCodeCanSentAt as userEmailVerificationCodeCanSentAt',
        'users.changePasswordVerificationCode as userChangePasswordVerificationCode',
        'users.changePasswordVerificationCodeExpiresAt as userChangePasswordVerificationCodeExpiresAt',
        'users.changePasswordVerificationCodeTries as userChangePasswordVerificationCodeTries',
        'users.changePasswordVerificationCodeCanSentAt as userChangePasswordVerificationCodeCanSentAt',
        'organizations.id as organizationId',
        'organizations.name as organizationName',
        'organizations.createdAt as organizationCreatedAt',
        'organizations.updatedAt as organizationUpdatedAt',
      ])
      .where(eb =>
        eb.and([
          eb('users.id', '=', userId),
          eb('users.deletedAt', 'is', null),
        ])
      )
      .execute();

    return mapSingleUserToModel(results);
  }

  static async createUser({
    email,
    name,
    password,
    emailVerificationCode,
  }: SignUpDto & { emailVerificationCode: string }) {
    await database.transaction().execute(async trx => {
      const hashedPassword = await bcrypt.hash(password, 12);
      const now = new Date();
      const userId = createId();
      const organizationId = createId();

      await trx
        .insertInto('users')
        .values({
          id: userId,
          email,
          password: hashedPassword,
          name,
          emailVerificationCode,
          emailVerificationCodeExpiresAt:
            getEmailVerificationCodeExpiresAt(),
          emailVerificationCodeTries: 0,
          emailVerificationCodeCanSentAt:
            getEmailVerificationCodeCanSentAt(),
          updatedAt: now,
          createdAt: now,
          changePasswordVerificationCodeTries: 0,
        })
        .execute();

      await trx
        .insertInto('organizations')
        .values({
          id: organizationId,
          name: 'Personal Finance',
          createdAt: now,
          updatedAt: now,
        })
        .execute();

      await trx
        .insertInto('organization_users')
        .values({
          userId,
          organizationId,
          createdAt: now,
          updatedAt: now,
        })
        .execute();
    });
  }

  static async updateUser({
    id,
    ...input
  }: Pick<Users, 'id'> &
    Partial<
      Pick<
        Users,
        | 'id'
        | 'password'
        | 'name'
        | 'emailVerificationCode'
        | 'emailVerificationCodeExpiresAt'
        | 'emailVerificationCodeTries'
        | 'emailVerificationCodeCanSentAt'
        | 'emailVerifiedAt'
        | 'changePasswordVerificationCode'
        | 'changePasswordVerificationCodeExpiresAt'
        | 'changePasswordVerificationCodeTries'
        | 'changePasswordVerificationCodeCanSentAt'
      >
    >) {
    await database
      .updateTable('users')
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eb =>
        eb.and([eb('id', '=', id), eb('deletedAt', 'is', null)])
      )
      .execute();
  }

  static async changePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const now = new Date();

    await database
      .updateTable('users')
      .set({
        id: userId,
        password: hashedPassword,
        changePasswordVerificationCodeTries: 0,
        changePasswordVerificationCode: null,
        changePasswordVerificationCodeCanSentAt: null,
        changePasswordVerificationCodeExpiresAt: null,
        updatedAt: now,
      })
      .execute();
  }
}
