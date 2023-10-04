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
  >(method: T, opts: UseInfiniteQueryOptions<TData>) {
    const queryKey = [method] as const;
    const queryFn = api[method];
    const result = useInfiniteQuery<TQueryFnData, Error, TData>({
      queryKey,
      queryFn,
      ...(opts as any),
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
