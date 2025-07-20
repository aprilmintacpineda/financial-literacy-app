import { type SignUpDto } from '@packages/data-transfer-objects';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcrypt';
import { database } from '../database';
import { UserModel } from '../models/user';

function mapResultToModel (
  result: {
    userId: string;
    userEmail: string;
    userName: string;
    userPassword: string;
    userCreatedAt: Date;
    userUpdatedAt: Date;
    organizationId: string;
    organizationName: string;
    organizationCreatedAt: Date;
    organizationUpdatedAt: Date;
  }[],
) {
  if (!result.length) return null;

  return new UserModel(
    {
      id: result[0].userId,
      name: result[0].userName,
      email: result[0].userEmail,
      password: result[0].userPassword,
      createdAt: result[0].userCreatedAt,
      updatedAt: result[0].userUpdatedAt,
    },
    result.map(result => {
      return {
        id: result.organizationId,
        name: result.organizationName,
        createdAt: result.organizationCreatedAt,
        updatedAt: result.organizationUpdatedAt,
      };
    }),
  );
}

export class UsersRepository {
  static async getUserByEmail (email: string) {
    const result = await database
      .selectFrom('users')
      .innerJoin(
        'organization_users',
        'users.id',
        'organization_users.userId',
      )
      .innerJoin('organizations', join =>
        join
          .onRef(
            'organizations.id',
            '=',
            'organization_users.organizationId',
          )
          .on('organizations.deletedAt', 'is', null),
      )
      .select([
        'users.id as userId',
        'users.email as userEmail',
        'users.name as userName',
        'users.password as userPassword',
        'users.createdAt as userCreatedAt',
        'users.updatedAt as userUpdatedAt',
        'organizations.id as organizationId',
        'organizations.name as organizationName',
        'organizations.createdAt as organizationCreatedAt',
        'organizations.updatedAt as organizationUpdatedAt',
      ])
      .where(eb =>
        eb.and([
          eb('users.email', '=', email),
          eb('users.deletedAt', 'is', null),
        ]),
      )
      .execute();

    return mapResultToModel(result);
  }

  static async getUserById (userId: string) {
    const results = await database
      .selectFrom('users')
      .innerJoin(
        'organization_users',
        'users.id',
        'organization_users.userId',
      )
      .innerJoin('organizations', join =>
        join
          .onRef(
            'organizations.id',
            '=',
            'organization_users.organizationId',
          )
          .on('organizations.deletedAt', 'is', null),
      )
      .select([
        'users.id as userId',
        'users.email as userEmail',
        'users.name as userName',
        'users.password as userPassword',
        'users.createdAt as userCreatedAt',
        'users.updatedAt as userUpdatedAt',
        'organizations.id as organizationId',
        'organizations.name as organizationName',
        'organizations.createdAt as organizationCreatedAt',
        'organizations.updatedAt as organizationUpdatedAt',
      ])
      .where(eb =>
        eb.and([
          eb('users.id', '=', userId),
          eb('users.deletedAt', 'is', null),
        ]),
      )
      .execute();

    return mapResultToModel(results);
  }

  static async createUser ({ email, name, password }: SignUpDto) {
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
          updatedAt: now,
          createdAt: now,
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
}
