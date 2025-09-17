import {
  type AddTransactionDto,
  type EditTransactionDto,
} from '@packages/data-transfer-objects/dtos';
import { type CurrencyCode } from '@packages/data-transfer-objects/enums';
import { type Transaction } from 'kysely';
import { database } from '../database';
import {
  type Categories,
  type DB,
  type Tags,
  type Transactions,
  type Wallets,
} from '../database-types';
import { TransactionModel } from '../models/transaction';
import { uniqueId } from '../utils/generators';

function mapResultsToModel (
  results: {
    transactionId: Transactions['id'];
    organizationId: Transactions['organizationId'];
    transactionDescription: Transactions['description'];
    transactionAmount: Transactions['amount'];
    transactionDate: Transactions['transactionDate'];
    transactionType: Transactions['transactionType'];
    transactionCurrency: Transactions['currency'];
    transactionCreatedAt: Transactions['createdAt'];
    transactionUpdatedAt: Transactions['updatedAt'];
    transactionExchangeRate: Transactions['exchangeRate'];
    tagId: Tags['id'] | null;
    tagName: Tags['name'] | null;
    tagDescription: Tags['description'] | null;
    tagCreatedAt: Tags['createdAt'] | null;
    tagUpdatedAt: Tags['updatedAt'] | null;
    walletId: Wallets['id'];
    walletName: Wallets['name'];
    walletAmount: Wallets['amount'];
    walletCurrency: Wallets['currency'];
    walletCreatedAt: Wallets['createdAt'];
    walletUpdatedAt: Wallets['updatedAt'];
    walletType: Wallets['walletType'];
    fromWalletId: Wallets['id'] | null;
    fromWalletName: Wallets['name'] | null;
    fromWalletAmount: Wallets['amount'] | null;
    fromWalletCurrency: Wallets['currency'] | null;
    fromWalletCreatedAt: Wallets['createdAt'] | null;
    fromWalletUpdatedAt: Wallets['updatedAt'] | null;
    fromWalletType: Wallets['walletType'] | null;
    categoryId: Categories['id'] | null;
    categoryName: Categories['name'] | null;
    categoryDescription: Categories['description'] | null;
    categoryCreatedAt: Categories['createdAt'] | null;
    categoryUpdatedAt: Categories['updatedAt'] | null;
  }[],
) {
  const grouppedTransactionIds: string[] = [];

  return results.reduce<TransactionModel[]>(
    (
      models,
      {
        transactionId,
        organizationId,
        transactionDescription,
        transactionAmount,
        transactionDate,
        transactionType,
        transactionCurrency,
        transactionCreatedAt,
        transactionUpdatedAt,
        transactionExchangeRate,
        walletId,
        walletName,
        walletAmount,
        walletCreatedAt,
        walletCurrency,
        walletType,
        walletUpdatedAt,
        fromWalletId,
        fromWalletName,
        fromWalletAmount,
        fromWalletCreatedAt,
        fromWalletCurrency,
        fromWalletType,
        fromWalletUpdatedAt,
        categoryId,
        categoryName,
        categoryCreatedAt,
        categoryDescription,
        categoryUpdatedAt,
      },
    ) => {
      if (grouppedTransactionIds.includes(transactionId))
        return models;

      grouppedTransactionIds.push(transactionId);

      return models.concat(
        new TransactionModel({
          tags: results.reduce<Omit<Tags, 'deletedAt'>[]>(
            (
              results,
              {
                tagId,
                tagName,
                tagCreatedAt,
                tagDescription,
                tagUpdatedAt,
                transactionId: _transactionId,
              },
            ) => {
              if (_transactionId !== transactionId || !tagId)
                return results;

              return results.concat({
                id: tagId!,
                name: tagName!,
                description: tagDescription!,
                organizationId,
                createdAt: tagCreatedAt!,
                updatedAt: tagUpdatedAt!,
              });
            },
            [],
          ),
          transaction: {
            id: transactionId,
            organizationId,
            description: transactionDescription,
            amount: transactionAmount,
            transactionDate,
            transactionType,
            currency: transactionCurrency,
            categoryId,
            updatedAt: transactionUpdatedAt,
            createdAt: transactionCreatedAt,
            fromWalletId,
            exchangeRate: transactionExchangeRate,
            walletId,
          },
          wallet: {
            id: walletId,
            amount: walletAmount,
            createdAt: walletCreatedAt,
            updatedAt: walletUpdatedAt,
            currency: walletCurrency,
            name: walletName,
            organizationId,
            walletType,
          },
          fromWallet: fromWalletId
            ? {
                id: fromWalletId,
                amount: fromWalletAmount!,
                createdAt: fromWalletCreatedAt!,
                updatedAt: fromWalletUpdatedAt!,
                currency: fromWalletCurrency!,
                name: fromWalletName!,
                organizationId,
                walletType: fromWalletType!,
              }
            : undefined,
          category: categoryId
            ? {
                id: categoryId,
                description: categoryDescription!,
                createdAt: categoryCreatedAt!,
                updatedAt: categoryUpdatedAt!,
                organizationId,
                name: categoryName!,
              }
            : undefined,
        }),
      );
    },
    [],
  );
}

