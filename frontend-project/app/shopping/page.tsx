"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function Products() {
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        async function getProducts() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/product`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data: Product[] = await response.json();

                console.log("API DATA:", data);

                setProducts(data);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        getProducts();
    }, []);

    function addToCart(product: Product) {
        if (product.stock < 1) {
            setMessage(`${product.name} stock mein nahi hai.`);
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
            setMessage(`${product.name} Cart mein add ho gaya!`);
        } catch (error) {
            console.error("Cart error:", error);
            setMessage("Cart mein product add nahi ho paya.");
        }
    }

    function buyNow(product: Product) {
        if (product.stock < 1) {
            setMessage(`${product.name} stock mein nahi hai.`);
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

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <h1 className="mt-12 text-3xl font-bold mb-8 text-center">
                Products
            </h1>

            {message && (
                <p className="text-center text-blue-700 font-semibold mb-6">
                    {message}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md p-4"
                    >
                        <Link
                            href={`/shopping/${product.id}`}
                            className="block"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-52 object-contain"
                            />

                            <h2 className="text-lg font-semibold mt-4">
                                {product.name}
                            </h2>

                            <p className="text-xl font-bold mt-2">
                                ₹{product.price}
                            </p>

                            <p className="text-green-600 font-semibold mt-2">
                                {product.discount}% OFF
                            </p>
                        </Link>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock < 1}
                                className="bg-yellow-500 px-3 py-2 rounded-lg font-semibold disabled:opacity-50"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={() => buyNow(product)}
                                disabled={product.stock < 1}
                                className="bg-orange-600 text-white px-3 py-2 rounded-lg font-semibold disabled:opacity-50"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}