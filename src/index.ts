import { infiniteQuery } from "./infiniteQuery.js";
import { mutation } from "./mutation.js";
import { query } from "./query.js";

export { prefetching } from "./prefetch.js";

/**
 * Create the `useApiQuery` and `useApiMutation` hooks for the given API.
 */
export function apiHooks<T extends object>(api: T) {
  type Functions<T> = {
    [P in keyof T]: T[P] extends (...args: any) => any ? T[P] : never;
  };
  type Api = Functions<T>;

  return {
    useApiQuery: query<Api>(api as any),
    useApiMutation: mutation<Api>(api as any),
    useInfiniteApiQuery: infiniteQuery<Api>(api as any),
  };
}
