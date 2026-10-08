"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-2 mt-10">
            <div className="max-w-6xl mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    <div>
                        <h2 className="text-xl font-bold">
                            My Website
                        </h2>
                        <p className="text-gray-400 mt-2">
                            © 2026 My Website. All rights reserved.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Link
                            href="/game"
                            className="hover:text-blue-400"
                        >
                            Game
                        </Link>

                        <Link
                            href="/shopping"
                            className="hover:text-blue-400"
                        >
                            Shopping
                        </Link>

                        <Link
                            href="/login"
                            className="hover:text-blue-400"
                        >
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="hover:text-blue-400"
                        >
                            Register
                        </Link>

                        <Link
                            href="/contact"
                            className="hover:text-blue-400"
                        >
                            Contact
                        </Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}