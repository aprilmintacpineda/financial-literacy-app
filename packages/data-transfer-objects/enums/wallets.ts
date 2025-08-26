export const supportedWalletTypes = ['Debit', 'Credit'] as const;

export type SupportedWalletType =
  (typeof supportedWalletTypes)[number];
