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
    // Optional: Listen for storage changes across tabs
    window.addEventListener("storage", syncUserFromStorage);
    return () => window.removeEventListener("storage", syncUserFromStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("id"); // Remove id for consistency
    setUser(null); // Update state immediately
    window.location.href = "/"; // Redirect instead of reload for better UX
  };

  return (
    <header className="navbar1 relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <div className="nav-items flex items-center justify-between">
          <Link
            className="flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80"
            href="/"
            aria-label="Brand"
          >
            <span className="navbar-logo inline-flex items-center gap-x-2 text-xl font-semibold dark:text-white">
              BookYourEvent
            </span>
          </Link>
        </div>

        <div className="sm:block">
          <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
            {user ? (
              <>
                <span className="font-medium text-blue-500">
                  Welcome, {user.name} ({user.role})
                </span>
                {user.role === "admin" && (
                  <Link
                    className="font-medium text-blue-500 hover:text-blue-700 focus:outline-none"
                    href="/admin/add-event"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "user" && (
                  <Link
                    className="font-medium text-blue-500 hover:text-blue-700 focus:outline-none"
                    href="/my-booking"
                  >
                    My Booking
                  </Link>
                )}
              
                <button
                  onClick={handleLogout}
                  className="font-medium text-red-500 hover:text-red-700 focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                className="font-medium text-blue-500 hover:text-blue-700 focus:outline-none"
                href="/admin/Login"
                aria-current="page"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;