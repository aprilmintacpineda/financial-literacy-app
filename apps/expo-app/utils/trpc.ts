import { type tAppRouter } from '@apps/trpc-server';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<tAppRouter>();
