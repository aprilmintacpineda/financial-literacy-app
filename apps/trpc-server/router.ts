import addWallet from './mutations/add-wallet';
import signInMutation from './mutations/sign-in';
import signUpMutation from './mutations/sign-up';
import validateTokenMutation from './mutations/validate-token';
import { trpc } from './trpc';

export const appRouter = trpc.router({
  // mutations
  signUpMutation,
  signInMutation,
  validateTokenMutation,
  addWallet,
});
