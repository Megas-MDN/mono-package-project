import { useEffect, useState } from "react";
import { api } from "../services/api";
import { IPost } from "../types";

export function Posts() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    api.get<{ result: IPost[] }>({ url: "/posts" }).then((res) => {
      if (!res.error) setPosts(res.data.result);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow bg-white dark:bg-zinc-800">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="mb-2 text-gray-700 dark:text-gray-300">{post.content}</p>
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                    {post.author ? `By: ${post.author.name || post.author.email}` : `Author ID: ${post.authorId}`}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {post.published ? 'Published' : 'Draft'}
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
