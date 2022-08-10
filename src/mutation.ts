import {
  defaultContext,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

export function mutation<Api extends { [k: string]: (...args: any) => any }>(
  api: Api
) {
  type ApiKey = string & keyof Api;
  type ApiArgs<T extends ApiKey> = Parameters<Api[T]>;
  type ApiResult<T extends ApiKey> = ReturnType<Api[T]>;
  type ApiData<T extends ApiKey> = Awaited<ApiResult<T>>;

  type ApiMutation<T extends ApiKey> = ((...args: ApiArgs<T>) => ApiResult<T>) &
    Omit<
      UseMutationResult<ApiData<T>, Error, ApiArgs<T>>,
      "mutate" | "mutateAsync"
    >;

  type MutationOpts<T extends ApiKey> = Omit<
    UseMutationOptions<ApiData<T>, Error, ApiArgs<T>>,
    "mutationFn" | "mutationKey"
  >;

  /**
   *
   */
  return function useApiMutation<T extends ApiKey>(
    method: T,
    opts: MutationOpts<T> = {}
  ) {
    const mutationKey = [method];

    const mutationFn: (vars: ApiArgs<T>) => Promise<ApiData<T>> = async (
      vars
    ) => api[method].apply(api, vars);

    const { mutate, mutateAsync, ...mutation } = useMutation<
      ApiData<T>,
      Error,
      ApiArgs<T>
    >(mutationKey, mutationFn, { context: defaultContext, ...opts });

    const fn = async (...args: ApiArgs<T>) => mutateAsync(args);
    Object.assign(fn, mutation);
    return fn as ApiMutation<T>;
  };
}
