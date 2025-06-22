import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncUserFromStorage = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    syncUserFromStorage();
    window.addEventListener("storage", syncUserFromStorage);
    return () => window.removeEventListener("storage", syncUserFromStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("id");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="bg-white dark:bg-neutral-800 py-3 shadow">
      <nav className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold text-black dark:text-white mb-3 sm:mb-0"
        >
          BookYourEvent
        </Link>

        {/* User Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {user ? (
            <>
              <span className="font-medium text-blue-500 dark:text-blue-400">
                Welcome, {user.name} ({user.role})
              </span>
              {user.role === "admin" && (
                <Link
                  href="/admin/add-event"
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Dashboard
                </Link>
              )}
              {user.role === "user" && (
                <Link
                  href="/my-booking"
                  className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  My Booking
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/admin/Login"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
