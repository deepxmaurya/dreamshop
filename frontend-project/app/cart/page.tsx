
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartProduct = {
    id: number;
    name: string;
    image: string;
    price: string;
    discount: string;
    quantity: number;
    stock: number;
};

export default function Cart() {
    const router = useRouter();

    const [cart, setCart] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("cart");
            const data: CartProduct[] = savedCart
                ? JSON.parse(savedCart)
                : [];

            setCart(data);
        } catch (error) {
            console.error("Cart error:", error);
            setMessage("Cart load nahi ho paya.");
        } finally {
            setLoading(false);
        }
    }, []);

    function updateCart(updatedCart: CartProduct[]) {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setMessage("");
    }

    function changeQuantity(id: number, change: number) {
        const updatedCart = cart.map((item) => {
            if (item.id !== id) return item;

            const newQuantity = item.quantity + change;

            if (newQuantity < 1 || newQuantity > item.stock) {
                return item;
            }

            return { ...item, quantity: newQuantity };
        });

        updateCart(updatedCart);
    }

    function removeItem(id: number) {
        const updatedCart = cart.filter((item) => item.id !== id);
        updateCart(updatedCart);
    }

    async function placeOrder() {
        if (cart.length === 0) {
            setMessage("Cart empty hai.");
            return;
        }

        setPlacingOrder(true);
        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items: cart.map((item) => ({
                            product_id: item.id,
                            quantity: item.quantity,
                        })),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Order place nahi ho paya."
                );
                return;
            }

            localStorage.removeItem("cart");
            setCart([]);
            router.push("/dashboard");
        } catch (error) {
            console.error("Checkout error:", error);
            setMessage(
                "Server se connect nahi ho paya. Backend check karo."
            );
        } finally {
            setPlacingOrder(false);
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>Loading cart...</p>
            </main>
        );
    }

    const total = cart.reduce((sum, item) => {
        const price = Number(item.price);
        const discount = Number(item.discount);
        const finalPrice = price * (1 - discount / 100);

        return sum + finalPrice * item.quantity;
    }, 0);

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 mt-10 ">
                    Shopping Cart
                </h1>

                {message && (
                    <p className="bg-white text-red-600 p-4 rounded-lg mb-5">
                        {message}
                    </p>
                )}

                {cart.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center">
                        <h2 className="text-2xl font-bold">
                            Your cart is empty
                        </h2>

                        <button
                            onClick={() => router.push("/shopping")}
                            className="mt-5 bg-yellow-500 px-6 py-3 rounded-lg font-semibold"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-xl shadow-md p-5 flex gap-5"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-28 h-28 object-contain"
                                    />

                                    <div className="flex-1">
                                        <h2 className="text-xl font-bold">
                                            {item.name}
                                        </h2>

                                        <p className="mt-2">
                                            Price: ₹{item.price}
                                        </p>

                                        <p className="text-green-600">
                                            {item.discount}% OFF
                                        </p>

                                        <div className="flex items-center gap-3 mt-3">
                                            <button
                                                onClick={() =>
                                                    changeQuantity(item.id, -1)
                                                }
                                                disabled={item.quantity <= 1}
                                                className="border rounded px-3 py-1 disabled:opacity-40"
                                            >
                                                -
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                onClick={() =>
                                                    changeQuantity(item.id, 1)
                                                }
                                                disabled={
                                                    item.quantity >= item.stock
                                                }
                                                className="border rounded px-3 py-1 disabled:opacity-40"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 mt-3"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
                            <h2 className="text-xl font-bold">
                                Order Summary
                            </h2>

                            <p className="mt-5">
                                Items:{" "}
                                {cart.reduce(
                                    (sum, item) => sum + item.quantity,
                                    0
                                )}
                            </p>

                            <p className="text-2xl font-bold mt-4">
                                Total: ₹{total.toFixed(2)}
                            </p>

                            <p className="text-sm text-gray-500 mt-2">
                                Final price and stock will be checked by the server.
                            </p>

                            <button
                                onClick={placeOrder}
                                disabled={placingOrder || cart.length === 0}
                                className="w-full bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold mt-6 disabled:opacity-50"
                            >
                                {placingOrder
                                    ? "Placing Order..."
                                    : "Place Order"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
