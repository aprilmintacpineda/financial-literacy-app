import { type Wallets } from '../database-types';

export class WalletModel implements Omit<Wallets, 'deletedAt'> {
  private data: Omit<Wallets, 'deletedAt'>;

  constructor (wallet: Omit<Wallets, 'deletedAt'>) {
    this.data = {
      ...wallet,
    };
  }

  get publicData () {
    return this.data;
  }

  get id () {
    return this.data.id;
  }

  get name () {
    return this.data.name;
  }

  get amount () {
    return this.data.amount;
  }

  get currency () {
    return this.data.currency;
  }

  get walletType () {
    return this.data.walletType;
  }

  get createdAt () {
    return this.data.createdAt;
  }

  get organizationId () {
    return this.data.organizationId;
  }

  get updatedAt () {
    return this.data.updatedAt;
  }
}
