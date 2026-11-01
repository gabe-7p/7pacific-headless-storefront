/**
 * Below-the-fold data is returned from loaders as a promise and rendered with
 * `<Suspense>`/`<Await>`; a rejection would 500 the whole page, so every
 * deferred query goes through here: log and resolve to null instead.
 */
export const deferQuery = <T>(query: Promise<T>): Promise<T | null> =>
  query.catch((error: unknown) => {
    console.error(error);
    return null;
  });
