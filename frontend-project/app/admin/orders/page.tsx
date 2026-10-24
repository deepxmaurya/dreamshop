
"use client";

import { useEffect, useState } from "react";

type Order = {
    id: number;
    user_id: number;
    customer_name: string;
    total_amount: string;
    status: "Pending" | "Delivered" | "Cancelled";
    created_at: string;
};

type Summary = {
    total_orders: number;
    pending_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [summary, setSummary] = useState<Summary>({
        total_orders: 0,
        pending_orders: 0,
        delivered_orders: 0,
        cancelled_orders: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [ordersResponse, summaryResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/orders`, {
                            credentials: "include",
                        }),
                        fetch(`${API_URL}/orders/summary`, {
                            credentials: "include",
                        }),
                    ]);

                if (!ordersResponse.ok || !summaryResponse.ok) {
                    throw new Error("Only admin can access.");
                }

                const ordersData = await ordersResponse.json();
                const summaryData = await summaryResponse.json();

                setOrders(ordersData.orders);
                setSummary(summaryData.summary);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            String(order.id).includes(search) ||
            order.customer_name
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });

    return (
        <main className="space-y-6 p-4 md:p-6">
            <div>
                <h1 className="text-2xl font-bold">Orders Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage all customer orders
                </p>
            </div>

            {error && (
                <p className="rounded-lg bg-red-100 p-3 text-red-700">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Total Orders",
                        value: summary.total_orders,
                    },
                    {
                        label: "Pending",
                        value: summary.pending_orders,
                    },
                    {
                        label: "Delivered",
                        value: summary.delivered_orders,
                    },
                    {
                        label: "Cancelled",
                        value: summary.cancelled_orders,
                    },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="rounded-xl border bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">
                            {item.label}
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                            {loading ? "..." : item.value}
                        </p>
                    </div>
                ))}
            </div>

            <section className="rounded-xl border bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold">
                    All Orders
                </h2>

                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="search"
                        placeholder="Search order ID or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="rounded-lg border px-3 py-2"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {loading ? (
                    <p className="py-8 text-center">
                        Loading orders...
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    <th className="p-3">Order ID</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="p-3 font-medium">
                                            #{order.id}
                                        </td>
                                        <td className="p-3">
                                            {order.customer_name}
                                        </td>
                                        <td className="p-3">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="p-3">
                                            ₹
                                            {Number(
                                                order.total_amount
                                            ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    order.status === "Delivered"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status === "Pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-8 text-center text-gray-500"
                                        >
                                            No orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