export class TransactionsRepository {
  static async createTransaction (
    {
      id: _id,
      ...values
    }: Omit<AddTransactionDto, 'tagIds'> & {
      id?: string;
      currency: CurrencyCode;
    },
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;
    const now = new Date();
    const id = _id ?? uniqueId();

    await connection
      .insertInto('transactions')
      .values({
        ...values,
        id,
        createdAt: now,
        updatedAt: now,
      })
      .execute();

    return id;
  }

  static async getAllTransactions (organizationId: string) {
    const transactions = await database
      .selectFrom('transactions')
      .innerJoin('wallets', 'transactions.walletId', 'wallets.id')
      .leftJoin(
        'categories',
        'transactions.categoryId',
        'categories.id',
      )
      .leftJoin(
        'wallets as fromWallet',
        'transactions.fromWalletId',
        'fromWallet.id',
      )
      .leftJoin(
        'transaction_tags',
        'transactions.id',
        'transaction_tags.transactionId',
      )
      .leftJoin('tags', join =>
        join
          .onRef('transaction_tags.tagId', '=', 'tags.id')
          .on('tags.deletedAt', 'is', null),
      )
      .select([
        'transactions.id as transactionId',
        'transactions.organizationId as organizationId',
        'transactions.description as transactionDescription',
        'transactions.amount as transactionAmount',
        'transactions.transactionDate as transactionDate',
        'transactions.transactionType as transactionType',
        'transactions.currency as transactionCurrency',
        'transactions.createdAt as transactionCreatedAt',
        'transactions.updatedAt as transactionUpdatedAt',
        'transactions.exchangeRate as transactionExchangeRate',
        'tags.id as tagId',
        'tags.name as tagName',
        'tags.description as tagDescription',
        'tags.createdAt as tagCreatedAt',
        'tags.updatedAt as tagUpdatedAt',
        'wallets.id as walletId',
        'wallets.name as walletName',
        'wallets.amount as walletAmount',
        'wallets.currency as walletCurrency',
        'wallets.createdAt as walletCreatedAt',
        'wallets.updatedAt as walletUpdatedAt',
        'wallets.walletType as walletType',
        'fromWallet.id as fromWalletId',
        'fromWallet.name as fromWalletName',
        'fromWallet.amount as fromWalletAmount',
        'fromWallet.currency as fromWalletCurrency',
        'fromWallet.createdAt as fromWalletCreatedAt',
        'fromWallet.updatedAt as fromWalletUpdatedAt',
        'fromWallet.walletType as fromWalletType',
        'categories.id as categoryId',
        'categories.name as categoryName',
        'categories.description as categoryDescription',
        'categories.createdAt as categoryCreatedAt',
        'categories.updatedAt as categoryUpdatedAt',
      ])
      .where(eb =>
        eb.and([
          eb('transactions.organizationId', '=', organizationId),
          eb('transactions.deletedAt', 'is', null),
        ]),
      )
      .execute();

    return mapResultsToModel(transactions);
  }

