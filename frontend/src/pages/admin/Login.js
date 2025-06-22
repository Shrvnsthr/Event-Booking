import { useState, useEffect } from "react";
import Navbar from "@/Components/Navbar";
import toast from "react-hot-toast";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "", role: "user" });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      window.location.href = "/"; // Redirect to home if already logged in
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "https://event-booking-4k6b.onrender.com/login" : "https://event-booking-4k6b.onrender.com/signup";

    // Prepare payload: exclude role for login, include for signup
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.username, email: formData.email, password: formData.password, role: formData.role };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(isLogin ? "Login successful" : "Signup successful");
        // Store user data including role
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role, // Store role from login/signup
          token: data.token
        }));
        localStorage.setItem("id", JSON.stringify({ id: data.user.id })); // For backward compatibility
        window.location.href = "/"; // Redirect to home
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      // toast.error(isLogin ? "Invalid email or password!");
      // console.error("Error during submission:", error);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white-900 text-white">
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {isLogin && (
              <div className="mb-4 text-left">
                <a href="#" className="text-blue-400 text-sm hover:underline">
                  Forgot Password?
                </a>
              </div>
            )}

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition">
              {isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}