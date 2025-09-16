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
    category?: CategoryModel;
    wallet: WalletModel;
    fromWallet?: WalletModel;
    tags: TagModel[];
  };

  constructor ({
    tags,
    transaction,
    wallet,
    category,
    fromWallet,
  }: {
    transaction: Omit<Transactions, 'deletedAt'>;
    wallet: Omit<Wallets, 'deletedAt'>;
    tags: Omit<Tags, 'deletedAt'>[];
    category?: Omit<Categories, 'deletedAt'>;
    fromWallet?: Omit<Wallets, 'deletedAt'>;
  }) {
    this.data = {
      ...transaction,
      category: category ? new CategoryModel(category) : undefined,
      wallet: new WalletModel(wallet),
      tags: tags.map(tag => new TagModel(tag)),
      fromWallet: fromWallet
        ? new WalletModel(fromWallet)
        : undefined,
    };
  }

  get publicData () {
    return {
      ...this.data,
      category: this.data.category?.publicData,
      wallet: this.data.wallet.publicData,
      tags: this.data.tags.map(tag => tag.publicData),
      fromWallet: this.data.fromWallet?.publicData,
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

  get fromWalletId () {
    return this.data.fromWalletId;
  }

  get exchangeRate () {
    return this.data.exchangeRate;
  }
}