  static async getTransactionById (
    organizationId: string,
    id: string,
  ) {
    const transactions = await database
      .selectFrom('transactions')
      .innerJoin('wallets', 'transactions.walletId', 'wallets.id')
      .leftJoin(
        'categories',
        'transactions.categoryId',
        'categories.id',
      )
      .leftJoin(
        'wallets as fromWallet',
        'transactions.fromWalletId',
        'fromWallet.id',
      )
      .leftJoin(
        'transaction_tags',
        'transactions.id',
        'transaction_tags.transactionId',
      )
      .leftJoin('tags', join =>
        join
          .onRef('transaction_tags.tagId', '=', 'tags.id')
          .on('tags.deletedAt', 'is', null),
      )
      .select([
        'transactions.id as transactionId',
        'transactions.organizationId as organizationId',
        'transactions.description as transactionDescription',
        'transactions.amount as transactionAmount',
        'transactions.transactionDate as transactionDate',
        'transactions.transactionType as transactionType',
        'transactions.currency as transactionCurrency',
        'transactions.createdAt as transactionCreatedAt',
        'transactions.updatedAt as transactionUpdatedAt',
        'transactions.exchangeRate as transactionExchangeRate',
        'tags.id as tagId',
        'tags.name as tagName',
        'tags.description as tagDescription',
        'tags.createdAt as tagCreatedAt',
        'tags.updatedAt as tagUpdatedAt',
        'wallets.id as walletId',
        'wallets.name as walletName',
        'wallets.amount as walletAmount',
        'wallets.currency as walletCurrency',
        'wallets.createdAt as walletCreatedAt',
        'wallets.updatedAt as walletUpdatedAt',
        'wallets.walletType as walletType',
        'fromWallet.id as fromWalletId',
        'fromWallet.name as fromWalletName',
        'fromWallet.amount as fromWalletAmount',
        'fromWallet.currency as fromWalletCurrency',
        'fromWallet.createdAt as fromWalletCreatedAt',
        'fromWallet.updatedAt as fromWalletUpdatedAt',
        'fromWallet.walletType as fromWalletType',
        'categories.id as categoryId',
        'categories.name as categoryName',
        'categories.description as categoryDescription',
        'categories.createdAt as categoryCreatedAt',
        'categories.updatedAt as categoryUpdatedAt',
      ])
      .where(eb =>
        eb.and([
          eb('transactions.organizationId', '=', organizationId),
          eb('transactions.deletedAt', 'is', null),
          eb('transactions.id', '=', id),
        ]),
      )
      .execute();

    return mapResultsToModel(transactions)[0] ?? null;
  }

  static async editTransaction (
    organizationId: string,
    { id, ...values }: Omit<EditTransactionDto, 'tagIds'>,
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;

    await connection
      .updateTable('transactions')
      .set({
        ...values,
        id,
        updatedAt: new Date(),
      })
      .where(eb =>
        eb.and([
          eb('organizationId', '=', organizationId),
          eb('deletedAt', 'is', null),
          eb('id', '=', id),
        ]),
      )
      .execute();
  }

  static async deleteTransaction (
    organizationId: string,
    transactionId: string,
    trx?: Transaction<DB>,
  ) {
    const connection = trx ?? database;

    await connection
      .deleteFrom('transactions')
      .where(eb =>
        eb.and([
          eb('organizationId', '=', organizationId),
          eb('id', '=', transactionId),
        ]),
      )
      .execute();
  }
}
