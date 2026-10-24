
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            // Mobile menu khula ho to header hide mat karo
            if (menuOpen) {
                setShowHeader(true);
            } else if (currentScrollY < 10 || currentScrollY < lastScrollY) {
                setShowHeader(true);
            } else if (currentScrollY > lastScrollY) {
                setShowHeader(false);
            }

            setLastScrollY(currentScrollY);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY, menuOpen]);

    const linkClass =
        "block py-2 text-white hover:text-blue-400";

    return (
        <header
            className={`
                fixed top-0 left-0 w-full z-50
                bg-black shadow-md
                transition-transform duration-300
                ${showHeader || menuOpen ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            <nav className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-8">
                <Link
                    href="/"
                    className="shrink-0 text-xl font-bold text-red-400 sm:text-2xl"
                    onClick={() => setMenuOpen(false)}
                >
                    My Website
                </Link>

                {/* Desktop menu */}
                <div className="hidden items-center gap-6 text-white md:flex">
                    <Link className={linkClass} href="/register">
                        Register
                    </Link>

                    <Link className={linkClass} href="/">
                        Home
                    </Link>

                    <Link className={linkClass} href="/about">
                        About
                    </Link>

                    <Link className={linkClass} href="/login">
                        Login
                    </Link>

                    <Link className={linkClass} href="/logout">
                        Logout
                    </Link>

                    <Link className={linkClass} href="/cart">
                        🛒 Cart
                    </Link>
                    <Link className={linkClass} href="/dashboard">
                        Dashboard
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="rounded border border-gray-600 px-3 py-2 text-white md:hidden"
                    onClick={() => {
                        setMenuOpen(!menuOpen);
                        setShowHeader(true);
                    }}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                >
                    {menuOpen ? "✕ Close" : "☰ Menu"}
                </button>
            </nav>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="border-t border-gray-700 px-4 pb-3 md:hidden">
                    <Link
                        className={linkClass}
                        href="/register"
                        onClick={() => setMenuOpen(false)}
                    >
                        Register
                    </Link>

                    <Link
                        className={linkClass}
                        href="/"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        className={linkClass}
                        href="/about"
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </Link>

                    <Link
                        className={linkClass}
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </Link>

                    <Link
                        className={linkClass}
                        href="/logout"
                        onClick={() => setMenuOpen(false)}
                    >
                        Logout
                    </Link>

                    <Link
                        className={linkClass}
                        href="/cart"
                        onClick={() => setMenuOpen(false)}
                    >
                        🛒 Cart
                    </Link>
                    <Link className={linkClass} href="/dashboard">
                        Dashboard
                    </Link>
                </div>
            )}
        </header>
    );
}
