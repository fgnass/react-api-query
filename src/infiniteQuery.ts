import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

import type { Updater } from "@tanstack/react-query";

export function infiniteQuery<
  Api extends Record<string, (...args: any) => any>
>(api: Api) {
  /**
   * React hook to call an API method via React Query.
   */
  return function useInfiniteApiQuery<
    T extends keyof Api,
    TQueryFnData = ReturnType<Api[T]>,
    TData = Awaited<TQueryFnData>
  >(
    opts: T | (UseInfiniteQueryOptions<TData> & { method: T }),
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
    const result = useInfiniteQuery<TQueryFnData, Error, TData>({
      queryKey,
      queryFn,
      ...(queryOpts as any),
    });
    const queryClient = useQueryClient();
    return {
      ...result,
      queryKey,
      update: (
        updater: Updater<
          InfiniteData<TData> | undefined,
          InfiniteData<TData> | undefined
        >
      ) => {
        queryClient.setQueryData(queryKey, updater);
      },
      invalidate: () => {
        queryClient.invalidateQueries(queryKey);
      },
      removeQuery: () => {
        queryClient.removeQueries(queryKey);
      },
    };
  };
}
