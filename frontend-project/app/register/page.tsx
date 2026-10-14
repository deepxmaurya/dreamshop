
"use client";

import { FormEvent, useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMessage("");
        setMessageType("");
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        role: "user",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || data.error || "Registration failed!");
                setMessageType("error");
                return;
            }

            setMessage(data.message || "Registration successful!");
            setMessageType("success");

            setUsername("");
            setPassword("");
        } catch (error) {
            console.error("Registration error:", error);
            setMessage("Server se connect nahi ho paya!");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-black p-8 rounded-xl shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    Create Account
                </h1>

                {message && (
                    <p
                        role="status"
                        aria-live="polite"
                        className={`mb-4 rounded-lg p-3 text-center ${
                            messageType === "success"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {message}
                    </p>
                )}

                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-white">
                            Username
                        </label>

                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Enter username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-white"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-white">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
            </div>
        </main>
    );
}