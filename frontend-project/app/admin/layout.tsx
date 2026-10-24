
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "▦" },
  { name: "Users", href: "/admin/users", icon: "♙" },
  { name: "Orders", href: "/admin/orders", icon: "▤" },
  { name: "Products", href: "/admin/products", icon: "▣" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setLogoutError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout API failed. Please check backend route.");
      }

      setMenuOpen(false);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Logout nahi ho saka."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="rounded-lg border border-slate-200 p-2 text-xl hover:bg-slate-100 md:hidden"
            >
              ☰
            </button>

            <Link
              href="/admin/dashboard"
              className="text-xl font-extrabold tracking-tight text-slate-900"
            >
              DreamShop
              <span className="ml-2 text-xs font-semibold text-violet-600">
                ADMIN
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              Administration Panel
            </span>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50 sm:px-4"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      {logoutError && (
        <div
          role="alert"
          className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {logoutError}
        </div>
      )}

      <div className="flex min-h-[calc(100vh-8rem)]">
        {/* Mobile backdrop */}
        {menuOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMenu}
            className="fixed inset-0 top-16 z-30 bg-black/40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed bottom-0 left-0 top-16 z-40 w-64 overflow-y-auto bg-slate-900 p-5 text-white transition-transform duration-200 md:sticky md:top-16 md:block md:h-[calc(100vh-4rem)] md:translate-x-0 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="mb-5 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                    active
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-950/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="w-6 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 border-t border-slate-700 pt-5">
            <p className="px-3 text-xs text-slate-400">
              ADMINISTRATION
            </p>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-3 w-full rounded-xl px-4 py-3 text-left text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              ↪ Sign out
            </button>
          </div>
        </aside>

        {/* Page content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Admin Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500 sm:text-sm">
        © {new Date().getFullYear()} DreamShop Admin Panel.
        All rights reserved.
      </footer>
    </div>
  );
}
