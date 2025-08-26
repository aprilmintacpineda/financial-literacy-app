import { type SignUpDto } from '@packages/data-transfer-objects/dtos';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcrypt';
import { database } from '../database';
import { UserModel } from '../models/user';

function mapSingleUserToModel (
  results: {
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
  if (!results.length) return null;

  return new UserModel(
    {
      id: results[0].userId,
      name: results[0].userName,
      email: results[0].userEmail,
      password: results[0].userPassword,
      createdAt: results[0].userCreatedAt,
      updatedAt: results[0].userUpdatedAt,
    },
    results.map(result => {
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

    return mapSingleUserToModel(result);
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

    return mapSingleUserToModel(results);
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
