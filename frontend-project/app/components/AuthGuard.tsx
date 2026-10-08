"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
    children: ReactNode;
};

export default function AuthGuard({
    children
}: AuthGuardProps) {

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {

        const checkLogin = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/users/me",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    router.replace("/login");
                    return;
                }

                setAuthenticated(true);

            } catch (error) {

                console.error(
                    "Authentication check failed:",
                    error
                );

                router.replace("/login");

            } finally {

                setLoading(false);

            }
        };

        checkLogin();

    }, [router]);


    if (loading) {
        return <p>Checking login...</p>;
    }


    if (!authenticated) {
        return null;
    }


    return <>{children}</>;
}