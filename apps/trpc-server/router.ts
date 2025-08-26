import addCategoryMutation from './mutations/add-category';
import addTagMutation from './mutations/add-tag';
import addWalletMutation from './mutations/add-wallet';
import signInMutation from './mutations/sign-in';
import signUpMutation from './mutations/sign-up';
import validateTokenMutation from './mutations/validate-token';
import getCategoriesQuery from './queries/get-categories';
import getTagsQuery from './queries/get-tags';
import getWalletsQuery from './queries/get-wallets';
import { trpc } from './trpc';

export const appRouter = trpc.router({
  // auth
  signUpMutation,
  signInMutation,
  validateTokenMutation,

  // wallets
  addWalletMutation,
  getWalletsQuery,

  // categories
  addCategoryMutation,
  getCategoriesQuery,

  // tags
  addTagMutation,
  getTagsQuery,
});
