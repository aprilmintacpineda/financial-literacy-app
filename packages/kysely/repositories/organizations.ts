import { type AddOrganizationDto } from '@packages/data-transfer-objects/dtos';
import { type Transaction } from 'kysely';
import { database } from '../database';
import { type DB } from '../database-types';
import { uniqueId } from '../utils/generators';

export class OrganizationsRepository {
  static async createOrganization (
    {
      id: _id,
      ...values
    }: AddOrganizationDto & {
      id?: string;
    },
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;
    const id = _id ?? uniqueId();
    const now = new Date();

    await connection
      .insertInto('organizations')
      .values({
        ...values,
        id,
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    return id;
  }
}
