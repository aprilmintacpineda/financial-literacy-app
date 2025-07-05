export async function createTRPCContext () {
  // @todo retrieve currently logged in user from req.headers.authorization
  // @todo retrieve user information from database through session id in authorization
  return {};
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
