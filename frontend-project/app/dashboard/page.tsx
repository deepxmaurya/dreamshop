"use client";

import { useEffect, useState } from "react";

type OrderItem = {
  product_id: number;
  name: string | null;
  image: string | null;
  quantity: number;
  price: string | number;
};

type Order = {
  id: number;
  total_amount: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

type DashboardData = {
  user: {
    id: number;
    username: string;
    role: string;
  };
  orders: Order[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);

  const fetchDashboard = async () => {
    const response = await fetch(`${API_URL}/users/dashboard`, {
      method: "GET",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Dashboard data load nahi hua");
    }

    setData(result);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await fetchDashboard();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Kuch galat ho gaya"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      `Kya aap Order #${orderId} cancel karna chahte hain?`
    );

    if (!confirmed) return;

    setBusyOrderId(orderId);
    setActionError("");

    try {
      const response = await fetch(
        `${API_URL}/orders/${orderId}/cancel`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Order cancel nahi hua");
      }

      await fetchDashboard();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Order cancel nahi hua"
      );
    } finally {
      setBusyOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      `Kya aap Cancelled Order #${orderId} ko Dashboard se delete karna chahte hain?`
    );

    if (!confirmed) return;

    setBusyOrderId(orderId);
    setActionError("");

    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Order delete nahi hua");
      }

      setData((previous) =>
        previous
          ? {
              ...previous,
              orders: previous.orders.filter(
                (order) => order.id !== orderId
              ),
            }
          : previous
      );
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Order delete nahi hua"
      );
    } finally {
      setBusyOrderId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Dashboard loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-3">
          Dashboard load nahi hua
        </h1>
        <p className="text-red-600">{error}</p>
        <p className="mt-3 text-sm text-gray-600">
          Login check karo aur dobara try karo.
        </p>
      </main>
    );
  }

  if (!data) {
    return <p className="p-6">Dashboard data nahi mila.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mt-10">
          My Dashboard
        </h1>

        <section className="bg-white rounded-xl shadow-sm p-5 mt-6">
          <h2 className="text-xl font-semibold">
            Welcome, {data.user.username}!
          </h2>

          <p className="text-gray-600 mt-2">User ID: {data.user.id}</p>
          <p className="text-gray-600">Role: {data.user.role}</p>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>

          {actionError && (
            <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-700">
              {actionError}
            </p>
          )}

          {data.orders.length === 0 ? (
            <div className="bg-white rounded-xl p-8 mt-4 text-center">
              <p className="text-gray-600">
                Abhi tak koi order nahi hai.
              </p>
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              {data.orders.map((order) => (
                <article
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm p-5"
                >
                  <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
                    <div>
                      <h3 className="text-lg font-bold">
                        Order #{order.id}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <span
                      className={`h-fit rounded-full px-3 py-1 text-sm font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="divide-y">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${item.product_id}-${index}`}
                        className="flex flex-col sm:flex-row gap-4 py-4"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            className="w-24 h-24 object-contain rounded-lg border bg-white"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                            No image
                          </div>
                        )}

                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {item.name || "Unnamed product"}
                          </h4>

                          <p className="text-sm text-gray-600 mt-1">
                            Product ID: {item.product_id}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            Quantity: {item.quantity}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            Price per item: ₹
                            {Number(item.price).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <p className="font-bold sm:text-right">
                          ₹
                          {(Number(item.price) * item.quantity).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex flex-wrap justify-between items-center gap-3">
                    <span className="font-semibold">Order Total</span>

                    <span className="text-xl font-bold">
                      ₹
                      {Number(order.total_amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {order.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={busyOrderId === order.id}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busyOrderId === order.id
                          ? "Please wait..."
                          : "Cancel Order"}
                      </button>
                    )}

                    {order.status === "Cancelled" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={busyOrderId === order.id}
                        className="rounded-lg bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {busyOrderId === order.id
                          ? "Please wait..."
                          : "Delete Order"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}