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
  <header className="bg-white dark:bg-neutral-800 py-3 shadow">
  <nav className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
    
    {/* Logo */}
    <Link href="/" className="text-xl font-semibold dark:text-white mb-3 sm:mb-0">
      BookYourEvent
    </Link>

    {/* Buttons & Welcome text */}
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      {user ? (
        <>
          <span className="text-blue-500 font-medium">
            Welcome, {user.name} ({user.role})
          </span>
          {user.role === "admin" && (
            <Link href="/admin/add-event" className="text-blue-500 hover:text-blue-700">
              Dashboard
            </Link>
          )}
          {user.role === "user" && (
            <Link href="/my-booking" className="text-blue-500 hover:text-blue-700">
              My Booking
            </Link>
          )}
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
            Logout
          </button>
        </>
      ) : (
        <Link href="/admin/Login" className="text-blue-500 hover:text-blue-700">
          Login
        </Link>
      )}
    </div>

  </nav>
</header>

  );
};

export default Navbar;