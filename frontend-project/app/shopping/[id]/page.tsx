"use client";
import {useRouter} from "next/navigation";
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


export default function ProductDetail({
    params,
}: {
    params: Promise<{ id: string }>;
})

 {
    const router = useRouter();
function handleCancel() {
    router.push("/");
}
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        async function getProduct() {
            const { id } = await params;

            const response = await fetch(
                `http://localhost:5000/product/${id}`
            );

            const data = await response.json();

            console.log("PRODUCT:", data);

            setProduct(data);
        }

        getProduct();
    }, []);

    if (!product) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main className=" mt-12 min-h-screen bg-gray-100 p-8">

            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* Product Image */}

                    <div className="flex items-center justify-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-96 object-contain"
                        />
                    </div>


                    {/* Product Information */}

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


                        {/* Price */}

                        <div className="mt-6">

                            <p className="text-3xl font-bold">
                                ₹{product.price}
                            </p>

                            <p className="text-green-600 font-semibold mt-2">
                                {product.discount}% OFF
                            </p>

                        </div>


                        {/* Stock */}

                        <p className="mt-6">
                            <span className="font-semibold">
                                Stock:
                            </span>{" "}
                            {product.stock}
                        </p>


                        {/* Buttons */}

                        <div className="flex gap-4 mt-8">

                            <button className="bg-yellow-500 px-6 py-3 rounded-lg font-semibold"
                             onClick={handleCancel}>
                                Add to Cart
                            </button>

                            <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold">
                                Buy Now
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}