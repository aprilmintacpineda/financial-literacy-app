import { type UserModel } from '@packages/kysely/models';
import { type appRouter } from '../router';

export type tAppRouter = typeof appRouter;

export type PublicUserData = UserModel['publicData'];
