# 💮 react-api-query

Hooks to use [react-query](https://react-query.tanstack.com/) with a typed API client.

## More types, less typing!

Assume you have a an API like this:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

const client = {
  async getUsers() {
    const res = await fetch("/api/users");
    return (await res.json()) as User[];
  },

  async deleteUser(id: number) {
    await fetch(`/api/users/${id}`, { method: "DELETE" });
  },
};
```

Using this with [react-query](https://react-query.tanstack.com/) now becomes as easy as this:

```tsx
import reactApiQuery from "react-api-query";

const { useApiQuery, useApiMutation } = reactApiQuery(client);

function Users() {
  const query = useApiQuery("getUsers");
  const deleteUser = useApiMutation("deleteUser");
  if (query.isLoading) return <div>Loading...</div>;
  return (
    <ul>
      {query.data.map((user) => (
        <li key={user.id}>
          {user.name}
          <button
            disabled={deleteUser.isLoading}
            onClick={() => deleteUser(user.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

**Note:** The query-keys are generated from the name of the API method you are calling and the arguments you pass.

# Docs

## `useApiQuery(method | opts, ...args)`

Wrapper around [useQuery](https://react-query.tanstack.com/reference/useQuery) where you don't need to provide a query key nor a query function. Instead you pass the the name of one of your API methods and
the arguments your API expects.

If you don't need to provide any further query options
you can pass the method name as string.

Otherwise you can pass an object that takes the same options as [useQuery](https://react-query.tanstack.com/reference/useQuery) with an additional `method` property:

```ts
useApiQuery({ method: "getUsers", staleTime: 1000 });
```

### Returns

The return value is the same as with [useQuery](https://react-query.tanstack.com/reference/useQuery) but provides the following additional methods for convenience:

#### `update(updater)`

Shortcut for calling `queryClient.setQueryData(queryKey, updater)`

#### `invalidate()`

Shortcut for calling `queryClient.invalidateQuerie(queryKey)`

#### `removeQuery()`

Shortcut for calling `queryClient.removeQueries(queryKey)`

## `useApiMutation(method, opts)`

Wrapper around [useMutation](https://react-query.tanstack.com/reference/useMutation) where you don't need to provide a mutation key nor a mutation function. Instead you pass the the name of one of your API methods.

### Returns

The return value is an async function that calls `mutateAsync` under the hood and returns its promise.

While the result is a function it still has all the return values of [useMutation](https://react-query.tanstack.com/reference/useMutation) mixed in, like `isLoading` or `isError`:

```tsx
const deleteUser = useApiMutation("deleteUser");
return (
  <button disabled={deleteUser.isLoading} onClick={() => deleteUser(user.id)}>
    Delete
  </button>
);
```

# Note

This library has been written with [oazapfts](https://npmjs.com/package/oazapfts) in mind – a utility to create TypeScript clients from OpenAPI specs, but works with any kind of typed client interfaces.

# License

MIT
