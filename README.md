# react-api-query

Hooks to use [react-query](https://react-query.tanstack.com/) with a typed API client.

This library has been written with [oazapfts](https://npmjs.com/package/oazapfts) in mind – a utility to create TypeScript clients from OpenAPI specs, but works with any kind of typed client interfaces.

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

# License

MIT
