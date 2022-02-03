import { useQuery, useQueryClient, UseQueryOptions } from "react-query";
import { Updater } from "react-query/types/core/utils";

export function query<Api extends Record<string, (...args: any) => any>>(
  api: Api
) {
  /**
   * React hook to call an API method via React Query
   */
  return function useApiQuery<
    T extends keyof Api,
    TQueryFnData = ReturnType<Api[T]>,
    TData = Awaited<TQueryFnData>
  >(
    opts: T | (UseQueryOptions<TData> & { method: T }),
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
    const queryFn = () => apiFn(...args);
    const result = useQuery<TQueryFnData, Error, TData>({
      queryKey,
      queryFn,
      ...(queryOpts as any),
    });
    const queryClient = useQueryClient();
    return {
      ...result,
      queryKey,
      update: (updater: Updater<TData | undefined, TData>) => {
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
