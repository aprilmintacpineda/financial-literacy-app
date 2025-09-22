import { type ColumnDataType } from 'kysely';

export const cuid: ColumnDataType = 'varchar(32)';
export const names: ColumnDataType = 'varchar(30)';
export const shortDescription: ColumnDataType = 'varchar(255)';
export const amounts: ColumnDataType = 'bigint';
export const currencyCode: ColumnDataType = 'varchar(3)';
