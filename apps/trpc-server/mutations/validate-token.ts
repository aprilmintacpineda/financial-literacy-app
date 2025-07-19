import { protectedProcedure } from '../trpc';

const validateTokenMutation = protectedProcedure.mutation(
  async () => {},
);

export default validateTokenMutation;
