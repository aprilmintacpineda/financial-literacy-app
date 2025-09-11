export async function allFulfilledOrThrow<T = unknown> (
  promises: Promise<T>[],
): Promise<T[]> {
  const results = await Promise.allSettled(promises);

  return results.reduce<T[]>((results, current) => {
    if (current.status === 'rejected')
      throw new Error(current.reason);

    return results.concat(current.value);
  }, []);
}
