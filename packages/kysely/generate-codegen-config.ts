import {
  supportedCurrenciesCodes,
  supportedTransactionTypes,
  supportedWalletTypes,
} from '@packages/data-transfer-objects/enums';
import fs from 'fs/promises';
import path from 'path';

function toIntersection(values: readonly string[]) {
  return `'${values.join("' | '")}'`;
}

(async () => {
  const currency = toIntersection(supportedCurrenciesCodes);
  const walletTypes = toIntersection(supportedWalletTypes);
  const transactionTypes = toIntersection(supportedTransactionTypes);

  const config = {
    dialect: 'mysql',
    outFile: path.join(__dirname, 'database-types.ts'),
    overrides: {
      columns: {
        'wallets.walletType': walletTypes,
        'wallets.currency': currency,
        'transactions.currency': currency,
        'transactions.transactionType': transactionTypes,
        'users.emailVerificationCodeTries': 'number',
        'users.changePasswordVerificationCodeTries': 'number',
      },
    },
  };

  await fs.writeFile(
    path.join(__dirname, '.kysely-codegenrc.json'),
    JSON.stringify(config, null, 2),
    'utf-8'
  );
})();
