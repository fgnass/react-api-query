import { FetchQueryOptions, QueryClient } from "@tanstack/react-query";

/**
 * Create a `prefetch` function for the given API.
 */
export function prefetching<Api extends Record<string, (...args: any) => any>>(
  api: Api,
  queryClient: QueryClient
) {
  /**
   * Prefetch data.
   */
  return function prefetch<
    T extends keyof Api,
    TQueryFnData = ReturnType<Api[T]>,
    TData = Awaited<TQueryFnData>
  >(
    opts: T | (FetchQueryOptions<TQueryFnData, unknown, TData> & { method: T }),
    ...args: Parameters<Api[T]>
  ) {
    if (typeof opts !== "object") {
      opts = { method: opts };
    }
    const { method, ...queryOpts } = opts;
    const queryKey = [method, ...args] as const;
    const apiFn: (...args: Parameters<Api[T]>) => TQueryFnData = api[
      method
    ] as any;
    const queryFn = () => apiFn.apply(api, args);
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      ...queryOpts,
    });
  };
}
