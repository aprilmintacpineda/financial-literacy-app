import { type tAppRouter } from '@apps/trpc-server';
import {
  createTRPCReact,
  type TRPCClientError,
} from '@trpc/react-query';
import { type inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<tAppRouter>();
export type tTRPCClientError = TRPCClientError<tAppRouter>;
export type TRPCProcedureOutputs = inferRouterOutputs<tAppRouter>;
