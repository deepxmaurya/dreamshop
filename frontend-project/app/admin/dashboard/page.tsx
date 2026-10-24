
"use client";

import { useEffect, useState } from "react";

type AdminData = {
  message?: string;
  admin?: {
    id?: number;
    username?: string;
    email?: string;
    role?: string;
  };
};

const stats = [
  {
    title: "Total Users",
    value: "—",
    icon: "U",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Total Orders",
    value: "—",
    icon: "O",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Total Products",
    value: "—",
    icon: "P",
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Total Sales",
    value: "—",
    icon: "₹",
    color: "bg-emerald-100 text-emerald-700",
  },
];

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminData["admin"]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result: AdminData = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load dashboard"
          );
        }

        setAdmin(result.admin);
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

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
          <p className="mt-4 text-slate-600">
            Loading dashboard...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
            !
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Dashboard Error
          </h1>

          <p className="mt-3 text-slate-600">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-violet-600 px-5 py-2.5 font-semibold text-white hover:bg-violet-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page heading */}
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wider text-violet-600">
            OVERVIEW
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back, {admin?.username || "Admin"}!
            Here is your store overview.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
            {(admin?.username || "A").charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              {admin?.username || "Administrator"}
            </p>
            <p className="text-sm capitalize text-emerald-600">
              {admin?.role || "admin"}
            </p>
          </div>
        </div>
      </header>

      {/* Summary cards */}
      <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">
                {item.title}
              </p>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${item.color}`}
              >
                {item.icon}
              </div>
            </div>

            <h2 className="mt-5 text-3xl font-bold text-slate-900">
              {item.value}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Real database data integration pending
            </p>
          </div>
        ))}
      </section>

      {/* Recent orders */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest customer orders will appear here.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            Awaiting API integration
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">
                  Order ID
                </th>
                <th className="px-6 py-4 font-semibold">
                  Customer
                </th>
                <th className="px-6 py-4 font-semibold">
                  Amount
                </th>
                <th className="px-6 py-4 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-14 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500">
                    ▤
                  </div>

                  <p className="mt-3 font-medium text-slate-700">
                    No order data loaded yet
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Connect your orders API to display recent orders.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* API connection information */}
      <section className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-5 sm:p-6">
        <h2 className="font-semibold text-violet-950">
          Dashboard is connected
        </h2>

        <p className="mt-2 text-sm leading-6 text-violet-800">
          Admin account information is loaded from your protected
          dashboard endpoint. User totals, order totals, product
          totals and sales will display real values after their
          backend APIs are connected.
        </p>
      </section>
    </div>
  );
}
