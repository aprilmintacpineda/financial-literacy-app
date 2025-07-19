import { type tAppRouter } from '@apps/trpc-server';
import {
  createTRPCReact,
  type TRPCClientError,
} from '@trpc/react-query';

export const trpc = createTRPCReact<tAppRouter>();
export type tTRPCClientError = TRPCClientError<tAppRouter>;
