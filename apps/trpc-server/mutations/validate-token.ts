import { verifiedUserProcedure } from '../trpc';
import { createJwt } from '../utils/jwt';

const validateTokenMutation = verifiedUserProcedure.mutation(
  async ({ ctx }) => {
    const token = await createJwt(ctx.user.id);

    return {
      token,
      publicUserData: ctx.user.publicData,
    };
  }
);

export default validateTokenMutation;
