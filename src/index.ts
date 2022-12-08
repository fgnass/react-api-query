import { mutation } from "./mutation.js";
import { query } from "./query.js";

export function apiHooks<T extends object>(api: T) {
  type Functions<T> = {
    [P in keyof T]: T[P] extends (...args: any) => any ? T[P] : never;
  };
  type Api = Functions<T>;

  return {
    useApiQuery: query<Api>(api as any),
    useApiMutation: mutation<Api>(api as any),
  };
}
