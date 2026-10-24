
"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Users load nahi hue"
          );
        }

        const userList = Array.isArray(result)
          ? result
          : result.users;

        if (!Array.isArray(userList)) {
          throw new Error("API ne users ki list return nahi ki");
        }

        setUsers(userList);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const customerCount = users.filter(
    (user) => user.role === "customer"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 p-5 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              DREAMSHOP ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Users Management
            </h1>

            <p className="mt-2 text-slate-500">
              Manage your registered users.
            </p>
          </div>

          <a
            href="/admin/dashboard"
            className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </a>
        </header>

        <section className="mb-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Users
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {loading ? "..." : users.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Administrators
            </p>
            <h2 className="mt-3 text-3xl font-bold text-indigo-600">
              {loading ? "..." : adminCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Customers
            </p>
            <h2 className="mt-3 text-3xl font-bold text-emerald-600">
              {loading ? "..." : customerCount}
            </h2>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Registered Users
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Users stored in your register table.
            </p>
          </div>

          {loading ? (
            <p className="p-8 text-slate-500">
              Loading users...
            </p>
          ) : error ? (
            <div className="p-6">
              <p className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">
                      ID
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Username
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-600">
                        {user.id}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {user.username}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No registered users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
