import { type AddOrganizationUserDto } from '@packages/data-transfer-objects/dtos';
import { type Transaction } from 'kysely';
import { database } from '../database';
import { type DB } from '../database-types';

export class OrganizationUsersRepository {
  static async addUserToOrganization (
    values: AddOrganizationUserDto,
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;
    const now = new Date();

    await connection
      .insertInto('organization_users')
      .values({
        ...values,
        createdAt: now,
        updatedAt: now,
      })
      .execute();
  }
}
