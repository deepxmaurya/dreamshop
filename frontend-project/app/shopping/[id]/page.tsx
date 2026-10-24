
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Product = {
    id: number;
    name: string;
    image: string;
    price: string;
    discount: string;
    description: string;
    category: string;
    stock: number;
};

type CartItem = Product & {
    quantity: number;
};

export default function ProductDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getProduct() {
            try {
                const { id } = await params;

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
                );

                if (!response.ok) {
                    throw new Error("Product load nahi hua");
                }

                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error("Product error:", error);
                setMessage("Product load nahi ho paya.");
            }
        }

        getProduct();
    }, [params]);

    function addToCart() {
        if (!product) return;

        if (product.stock < 1) {
            setMessage("Ye product abhi stock mein nahi hai.");
            return;
        }

        try {
            const savedCart = localStorage.getItem("cart");
            const cart: CartItem[] = savedCart
                ? JSON.parse(savedCart)
                : [];

            const existingItem = cart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    setMessage("Available stock se zyada quantity nahi le sakte.");
                    return;
                }

                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1,
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            setMessage("Product Cart mein add ho gaya!");
        } catch (error) {
            console.error("Cart error:", error);
            setMessage("Cart mein product add nahi ho paya.");
        }
    }

    function buyNow() {
        if (!product) return;

        if (product.stock < 1) {
            setMessage("Ye product abhi stock mein nahi hai.");
            return;
        }

        try {
            const savedCart = localStorage.getItem("cart");
            const cart: CartItem[] = savedCart
                ? JSON.parse(savedCart)
                : [];

            const existingItem = cart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    setMessage("Available stock se zyada quantity nahi le sakte.");
                    return;
                }

                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1,
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            router.push("/cart");
        } catch (error) {
            console.error("Cart error:", error);
            setMessage("Cart mein product add nahi ho paya.");
        }
    }

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>{message || "Loading..."}</p>
            </main>
        );
    }

    return (
        <main className="mt-12 min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="flex items-center justify-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-96 object-contain"
                        />
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">
                            {product.category}
                        </p>

                        <h1 className="text-3xl font-bold mt-2">
                            {product.name}
                        </h1>

                        <p className="text-gray-600 mt-6">
                            {product.description}
                        </p>

                        <div className="mt-6">
                            <p className="text-3xl font-bold">
                                ₹{product.price}
                            </p>

                            <p className="text-green-600 font-semibold mt-2">
                                {product.discount}% OFF
                            </p>
                        </div>

                        <p className="mt-6">
                            <span className="font-semibold">Stock:</span>{" "}
                            {product.stock}
                        </p>

                        {message && (
                            <p className="mt-4 text-blue-700 font-medium">
                                {message}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-4 mt-8">
                            <button
                                onClick={addToCart}
                                disabled={product.stock < 1}
                                className="bg-yellow-500 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={buyNow}
                                disabled={product.stock < 1}
                                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
