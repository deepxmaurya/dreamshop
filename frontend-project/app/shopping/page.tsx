"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
type Product = {
    id: number;
    image: string;
    price: string;
    discount: string;
};

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function getProducts() {
            try {
                const response = await fetch("http://localhost:5000/product");

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

    return (
        <main className="min-h-screen bg-gray-100 p-8">

            <h1 className="mt-12 text-3xl font-bold mb-8 text-center">
                Products
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols- gap-6">

                {products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-md p-4"
                    >
                        <Link
                             href={`/shopping/${product.id}`}
                            className="bg-white rounded-xl shadow-md p-4 block"
                         >

                        <img
                            src={product.image}
                            alt="Product"
                            className="w-full h-52 object-contain"
                        />

                        <p className="text-xl font-bold mt-4">
                            ₹{product.price}
                        </p>

                        <p className="text-green-600 font-semibold mt-2">
                            {product.discount}% OFF
                        </p>
                       </Link>
                    </div>
                ))}

            </div>

        </main>
    );
}