import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [formSignIn, setFormSignIn] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormSignIn({ ...formSignIn, [name]: value });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await axios.get("https://683cc42f199a0039e9e35f20.mockapi.io/user", {
        params: { email: formSignIn.email.toLowerCase() },
      });

      const users = resp.data.filter(
        (u) => u.email.toLowerCase() === formSignIn.email.toLowerCase()
      );

      if (users.length === 0) {
        toast.error("No account found with that email.");
        setLoading(false);
        return;
      }

      const found = users[0];
      if (found.password !== formSignIn.password) {
        toast.error("Incorrect password.");
        setLoading(false);
        return;
      }

      const token = `mock-token-${found.id}`;
      localStorage.setItem("token", token);

      const safeUser = {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        role: found.role,
      };
      localStorage.setItem("user", JSON.stringify(safeUser));
      localStorage.setItem("isAuthenticated", "true");

      toast.success("Login successful!");
console.log("Navigating role:", found.role);
      if (found.role === "admin") navigate("/admin");
      else if (found.role === "teacher") navigate("/teacher");
      else if (found.role === "student") navigate("/student");
      
      else navigate("/");

    } catch {
      toast.error("Unable to reach the server. Please try again later.");
    }
    setLoading(false);
  };

//   if (localStorage.getItem("token")) {
//     return <Navigate to="/" />;
//   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center p-6">
      <ToastContainer position="top-center" />
      <div className="bg-indigo-800 shadow-lg rounded-3xl max-w-md w-full p-8">
        <div className="p-0.5 bg-neutral-100 rounded hover:bg-gray-100 flex items-center justify-center mb-6">
          <img src="/logo-h.png" alt="Logo" className="w-35 object-cover" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-100 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-neutral-100 font-medium mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formSignIn.email}
              onChange={handleChangeInput}
              className="w-full px-4 py-2 bg-neutral-100 text-indigo-800 border border-indigo-800 rounded-lg placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-800"
              placeholder="you@tuwaiq.edu.sa"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-neutral-100 font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formSignIn.password}
              onChange={handleChangeInput}
              className="w-full px-4 py-2 bg-neutral-100 text-indigo-800 border border-indigo-800 rounded-lg placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-800"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-neutral-100 text-indigo-800 font-semibold rounded-lg hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <Link
            to="/"
            className="w-full block text-center mt-4 py-2 bg-neutral-200 text-indigo-800 font-semibold rounded-lg hover:bg-neutral-300 transition"
          >
            Home
          </Link>
          <p className="text-neutral-100 text-center mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-300 hover:underline font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
