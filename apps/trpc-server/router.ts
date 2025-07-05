import greetQuery from './queries/greet';
import listUsersQuery from './queries/list-users';
import { trpc } from './trpc';

export const appRouter = trpc.router({
  greetQuery,
  listUsersQuery,
});
