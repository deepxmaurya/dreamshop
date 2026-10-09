"use client";

import { useEffect, useState } from "react";

type CartProduct = {
    cart_id: number;
    product_id: number;
    name: string;
    image: string;
    price: string;
    discount: string;
    quantity: number;
};

export default function Cart() {
    const [cart, setCart] = useState<CartProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCart() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/cart`,
                    {
                        credentials: "include",
                    }
                );

                const data = await response.json();

                console.log("CART DATA:", data);

                setCart(data);
            } catch (error) {
                console.error("Cart error:", error);
            } finally {
                setLoading(false);
            }
        }

        getCart();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>Loading cart...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold mb-8">
                Shopping Cart
            </h1>

            <div className="max-w-5xl mx-auto">

                {cart.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center">
                        <h2 className="text-2xl font-bold">
                            Your cart is empty
                        </h2>
                    </div>
                ) : (

                    <div className="space-y-4">

                        {cart.map((item) => (

                            <div
                                key={item.cart_id}
                                className="bg-white rounded-xl shadow-md p-5 flex gap-6"
                            >

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-32 h-32 object-contain"
                                />

                                <div className="flex-1">

                                    <h2 className="text-xl font-bold">
                                        {item.name}
                                    </h2>

                                    <p className="text-lg mt-2">
                                        ₹{item.price}
                                    </p>

                                    <p className="text-green-600">
                                        {item.discount}% OFF
                                    </p>

                                    <p className="mt-3">
                                        Quantity: {item.quantity}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}