import { sql, type Kysely } from 'kysely';
import { createBaseTable } from '../utils/schema';
import { cuid, names } from '../utils/types';

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await createBaseTable(db, 'users')
    .addColumn('id', cuid, col => col.primaryKey().notNull())
    .addColumn('email', 'varchar(255)', col =>
      col.unique().notNull()
    )
    .addColumn('password', 'varchar(255)', col => col.notNull())
    .addColumn('name', names, col => col.notNull())
    .addColumn('emailVerificationCode', 'varchar(9)', col =>
      col.notNull()
    )
    .addColumn('emailVerificationCodeExpiresAt', 'timestamp', col =>
      col.notNull()
    )
    .addColumn('emailVerificationCodeCanSentAt', 'timestamp', col =>
      col.notNull()
    )
    .addColumn('emailVerifiedAt', 'timestamp')
    .addColumn('emailVerificationCodeTries', sql`tinyint`, col =>
      col.notNull().defaultTo(0)
    )
    .addColumn('changePasswordVerificationCode', 'varchar(9)')
    .addColumn(
      'changePasswordVerificationCodeExpiresAt',
      'timestamp'
    )
    .addColumn(
      'changePasswordVerificationCodeCanSentAt',
      'timestamp'
    )
    .addColumn(
      'changePasswordVerificationCodeTries',
      sql`tinyint`,
      col => col.notNull().defaultTo(0)
    )
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
}
