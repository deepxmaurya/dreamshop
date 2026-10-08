"use client";

import { FormEvent, useState } from "react";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");

    async function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const response = await fetch("http://localhost:5000/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
                role,
            }),
        });

        const data = await response.json();

        console.log(data);
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-md bg-black p-8 rounded-xl shadow-md">

                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    Create Account
                </h1>

                <form onSubmit={handleRegister}>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-white">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            placeholder="Enter username"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-medium text-white">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-white"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-white">
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={(event) =>
                                setRole(event.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-white"
                        >
                            <option className="bg-black" value="user">User</option>
                            <option className="bg-black" value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                        Create Account
                    </button>

                </form>

            </div>
        </main>
    );
}