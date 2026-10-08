import Link from "next/link";
import AuthGuard from "./components/AuthGuard";
export default async function Home() {
    const response = await fetch("http://localhost:5000/users");
    const users = await response.json();

    return (
          <AuthGuard>
        <main className="min-h-screen bg-gray-100 p-3">
            <h1 className="mt-15 text-5xl font-bold text-center bg-black text-white">
                Users
            </h1>

            <div className=" mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user: any) => {
                    return (
                        <div
                            key={user.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                        >
                            <img
                                src={user.image}
                                alt={user.username}
                                className="w-full h-70 object-cover"
                            />

                            <div className="p-4">
                                <h2 className="text-xl font-bold">
                                    {user.username}
                                </h2>

                                <p className="mt-2">
                                    ID: {user.id}
                                </p>

                                <p>
                                    Role: {user.role}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
        </AuthGuard>
    );
}