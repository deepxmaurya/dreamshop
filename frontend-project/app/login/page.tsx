"use client";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function LoginPage() {
    const router = useRouter(); 
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
      
        setMessage("");
        setLoading(true);

        console.log("Login button clicked");

        try {
             
            const response = await fetch(
                "http://localhost:5000/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            console.log("Response status:", response.status);

            const data = await response.json();

            console.log("Backend response:", data);

            if (!response.ok) {
                setMessage(data.message ||"Login failed");
                return;
            }

            setMessage(data.message || "Login successful");
          router.push("/");
        } catch (error) {
            console.error("Login error:", error);

            setMessage(
                "Server se connection nahi ho raha"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <div
                style={{
                    width: "350px",
                    padding: "30px",
                    border: "1px solid #ddd",
                    borderRadius: "10px"
                }}
            >
                <h1>Login</h1>

                <form onSubmit={handleLogin}>

                    <div style={{ marginBottom: "15px" }}>
                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter username"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />
                    </div>


                    <div style={{ marginBottom: "15px" }}>
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px"
                            }}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "10px",
                            cursor: "pointer"
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>


                {message && (
                    <p
                        style={{
                            marginTop: "20px",
                            fontWeight: "bold"
                        }}
                    >
                        {message}
                    </p>
                )}

            </div>
        </main>
    );
}