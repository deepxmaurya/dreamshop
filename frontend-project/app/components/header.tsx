"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {

    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {

        function handleScroll() {

            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                // Neeche scroll kar rahe hain
                setShowHeader(false);
            } else {
                // Upar scroll kar rahe hain
                setShowHeader(true);
            }

            setLastScrollY(currentScrollY);
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, [lastScrollY]);


    return (
        <header
            className={`
                fixed top-0 left-0 w-full z-50
                bg-black shadow-md
                transition-transform duration-300
                ${showHeader ? "translate-y-0" : "-translate-y-full"}
            `}
        >

            <nav className="flex items-center justify-between px-8 py-4">

                <h1 className="text-2xl font-bold text-red-400">
                    My Website
                </h1>

                <div className="flex gap-6 text-white">

                    <Link
                        className="hover:text-blue-400"
                        href="/register"
                    >
                        Register
                    </Link>

                    <Link
                        className="hover:text-blue-400"
                        href="/"
                    >
                        Home
                    </Link>

                    <Link
                        className="hover:text-blue-400"
                        href="/about"
                    >
                        About
                    </Link>

                    <Link
                        className="hover:text-blue-400"
                        href="/login"
                    >
                        Login
                    </Link>

                    <Link
                        className="hover:text-blue-400"
                        href="/logout"
                    >
                        Logout
                    </Link>

                </div>

            </nav>

        </header>
    );
}