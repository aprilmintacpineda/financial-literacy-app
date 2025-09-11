import {
  type Categories,
  type Tags,
  type Transactions,
  type Wallets,
} from '../database-types';
import { CategoryModel } from './category';
import { TagModel } from './tag';
import { WalletModel } from './wallet';

export class TransactionModel
  implements Omit<Transactions, 'deletedAt'> {
  private data: Omit<Transactions, 'deletedAt'> & {
    category: CategoryModel;
    wallet: WalletModel;
    tags: TagModel[];
  };

  constructor (
    transaction: Omit<Transactions, 'deletedAt'>,
    category: Omit<Categories, 'deletedAt'>,
    wallet: Omit<Wallets, 'deletedAt'>,
    tags: Omit<Tags, 'deletedAt'>[],
  ) {
    this.data = {
      ...transaction,
      category: new CategoryModel(category),
      wallet: new WalletModel(wallet),
      tags: tags.map(tag => new TagModel(tag)),
    };
  }

  get publicData () {
    return {
      ...this.data,
      category: this.data.category.publicData,
      wallet: this.data.wallet.publicData,
      tags: this.data.tags.map(tag => tag.publicData),
    };
  }

  get id () {
    return this.data.id;
  }

  get amount () {
    return this.data.amount;
  }

  get currency () {
    return this.data.currency;
  }

  get categoryId () {
    return this.data.categoryId;
  }

  get description () {
    return this.data.description;
  }

  get transactionDate () {
    return this.data.transactionDate;
  }

  get transactionType () {
    return this.data.transactionType;
  }

  get walletId () {
    return this.data.walletId;
  }

  get organizationId () {
    return this.data.organizationId;
  }

  get createdAt () {
    return this.data.createdAt;
  }

  get updatedAt () {
    return this.data.updatedAt;
  }

  get tags () {
    return this.data.tags;
  }
}
