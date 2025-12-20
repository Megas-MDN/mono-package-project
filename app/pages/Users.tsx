import { useEffect, useState } from "react";
import { api } from "../services/api";
import { IUser } from "../types";

export function Users() {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    api.get<{ result: IUser[] }>({ url: "/users" }).then((res) => {
      if (!res.error) setUsers(res.data.result);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="border p-4 rounded shadow bg-white dark:bg-zinc-800">
            <h2 className="text-xl font-semibold">{user.name || "No Name"}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            {user.posts && user.posts.length > 0 && (
              <div className="mt-2 pl-4 border-l-2 border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-1">Posts:</p>
                <ul className="list-disc pl-4">
                  {user.posts.map(post => (
                    <li key={post.id} className="text-sm">{post.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
