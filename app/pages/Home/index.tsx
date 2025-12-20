import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string | null;
}

export const HomePage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ result: IUser[]; totalCount: number }>({
        url: "/user",
      });
      setUsers(response.data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.post<IUser>({
        url: "/user",
        data: formData,
      });

      setUsers((prev) => [...prev, response.data]);
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-3xl font-bold text-violet-700">User Management</h1>

        <button
          onClick={() => navigate("/chat")}
          className="bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2 rounded-md shadow-sm transition active:scale-95"
        >
          💬 Chat
        </button>
      </div>

      {/* Formulário de criação */}
      <form
        onSubmit={createNewUser}
        className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Create New User - Karla "👩🏻 ‍💻"
        </h2>
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-violet-300"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-violet-300"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-violet-300"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-violet-600 text-white py-2 rounded-md hover:bg-violet-700 transition"
        >
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </form>

      {/* Lista de usuários */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Users</h2>
      {isLoading && users && users.length === 0 ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users && users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users &&
            users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-violet-700">
                  {user.name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>ID: {user.id}</p>
                  <p>
                    Created:{" "}
                    {new Date(user.createdAt).toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                  <p>
                    Updated:{" "}
                    {new Date(user.updatedAt).toLocaleString("en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                  {user.deletedAt && (
                    <p className="text-red-500">
                      Deleted:{" "}
                      {new Date(user.deletedAt).toLocaleString("en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
