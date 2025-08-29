import addCategoryMutation from './mutations/add-category';
import addTagMutation from './mutations/add-tag';
import addWalletMutation from './mutations/add-wallet';
import editCategoryMutation from './mutations/edit-category';
import editTagMutation from './mutations/edit-tag';
import editWalletMutation from './mutations/edit-wallet';
import resendEmailVerificationMutation from './mutations/resend-email-verification-code';
import signInMutation from './mutations/sign-in';
import signUpMutation from './mutations/sign-up';
import validateTokenMutation from './mutations/validate-token';
import verifyEmailMutation from './mutations/verify-email';
import getCategoriesQuery from './queries/get-categories';
import getTagsQuery from './queries/get-tags';
import getWalletsQuery from './queries/get-wallets';
import { trpc } from './trpc';

export const appRouter = trpc.router({
  // auth
  signUpMutation,
  signInMutation,
  validateTokenMutation,
  verifyEmailMutation,
  resendEmailVerificationMutation,

  // wallets
  addWalletMutation,
  getWalletsQuery,
  editWalletMutation,

  // categories
  editCategoryMutation,
  addCategoryMutation,
  getCategoriesQuery,

  // tags
  addTagMutation,
  getTagsQuery,
  editTagMutation,
});
