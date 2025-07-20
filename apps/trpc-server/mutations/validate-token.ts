import { protectedProcedure } from '../trpc';

const validateTokenMutation = protectedProcedure.mutation(
  async ({ ctx }) => ctx.user.publicData,
);

export default validateTokenMutation;
