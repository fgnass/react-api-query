# 🌸 react-api-query

React hooks to use [TanStack Query](https://tanstack.com/query/v4) with a typed API client.

- 🛡️ 100% Type-safe
- 🕵️ IDE autocompletion
- 🍃 Tiny footprint and no dependencies
- 💕 Perfect match for typed [OpenAPI](https://npmjs.com/package/oazapfts) or [JSON-RPC](https://npmjs.com/package/typed-rpc)

## More types, less typing!

Assume you have an API like this:

```ts
const api = {
  async getUser(id: number) {
    const res = await fetch(`/api/users/${id}`);
    return (await res.json()) as User;
  },

  async deleteUser(id: number) {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
  },
};

interface User {
  id: number;
  name: string;
  email: string;
}
```

Using this with [react-query](https://tanstack.com/query/v4) now becomes as easy as this:

```tsx
import { apiHooks } from "react-api-query";
import api from "./api"; // Your typed API client

// Create React hooks for your API
const { useApiQuery, useApiMutation } = apiHooks(api);

function User({ id: number }: Props) {
  const query = useApiQuery("getUser", id);
  const deleteUser = useApiMutation("deleteUser");

  if (query.isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user.name}
      <button
        disabled={deleteUser.isLoading}
        onClick={() => deleteUser(user.id)}
      >
        Delete
      </button>
    </div>
  );
}
```

**Note:** The query-keys are generated from the name of the API method you are calling and the arguments you pass.

# Installation

```
npm install @tanstack/react-query react-api-query
```

> **Note**
> Since V2, the module is published as ESM-only.

You can play with a live example over at StackBlitz:

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/typed-rpc-nextjs)

# API

The hooks are just thin wrappers around their counterparts in React Query. Head over to the [official docs](https://tanstack.com/query/v4/docs/adapters/react-query) for a deep dive.

## `useApiQuery(method | opts, ...args)`

Wrapper around [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery) where you don't need to provide a query key nor a query function. Instead, you pass the name of one of your API methods and the arguments your API expects.

If you don't need to provide any further query options you can pass the method name as string.

Otherwise, you can pass an object that takes the same options as [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery) with an additional `method` property:

```ts
useApiQuery({ method: "getUser", staleTime: 1000 }, 42);
```

This will call `api.getUser(42)`. Of course all these arguments are properly typed, so you will get the correct autocompletion in your IDE.

### Returns

The return value is the same as with [useQuery](https://tanstack.com/query/v4/docs/reference/useQuery), but provides the following additional methods for convenience:

#### `update(updater)`

Shortcut for calling `queryClient.setQueryData(queryKey, updater)`

#### `invalidate()`

Shortcut for calling `queryClient.invalidateQueries(queryKey)`

#### `removeQuery()`

Shortcut for calling `queryClient.removeQueries(queryKey)`

## `useApiMutation(method, opts)`

Wrapper around [useMutation](https://react-query.tanstack.com/reference/useMutation) where you don't need to provide a mutation key nor a mutation function. Instead, you pass the name of one of your API methods.

### Returns

The return value is an async function that calls `mutateAsync` under the hood and returns its promise.

While the result is a function, it still has all the return values of [useMutation](https://tanstack.com/query/v4/docs/reference/useMutation) mixed in, like `isLoading` or `isError`:

```tsx
const deleteUser = useApiMutation("deleteUser");
return (
  <button disabled={deleteUser.isLoading} onClick={() => deleteUser(user.id)}>
    Delete
  </button>
);
```

# Prefetching

You can also create a `prefetch` method to pre-populate data outside of your React components, for example inside your router:

```ts
import { prefetching } from "react-api-query";
import { api } from "./api";

const queryClient = new QueryClient();
const prefetch = prefetching(api, queryClient);

// A fictive loader function
async function loader(params) {
  await prefetch("getUser", params.id);
}
```

# License

MIT
