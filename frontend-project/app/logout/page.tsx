"use client";

import { useRouter } from "next/navigation";

export default function Logout() {
    const router = useRouter();
    
     function handleCancel() {
    router.push("/");
}


    async function handleLogout() {
        await fetch(
        "http://localhost:5000/users/logout",
        {
            method: "POST",
            credentials: "include"
        }
    );

    router.push("/login");
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">
                    Logout
                </h1>

                <p className="mb-6">
                    Kya aap logout karna chahte hain?
                </p>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    Logout
                </button>
                <button
                    onClick={handleCancel}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                    cancle
                </button>
            </div>
        </main>
    );
}