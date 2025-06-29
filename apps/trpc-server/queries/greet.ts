import { z } from 'zod';
import { trpc } from '../trpc';

const greetQuery = trpc.procedure
  .input(z.string())
  .query(async ({ input }) => {
    return `Hello ${input}`;
  });

export default greetQuery;
